import mongoose from "mongoose";
import { env } from "./env.js";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export async function connectDB(): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, err);
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      } else {
        throw new Error("Failed to connect to MongoDB after max retries");
      }
    }
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});
