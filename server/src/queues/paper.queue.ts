import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export interface PaperJobData {
  assignmentId: string;
}

export const PAPER_QUEUE_NAME = "paper-generation";

export const paperQueue = new Queue<PaperJobData>(PAPER_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

paperQueue.on("error", (err) => {
  console.error("❌ Paper queue error:", err);
});
