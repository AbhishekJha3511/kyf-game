import { db } from "@/lib/db/supabase";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/quiz/quiz-runner";

interface GuestPlayProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function GuestPlayPage({ params }: GuestPlayProps) {
  // 1. Await page framework dynamic route injection parameters
  const { quizId } = await params;

  // 2. Fetch root quiz host information meta data
  const { data: quiz, error: quizError } = await db
    .from("quizzes")
    .select("id, host_name")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return notFound(); // Immediately drop out to 404 sheets if target hash is missing
  }

  // 3. Fetch questions, omitting correct_answer to prevent client network inspections
  const { data: rawQuestions, error: questionsError } = await db
    .from("quiz_questions")
    .select("id, question_text, sort_order")
    .eq("quiz_id", quizId)
    .order("sort_order", { ascending: true });

  if (questionsError || !rawQuestions || rawQuestions.length === 0) {
    return notFound();
  }

  // 4. Map snake_case database rows cleanly into camelCase types expected by UI components
  const sanitizedQuestions = rawQuestions.map((q) => ({
    id: Number(q.id),
    questionText: q.question_text,
    sortOrder: q.sort_order,
  }));

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl z-10 py-6">
        <QuizRunner 
          quizId={quiz.id} 
          hostName={quiz.host_name} 
          questions={sanitizedQuestions} 
        />
      </div>
    </main>
  );
}