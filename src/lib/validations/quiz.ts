// src/lib/validations/quiz.ts
import { z } from "zod";

export const CreateQuizSchema = z.object({
  hostName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .transform((val) => val.trim()),
  questions: z
    .array(
      z.object({
        questionText: z.string().min(5, "Question text is too short.").max(300),
        correctAnswer: z.string().min(1, "Answer cannot be left blank.").max(200),
        sortOrder: z.number().int(),
      })
    )
    // Modified: Scaled up to enforce a minimum of 10 questions for richer gameplay
    .min(10, "You must include at least 10 questions to launch a game.")
    .max(20, "Maximum of 20 questions permitted."),
});

export const SubmitResponseSchema = z.object({
  guestName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .transform((val) => val.trim()),
  answers: z.array(
    z.object({
      questionId: z.number().int(),
      chosenAnswer: z.string().min(1),
    })
  ),
});

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;
export type SubmitResponseInput = z.infer<typeof SubmitResponseSchema>;