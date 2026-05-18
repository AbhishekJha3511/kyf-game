import { QuizWizard } from "@/components/host/quiz-wizard";

/**
 * Root Landing Page for Know Your Friends (KYF).
 * Server-rendered by default to ensure perfect SEO indexing, fast initial
 * paint (FCP), and instantaneous HTML structure delivery.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-indigo-50/50 via-slate-50 to-white flex items-center justify-center p-4">
      {/* Decorative ambient blurred gradients to establish a playful/modern aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-pink-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl z-10 py-8 sm:py-12">
        <QuizWizard />

        {/* Subtle, accessible footer info */}
        <footer className="mt-12 text-center text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} KYF • Zero friction, instant fun.
          Made with ❤️ by the KYF Team.
        </footer>
      </div>
    </main>
  );
}
