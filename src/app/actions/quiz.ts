"use server";

import { db } from "@/lib/db/supabase";
import { CreateQuizSchema, SubmitResponseSchema } from "@/lib/validations/quiz";

interface CreateQuizResult {
  success: boolean;
  quizId?: string;
  ownerToken?: string;
  error?: string;
}

interface SubmitResponseResult {
  success: boolean;
  score?: number;
  totalQuestions?: number;
  error?: string;
}

/**
 * Server Action to generate a brand new quiz instance.
 * Enforces server-side runtime checks before committing rows to the database.
 */
export async function createQuiz(rawInput: unknown): Promise<CreateQuizResult> {
  try {
    // 1. Enforce strict type validation on the server thread
    const parsed = CreateQuizSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.issues[0]?.message || "Invalid quiz data setup." 
      };
    }

    const { hostName, questions } = parsed.data;

    // 2. Insert root Quiz entry
    const { data: quizRow, error: quizError } = await db
      .from("quizzes")
      .insert({ host_name: hostName })
      .select("id, owner_token")
      .single();

    if (quizError || !quizRow) {
      console.error("[Database Error] Failed creating quiz root record:", quizError);
      return { success: false, error: "Failed to initialize game session." };
    }

    // 3. Transform client models to match snake_case DB schemas
    const questionsPayload = questions.map((q) => ({
      quiz_id: quizRow.id,
      question_text: q.questionText,
      correct_answer: q.correctAnswer,
      sort_order: q.sortOrder,
    }));

    // 4. Batch insert all questions in a single network round-trip to minimize overhead
    const { error: questionsError } = await db
      .from("quiz_questions")
      .insert(questionsPayload);

    if (questionsError) {
      console.error("[Database Error] Failed batch inserting quiz questions:", questionsError);
      
      // Attempt clean up of orphaned quiz meta-record to keep DB clean
      await db.from("quizzes").delete().eq("id", quizRow.id);
      
      return { success: false, error: "Failed to commit game configuration." };
    }

    return {
      success: true,
      quizId: quizRow.id,
      ownerToken: quizRow.owner_token,
    };

  } catch (err) {
    console.error("[Server Error] Catastrophic failure in createQuiz handler:", err);
    return { success: false, error: "An unexpected system error occurred." };
  }
}

/**
 * Server Action to grade a guest's submission and log their ranking.
 * Processes grading strictly on the server to prevent front-end answer exposure.
 */
export async function submitResponse(
  quizId: string, 
  rawInput: unknown
): Promise<SubmitResponseResult> {
  try {
    // 1. Enforce validation metrics on incoming payload strings
    const parsed = SubmitResponseSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { 
        success: false, 
        error: parsed.error.issues[0]?.message || "Invalid submission structure." 
      };
    }

    const { guestName, answers } = parsed.data;

    // 2. Fetch ground-truth keys directly from storage
    const { data: groundTruth, error: fetchError } = await db
      .from("quiz_questions")
      .select("id, correct_answer")
      .eq("quiz_id", quizId);

    if (fetchError || !groundTruth || groundTruth.length === 0) {
      console.error("[Database Error] Failed fetching answer verification key:", fetchError);
      return { success: false, error: "Target quiz instance not found." };
    }

    // 3. Process calculations server-side so cheating is impossible via network tabs
    let score = 0;
    const totalQuestions = groundTruth.length;

    // Fast-lookup map optimization to avoid expensive O(N*M) nested looping evaluations
    const answerKeyMap = new Map<string, string>(
      groundTruth.map((item) => [String(item.id), item.correct_answer.toLowerCase().trim()])
    );

    answers.forEach((submission) => {
      const correctAnswer = answerKeyMap.get(String(submission.questionId));
      if (correctAnswer && correctAnswer === submission.chosenAnswer.toLowerCase().trim()) {
        score++;
      }
    });

    // 4. Log the immutable scorecard outcome onto the global leaderboard data layer
    const { error: insertError } = await db
      .from("guest_responses")
      .insert({
        quiz_id: quizId,
        guest_name: guestName,
        score: score,
        total_questions: totalQuestions,
      });

    if (insertError) {
      console.error("[Database Error] Failed committing guest response entry:", insertError);
      return { success: false, error: "Failed to broadcast your score to leaderboard." };
    }

    return {
      success: true,
      score,
      totalQuestions,
    };

  } catch (err) {
    console.error("[Server Error] Catastrophic failure in submitResponse handler:", err);
    return { success: false, error: "An unexpected system error occurred." };
  }
}