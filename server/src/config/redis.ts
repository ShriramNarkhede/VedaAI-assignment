import IORedis from "ioredis";
import { env } from "./env.js";

let redisInstance: IORedis | null = null;

export function getRedisClient(): IORedis {
  if (!redisInstance) {
    redisInstance = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null, // Required by BullMQ
      enableReadyCheck: false,
    });

    redisInstance.on("connect", () => console.log("✅ Redis connected"));
    redisInstance.on("error", (err) => console.error("❌ Redis error:", err));
    redisInstance.on("close", () => console.warn("⚠️  Redis connection closed"));
  }
  return redisInstance;
}

// Shared connection for BullMQ (workers need maxRetriesPerRequest: null)
export const redisConnection = {
  host: new URL(process.env.REDIS_URL ?? "redis://localhost:6379").hostname,
  port: parseInt(new URL(process.env.REDIS_URL ?? "redis://localhost:6379").port || "6379", 10),
};
