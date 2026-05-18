import { Smile, Trophy } from "lucide-react";

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
      <div className="w-full bg-zinc-500/10 rounded-2xl border border-zinc-900 p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
          <Smile className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-600">No entries recorded yet</p>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium leading-relaxed">
            As soon as friends engage your shared link, their grades and standings will update here in real time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900/20 rounded-2xl border border-zinc-900 shadow-xl overflow-hidden">
      {/* Header Panel */}
      <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/40">
        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-purple-400" />
          Live Standings Scoreboard
        </h4>
        <span className="text-[11px] font-bold text-purple-400 bg-purple-950/40 border border-purple-900/50 px-2.5 py-0.5 rounded-full tracking-wide">
          {entries.length} {entries.length === 1 ? "Player" : "Players"}
        </span>
      </div>

      {/* Row Split Content Deck */}
      <div className="divide-y divide-zinc-900 max-h-[380px] overflow-y-auto scrollbar-thin">
        {entries.map((entry, idx) => {
          const isGold = idx === 0;
          const isSilver = idx === 1;
          const isBronze = idx === 2;
          
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-900/30"
            >
              <div className="flex items-center space-x-4 min-w-0">
                {/* Positional Placement Badges */}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[10px] font-black ${
                    isGold ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                    isSilver ? "bg-slate-300/10 border-slate-300/30 text-slate-300" :
                    isBronze ? "bg-orange-500/10 border-orange-500/30 text-orange-400" :
                    "bg-zinc-950 border-zinc-800 text-zinc-500"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-zinc-200 truncate pr-2 tracking-tight">
                  {entry.guest_name}
                </span>
              </div>

              {/* Dynamic Score Indicator Layout */}
              <div className="flex items-baseline space-x-1 shrink-0">
                <span className="text-base font-black text-zinc-100 tracking-tight">
                  {entry.score}
                </span>
                <span className="text-[11px] font-bold text-zinc-600">
                  /{entry.total_questions}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}