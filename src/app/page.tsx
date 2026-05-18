import { QuizWizard } from "@/components/host/quiz-wizard";
import { Heart, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/core/theme-toggle"; // <-- Import it

/**
 * Premium Dark Theme Landing Page for KnowMe (KYF).
 * Styled to perfectly match the high-conversion minimalist bento architecture.
 */
export default function LandingPage() {
  return (
    <main
      className="min-h-screen w-full bg-white   
 text-zinc-50 flex flex-col justify-between p-4 relative overflow-x-hidden select-none"
    >
      {/* 1. Minimalist Top Navigation Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 px-2 sm:px-6 z-20">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-500">
            KnowMe
          </span>
        </div>
        {/* Top Right Cluster: Status Text + Toggle */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-xs text-zinc-500 font-medium tracking-wide">
            No sign-up • Just vibes
          </div>
          <ThemeToggle /> {/* <-- The Toggle lives here! */}
        </div>
      </header>

      {/* 2. Interactive App Layer Core */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex items-center justify-center z-10 py-10 sm:py-16">
        <QuizWizard />
      </div>

      {/* 3. Static 3-Column Bento Informational Process Footer Grid */}
      <footer className="w-full max-w-4xl mx-auto space-y-10 pb-8 pt-4 z-20 border-t border-zinc-900/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-xs font-bold text-purple-400 shadow-inner">
                1
              </span>
              <h4 className="text-sm font-semibold text-zinc-500 tracking-wide">
                Answer questions
              </h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed pl-9 font-medium">
              Set your truth — pick from our verified randomized prompt pool or
              write custom answers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-xs font-bold text-purple-400 shadow-inner">
                2
              </span>
              <h4 className="text-sm font-semibold text-zinc-500 tracking-wide">
                Share the link
              </h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed pl-9 font-medium">
              Drop your custom code string link directly into your group chat
              across WhatsApp, iMessage, or Discord.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-xs font-bold text-purple-400 shadow-inner">
                3
              </span>
              <h4 className="text-sm font-semibold text-zinc-500 tracking-wide">
                Watch them sweat
              </h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed pl-9 font-medium">
              Our real-time tracking leaderboards immediately expose who has
              been paying attention.
            </p>
          </div>
        </div>

        {/* Brand signature baseline marker */}
        <div className="text-center text-[11px] text-zinc-600 font-medium tracking-wide flex items-center justify-center gap-1">
          Made with{" "}
          <Heart className="w-3 h-3 text-rose-600 fill-rose-600 inline" /> for
          friend groups everywhere.
        </div>
      </footer>
    </main>
  );
}
