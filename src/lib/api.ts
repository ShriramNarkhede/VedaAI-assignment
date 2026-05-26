const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface CreateAssignmentPayload {
  questionTypes: QuestionType[];
  dueDate?: string;
  additionalInfo?: string;
}

export interface CreateAssignmentResponse {
  success: boolean;
  assignmentId: string;
  jobId: string;
}

export interface Assignment {
  _id: string;
  questionTypes: QuestionType[];
  totalQuestions: number;
  totalMarks: number;
  status: string;
  dueDate?: string;
  additionalInfo?: string;
  createdAt: string;
  jobId?: string;
  errorMessage?: string;
}

export interface AssignmentsResponse {
  success: boolean;
  assignments: Assignment[];
}

export interface Question {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  sections: Section[];
  metadata: {
    totalQuestions: number;
    totalMarks: number;
    generatedAt: string;
  };
}

export interface PaperResponse {
  success: boolean;
  paper: GeneratedPaper;
}

export interface StatusResponse {
  success: boolean;
  status: string;
  jobId?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed: ${res.status}`);
  }
  return data as T;
}

export const api = {
  createAssignment(payload: CreateAssignmentPayload): Promise<CreateAssignmentResponse> {
    return request<CreateAssignmentResponse>("/api/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAssignments(): Promise<AssignmentsResponse> {
    return request<AssignmentsResponse>("/api/assignments");
  },

  getStatus(assignmentId: string): Promise<StatusResponse> {
    return request<StatusResponse>(`/api/assignments/${assignmentId}/status`);
  },

  getPaper(assignmentId: string): Promise<PaperResponse> {
    return request<PaperResponse>(`/api/assignments/${assignmentId}/paper`);
  },

  getPdfUrl(assignmentId: string): string {
    return `${API_BASE}/api/assignments/${assignmentId}/pdf`;
  },

  deleteAssignment(assignmentId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/assignments/${assignmentId}`, {
      method: "DELETE",
    });
  },
};
