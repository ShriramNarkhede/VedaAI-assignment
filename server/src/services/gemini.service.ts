import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import {
  buildQuestionPaperPrompt,
  GENERATION_CONFIG,
  PromptContext,
} from "../prompts/questionPaperPrompt.js";
import { AIResponseSchema, AIResponseInput } from "../validators/assignment.validator.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-2.5-flash";

export async function generatePaper(ctx: PromptContext): Promise<AIResponseInput> {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: GENERATION_CONFIG,
  });

  const prompt = buildQuestionPaperPrompt(ctx);

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    rawText = response.text();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown Gemini API error";
    throw new Error(`Gemini API call failed: ${message}`);
  }

  // Strip any accidental markdown code fences
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```$/m, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned non-JSON response: ${cleaned.slice(0, 200)}`);
  }

  const validated = AIResponseSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `AI response failed schema validation: ${JSON.stringify(validated.error.flatten())}`
    );
  }

  return validated.data;
}
