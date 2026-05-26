import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ?? "";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
    socket.connect();
  }
  return socket;
}

export interface JobStatusEvent {
  jobId: string;
  status: string;
  message?: string;
  timestamp: number;
}

export interface JobCompletedEvent {
  jobId: string;
  paper: { assignmentId: string };
  timestamp: number;
}

export interface JobFailedEvent {
  jobId: string;
  error: string;
  timestamp: number;
}

export type StatusCallback = (event: JobStatusEvent) => void;
export type CompletedCallback = (event: JobCompletedEvent) => void;
export type FailedCallback = (event: JobFailedEvent) => void;

/**
 * Subscribe to real-time job events for a given jobId.
 * Returns a cleanup function — call it when the component unmounts.
 */
export function subscribeToJob(
  jobId: string,
  onStatus: StatusCallback,
  onCompleted: CompletedCallback,
  onFailed: FailedCallback
): () => void {
  const s = getSocket();

  s.emit("join:job", jobId);
  s.on("job:status", onStatus);
  s.on("job:completed", onCompleted);
  s.on("job:failed", onFailed);

  return () => {
    s.off("job:status", onStatus);
    s.off("job:completed", onCompleted);
    s.off("job:failed", onFailed);
  };
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
