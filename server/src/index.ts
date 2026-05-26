import "dotenv/config";
import http from "http";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocketIO } from "./sockets/index.js";
import { env } from "./config/env.js";

// ─── Import worker to register it in the same process by default ──────────────
// This allows running the server and worker in a single Railway service.
// Can be disabled by setting DISABLE_IN_PROCESS_WORKER=true.
if (process.env.DISABLE_IN_PROCESS_WORKER !== "true") {
  import("./workers/paper.worker.js").catch(console.error);
}

async function bootstrap(): Promise<void> {
  // 1. Connect to database
  await connectDB();

  // 2. Create Express app
  const app = createApp();

  // 3. Create HTTP server and attach Socket.io
  const httpServer = http.createServer(app);
  initSocketIO(httpServer);

  // 4. Start listening
  const port = parseInt(env.PORT, 10);
  httpServer.listen(port, () => {
    console.log(`\n🚀 VedaAI Server running on http://localhost:${port}`);
    console.log(`📡 Socket.io ready`);
    console.log(`🌐 CORS origin: ${env.FRONTEND_URL}`);
    console.log(`\n📌 API endpoints:`);
    console.log(`   POST /api/assignments           — Create assignment`);
    console.log(`   GET  /api/assignments/:id       — Get assignment`);
    console.log(`   GET  /api/assignments/:id/status — Get status`);
    console.log(`   GET  /api/assignments/:id/paper  — Get generated paper`);
    console.log(`   GET  /api/assignments/:id/pdf    — Download PDF\n`);
  });

  // 5. Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received, shutting down...");
    httpServer.close(() => {
      console.log("✅ HTTP server closed");
      process.exit(0);
    });
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
