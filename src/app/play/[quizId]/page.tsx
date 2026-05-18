import { db } from "@/lib/db/supabase";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/quiz/quiz-runner";

interface GuestPlayProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function GuestPlayPage({ params }: GuestPlayProps) {
  const { quizId } = await params;

  const { data: quiz, error: quizError } = await db
    .from("quizzes")
    .select("id, host_name")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return notFound();
  }

  const { data: rawQuestions, error: questionsError } = await db
    .from("quiz_questions")
    .select("id, question_text, sort_order")
    .eq("quiz_id", quizId)
    .order("sort_order", { ascending: true });

  if (questionsError || !rawQuestions || rawQuestions.length === 0) {
    return notFound();
  }

  const sanitizedQuestions = rawQuestions.map((q) => ({
    id: Number(q.id),
    questionText: q.question_text,
    sortOrder: q.sort_order,
  }));

  return (
    <main className="min-h-screen w-full bg-white text-zinc-50 flex items-center justify-center p-4 relative overflow-x-hidden">
      
      {/* Structural ambient aesthetic background accent layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl z-10 py-6">
        {/* Mount the modernized high-performance interactive game engine */}
        <QuizRunner 
          quizId={quiz.id} 
          hostName={quiz.host_name} 
          questions={sanitizedQuestions} 
        />
      </div>
    </main>
  );
}