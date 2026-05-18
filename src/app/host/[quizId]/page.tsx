import { db } from "@/lib/db/supabase";
import { notFound } from "next/navigation";
import { ShareCard } from "@/components/shared/share-card";
import { LeaderboardTable, type LeaderboardEntry } from "@/components/shared/leaderboard-table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HostDashboardProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function HostDashboardPage({ params }: HostDashboardProps) {
  // 1. Resolve dynamic path variables asynchronously matching Next.js specifications
  const { quizId } = await params;

  // 2. Query target quiz record
  const { data: quiz, error: quizError } = await db
    .from("quizzes")
    .select("id, host_name")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return notFound(); // Automatically maps execution timeline straight to global 404 sheets
  }

  // 3. Query associated guest leaderboard responses ordered by score
  const { data: responses } = await db
    .from("guest_responses")
    .select("id, guest_name, score, total_questions, completed_at")
    .eq("quiz_id", quizId)
    .order("score", { ascending: false })
    .order("completed_at", { ascending: true });

  const entries: LeaderboardEntry[] = responses || [];

  return (
    <main className="min-h-screen w-full bg-slate-50/50 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6 py-6 sm:py-10">
        
        {/* Simple navigation line */}
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wider gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Create New Quiz
        </Link>

        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {quiz.host_name}&apos;s Game Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Live scoreboard tracking panel. Keep this page open or bookmark it to watch responses roll in.
          </p>
        </div>

        {/* Share utilities module */}
        <ShareCard quizId={quiz.id} hostName={quiz.host_name} />

        {/* Sorted response board matrix */}
        <LeaderboardTable entries={entries} />
        
      </div>
    </main>
  );
}