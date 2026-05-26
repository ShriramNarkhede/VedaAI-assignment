import { IQuestionType } from "../models/Assignment.js";

// Difficulty distribution per question count
const DIFFICULTY_SPLIT = {
  easy: 0.4,
  medium: 0.4,
  hard: 0.2,
};

// Map frontend question types to concise AI labels
const TYPE_MAP: Record<string, string> = {
  "Multiple Choice Questions": "MCQ",
  "Short Questions": "Short Answer",
  "Long Questions": "Long Answer",
  "Diagram/Graph-Based Questions": "Diagram/Graph",
  "Numerical Problems": "Numerical",
};

export interface PromptContext {
  questionTypes: IQuestionType[];
  additionalInfo?: string;
  totalQuestions: number;
  totalMarks: number;
}

/**
 * Builds a token-efficient, schema-focused prompt for Gemini 2.0 Flash.
 * Strict JSON output schema is embedded to ensure parseable responses.
 */
export function buildQuestionPaperPrompt(ctx: PromptContext): string {
  const sections = ctx.questionTypes
    .filter((q) => q.count > 0)
    .map((q, i) => {
      const label = TYPE_MAP[q.type] ?? q.type;
      const marksPerQ = q.marks;
      const total = q.count * marksPerQ;
      const easyN = Math.ceil(q.count * DIFFICULTY_SPLIT.easy);
      const hardN = Math.floor(q.count * DIFFICULTY_SPLIT.hard);
      const medN = q.count - easyN - hardN;
      return `Section ${String.fromCharCode(65 + i)}: ${label}, ${q.count} questions, ${marksPerQ} mark(s) each (total ${total}). Difficulty: ${easyN} easy, ${medN} medium, ${hardN} hard.`;
    })
    .join("\n");

  const extra = ctx.additionalInfo ? `\nExtra context: ${ctx.additionalInfo}` : "";

  return `Generate a structured academic question paper.

Requirements:
${sections}
Total: ${ctx.totalQuestions} questions, ${ctx.totalMarks} marks.${extra}

Rules:
- Questions must be academically appropriate and clearly worded
- No repeated questions
- difficulty must be exactly: "easy", "medium", or "hard"
- marks must be a positive integer
- Return ONLY valid JSON, no markdown, no explanation

Output schema (strict):
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions.",
      "questions": [
        {
          "question": "string",
          "difficulty": "easy|medium|hard",
          "marks": number
        }
      ]
    }
  ]
}`;
}

export const GENERATION_CONFIG = {
  maxOutputTokens: 8192,
  temperature: 0.4,
  topP: 0.8,
  topK: 40,
  responseMimeType: "application/json",
};
