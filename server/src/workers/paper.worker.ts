import "dotenv/config";
import { Worker, Job } from "bullmq";
import { connectDB } from "../config/db.js";
import { redisConnection } from "../config/redis.js";
import { PAPER_QUEUE_NAME, PaperJobData } from "../queues/paper.queue.js";
import { Assignment } from "../models/Assignment.js";
import { GeneratedPaper } from "../models/GeneratedPaper.js";
import { generatePaper } from "../services/gemini.service.js";
import { emitJobStatus, emitJobCompleted, emitJobFailed } from "../sockets/index.js";

async function processPaperJob(job: Job<PaperJobData>): Promise<void> {
  const { assignmentId } = job.data;
  const jobId = job.id ?? `paper-${assignmentId}`;

  console.log(`⚙️  Processing job ${jobId} for assignment ${assignmentId}`);

  // ── 1. Mark as processing ─────────────────────────────────────────────────
  await Assignment.findByIdAndUpdate(assignmentId, { status: "processing" });
  emitJobStatus(jobId, "processing", "Starting generation...");

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  // ── 2. Mark as generating and call Gemini ─────────────────────────────────
  await Assignment.findByIdAndUpdate(assignmentId, { status: "generating" });
  emitJobStatus(jobId, "generating", "AI is generating your question paper...");

  const aiResult = await generatePaper({
    questionTypes: assignment.questionTypes,
    additionalInfo: assignment.additionalInfo,
    totalQuestions: assignment.totalQuestions,
    totalMarks: assignment.totalMarks,
  });

  // ── 3. Compute metadata ───────────────────────────────────────────────────
  const totalQuestions = aiResult.sections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );
  const totalMarks = aiResult.sections.reduce(
    (sum, s) => s.questions.reduce((qSum, q) => qSum + q.marks, sum),
    0
  );

  // ── 4. Save GeneratedPaper ────────────────────────────────────────────────
  const paper = await GeneratedPaper.create({
    assignmentId: assignment._id,
    sections: aiResult.sections,
    metadata: {
      totalQuestions,
      totalMarks,
      generatedAt: new Date(),
    },
  });

  // ── 5. Mark assignment completed ──────────────────────────────────────────
  await Assignment.findByIdAndUpdate(assignmentId, { status: "completed" });
  emitJobStatus(jobId, "completed", "Question paper ready!");
  emitJobCompleted(jobId, {
    assignmentId,
    paper: paper.toObject(),
  });

  console.log(`✅ Job ${jobId} completed. Paper: ${paper._id}`);
}

// ─── Worker bootstrap ─────────────────────────────────────────────────────────

async function startWorker(): Promise<void> {
  await connectDB();
  console.log("🚀 Paper generation worker started");

  const worker = new Worker<PaperJobData>(
    PAPER_QUEUE_NAME,
    processPaperJob,
    {
      connection: redisConnection,
      concurrency: 3,
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on("failed", async (job, err) => {
    if (!job) return;
    const { assignmentId } = job.data;
    const jobId = job.id ?? `paper-${assignmentId}`;
    console.error(`❌ Job ${jobId} failed:`, err.message);

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "failed",
      errorMessage: err.message,
    }).catch(() => {});

    emitJobFailed(jobId, err.message);
  });

  worker.on("error", (err) => {
    console.error("❌ Worker error:", err);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("🛑 Shutting down worker...");
    await worker.close();
    process.exit(0);
  });
}

startWorker().catch((err) => {
  console.error("❌ Worker failed to start:", err);
  process.exit(1);
});
