import { db } from "@/lib/db/supabase";
import { notFound } from "next/navigation";
import { ShareCard } from "@/components/shared/share-card";
import { LeaderboardTable, type LeaderboardEntry } from "@/components/shared/leaderboard-table";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface HostDashboardProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function HostDashboardPage({ params }: HostDashboardProps) {
  const { quizId } = await params;

  const { data: quiz, error: quizError } = await db
    .from("quizzes")
    .select("id, host_name")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return notFound();
  }

  const { data: responses } = await db
    .from("guest_responses")
    .select("id, guest_name, score, total_questions, completed_at")
    .eq("quiz_id", quizId)
    .order("score", { ascending: false })
    .order("completed_at", { ascending: true });

  const entries: LeaderboardEntry[] = responses || [];

  return (
    <main className="min-h-screen w-full bg-white text-zinc-50 p-4 sm:p-6 flex flex-col items-center relative overflow-x-hidden">
      
      {/* Decorative fine-grain ambient gradient light overlay to match onboarding accent rules */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-900/15 blur-3xl" />
      </div>

      <div className="w-full max-w-xl space-y-6 py-8 sm:py-12 z-10">
        
        {/* Navigation Action Hook */}
        <Link 
          href="/" 
          className="inline-flex items-center text-[10px] font-bold text-zinc-500 hover:text-zinc-200 transition-colors uppercase tracking-widest gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Create New Quiz
        </Link>

        {/* Header Branding Row */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-purple-400 tracking-wider uppercase shadow-sm">
            <LayoutDashboard className="w-3 h-3" />
            <span>Admin Control Panel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-500 leading-tight">
            {quiz.host_name}&apos;s Game Hub
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed">
            Live metrics tracker deck. Keep this page open or save it to monitor your custom quiz results as your friends lock in their responses.
          </p>
        </div>

        {/* Share Utility Control Block Card */}
        <ShareCard quizId={quiz.id} hostName={quiz.host_name} />

        {/* Sorted Dynamic Scoring List Table */}
        <LeaderboardTable entries={entries} />
        
      </div>
    </main>
  );
}