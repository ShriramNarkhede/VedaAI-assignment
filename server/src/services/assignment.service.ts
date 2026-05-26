import { Assignment, IAssignment } from "../models/Assignment.js";
import { GeneratedPaper, IGeneratedPaper } from "../models/GeneratedPaper.js";
import { CreateAssignmentInput } from "../validators/assignment.validator.js";
import { paperQueue } from "../queues/paper.queue.js";
import { Types } from "mongoose";

export async function createAssignment(
  data: CreateAssignmentInput
): Promise<{ assignmentId: string; jobId: string }> {
  const totalQuestions = data.questionTypes.reduce((a, r) => a + r.count, 0);
  const totalMarks = data.questionTypes.reduce((a, r) => a + r.count * r.marks, 0);

  const assignment = await Assignment.create({
    dueDate: data.dueDate,
    additionalInfo: data.additionalInfo,
    questionTypes: data.questionTypes,
    totalQuestions,
    totalMarks,
    status: "queued",
  });

  const assignmentId = (assignment._id as Types.ObjectId).toString();

  const job = await paperQueue.add(
    "generate-paper",
    { assignmentId },
    {
      jobId: `paper-${assignmentId}`,
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: { age: 86400 }, // keep 24h
      removeOnFail: { age: 604800 }, // keep 7d
    }
  );

  const jobId = job.id ?? `paper-${assignmentId}`;
  await Assignment.findByIdAndUpdate(assignmentId, { jobId });

  return { assignmentId, jobId };
}

export async function getAssignment(id: string): Promise<IAssignment | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  return Assignment.findById(id).lean() as unknown as Promise<IAssignment | null>;
}

export async function getPaper(assignmentId: string): Promise<IGeneratedPaper | null> {
  if (!Types.ObjectId.isValid(assignmentId)) return null;
  return GeneratedPaper.findOne({ assignmentId }).lean() as unknown as Promise<IGeneratedPaper | null>;
}

export async function updateAssignmentStatus(
  assignmentId: string,
  status: IAssignment["status"],
  errorMessage?: string
): Promise<void> {
  await Assignment.findByIdAndUpdate(assignmentId, {
    status,
    ...(errorMessage ? { errorMessage } : {}),
  });
}
