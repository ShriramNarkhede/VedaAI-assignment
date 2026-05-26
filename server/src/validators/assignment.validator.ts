import { z } from "zod";

export const QuestionTypeSchema = z.object({
  type: z
    .string()
    .trim()
    .min(1, "Question type cannot be empty")
    .max(100, "Question type too long"),
  count: z
    .number({ required_error: "Count is required" })
    .int("Count must be a whole number")
    .min(1, "Count must be at least 1")
    .max(100, "Count cannot exceed 100"),
  marks: z
    .number({ required_error: "Marks is required" })
    .int("Marks must be a whole number")
    .min(1, "Marks must be at least 1")
    .max(100, "Marks cannot exceed 100"),
});

export const CreateAssignmentSchema = z
  .object({
    dueDate: z
      .string()
      .optional()
      .transform((v) => (v ? new Date(v) : undefined))
      .pipe(
        z
          .date()
          .min(new Date(), "Due date must be in the future")
          .optional()
      ),
    additionalInfo: z.string().trim().max(1000).optional(),
    questionTypes: z
      .array(QuestionTypeSchema)
      .min(1, "At least one question type is required")
      .max(10, "Cannot have more than 10 question types"),
  })
  .superRefine((data, ctx) => {
    const totalQ = data.questionTypes.reduce((a, r) => a + r.count, 0);
    if (totalQ < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total questions must be at least 1",
        path: ["questionTypes"],
      });
    }
    if (totalQ > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total questions cannot exceed 200",
        path: ["questionTypes"],
      });
    }
  });

export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;

// Zod schema for validating the AI response structure
export const AIResponseSchema = z.object({
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        instruction: z.string().min(1),
        questions: z
          .array(
            z.object({
              question: z.string().min(1),
              difficulty: z.enum(["easy", "medium", "hard"]),
              marks: z.number().int().min(1),
            })
          )
          .min(1),
      })
    )
    .min(1),
});

export type AIResponseInput = z.infer<typeof AIResponseSchema>;
