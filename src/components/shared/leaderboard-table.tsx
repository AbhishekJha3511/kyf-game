import { Smile } from "lucide-react";

export interface LeaderboardEntry {
  id: number;
  guest_name: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Smile className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">No responses yet</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            As soon as your friends tap your link and guess your answers, their standings will rank here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Friend Standings</h4>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {entries.length} {entries.length === 1 ? "submission" : "submissions"}
        </span>
      </div>

      <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
        {entries.map((entry, idx) => {
          const isTopThree = idx < 3;
          
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50/40"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    idx === 0 ? "bg-amber-100 text-amber-700" :
                    idx === 1 ? "bg-slate-200 text-slate-700" :
                    idx === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-50 text-slate-400"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-slate-800 truncate pr-2">
                  {entry.guest_name}
                </span>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <span className="text-base font-extrabold text-slate-900">{entry.score}</span>
                <span className="text-xs font-medium text-slate-400">/{entry.total_questions}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}