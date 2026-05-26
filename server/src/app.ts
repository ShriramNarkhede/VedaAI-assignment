import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { assignmentRouter } from "./routes/assignment.routes.js";

export function createApp() {
  const app = express();

  // ─── Middleware ─────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Health check ────────────────────────────────────────────────────────────
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ─── API routes ──────────────────────────────────────────────────────────────
  app.use("/api/assignments", assignmentRouter);

  // ─── 404 handler ─────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
  });

  // ─── Global error handler ─────────────────────────────────────────────────────
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : "Internal server error";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("❌ Unhandled error:", stack ?? message);
    res.status(500).json({ success: false, error: message });
  });

  return app;
}
