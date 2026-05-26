import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { env } from "../config/env.js";

let io: SocketIOServer | null = null;

export function initSocketIO(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("join:job", (jobId: string) => {
      socket.join(`job:${jobId}`);
      console.log(`👂 Socket ${socket.id} joined room job:${jobId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocketIO first.");
  return io;
}

// ─── Emit helpers ────────────────────────────────────────────────────────────

export function emitJobStatus(
  jobId: string,
  status: string,
  message?: string
): void {
  getIO()
    .to(`job:${jobId}`)
    .emit("job:status", { jobId, status, message, timestamp: Date.now() });
}

export function emitJobCompleted(jobId: string, paper: unknown): void {
  getIO()
    .to(`job:${jobId}`)
    .emit("job:completed", { jobId, paper, timestamp: Date.now() });
}

export function emitJobFailed(jobId: string, error: string): void {
  getIO()
    .to(`job:${jobId}`)
    .emit("job:failed", { jobId, error, timestamp: Date.now() });
}
