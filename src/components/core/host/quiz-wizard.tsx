"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { sampleRandomQuestions, type PresetQuestion } from "@/lib/constants/questions";
import { createQuiz } from "@/app/actions/quiz";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Shuffle, Sparkles, Zap, ArrowLeft } from "lucide-react";

type WizardStep = "IDENTITY" | "QUESTIONS";

export function QuizWizard() {
  const router = useRouter();
  const [, setOwnership] = useLocalStorage<Record<string, string>>("kyf_owned_quizzes", {});

  const [step, setStep] = React.useState<WizardStep>("IDENTITY");
  const [hostName, setHostName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  
  const [questions, setQuestions] = React.useState<PresetQuestion[]>([]);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [submissionError, setSubmissionError] = React.useState("");
  const [isDeploying, setIsDeploying] = React.useState(false);

  const handleProceedToQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim() || hostName.trim().length < 2) {
      setNameError("Please enter a name with at least 2 characters.");
      return;
    }
    setNameError("");
    setQuestions(sampleRandomQuestions(10));
    setStep("QUESTIONS");
  };

  const handleReshuffleQuestions = () => {
    setQuestions(sampleRandomQuestions(10));
    setAnswers({});
  };

  const handleLaunchGame = async () => {
    setSubmissionError("");
    const nonBlankAnswers = questions.filter((q) => answers[q.id]?.trim());
    if (nonBlankAnswers.length < 10) {
      setSubmissionError("Please fill out all 10 question blocks before deploying.");
      return;
    }

    setIsDeploying(true);
    const payload = {
      hostName: hostName.trim(),
      questions: questions.map((q, idx) => ({
        questionText: q.text,
        correctAnswer: answers[q.id].trim(),
        sortOrder: idx + 1,
      })),
    };

    const result = await createQuiz(payload);
    if (!result.success || !result.quizId || !result.ownerToken) {
      setSubmissionError(result.error || "An internal transaction error occurred.");
      setIsDeploying(false);
      return;
    }

    setOwnership((prev) => ({ ...prev, [result.quizId!]: result.ownerToken! }));
    router.push(`/host/${result.quizId}`);
  };

  return (
    <AnimatePresence mode="wait">
      {step === "IDENTITY" ? (
        <motion.div
          key="identity-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full flex flex-col items-start text-left space-y-8 px-4"
        >
          {/* Hero Context Header Stack */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-purple-400 tracking-wide uppercase shadow-sm">
              <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
              <span>Viral trivia, zero friction</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.05]">
              How well do your friends actually know you?
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-lg">
              Build a personal flashcard quiz in 60 seconds. Share the link. Watch the leaderboard expose who&apos;s been paying attention.
            </p>
          </div>

          {/* Floating Form Glass Input Container */}
          <form 
            onSubmit={handleProceedToQuestions} 
            className="w-full max-w-xl bg-zinc-900/30 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-4"
          >
            <Input
              label="What's your name?"
              placeholder="e.g. Sarah"
              value={hostName}
              onChange={(e) => {
                setHostName(e.target.value);
                if (nameError) setNameError("");
              }}
              error={nameError}
              maxLength={50}
              required
            />
            <Button type="submit" className="w-full">
              <Sparkles className="w-4 h-4 mr-2 text-violet-200 fill-violet-200" />
              Start Building
            </Button>
            <div className="text-center text-[11px] text-zinc-600 font-medium tracking-wide">
              No account • No email • Just a link
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="questions-panel"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl mx-auto px-4 space-y-6"
        >
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setStep("IDENTITY")}
              className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-zinc-200 transition-colors uppercase tracking-wider gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <Button
              variant="outline"
              type="button"
              onClick={handleReshuffleQuestions}
              className="h-9 px-4 text-xs font-semibold text-zinc-400 border-zinc-800 hover:bg-zinc-900"
            >
              <Shuffle className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              Shuffle Prompts
            </Button>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Set Your Answers</h2>
            <p className="text-xs text-zinc-500 font-medium">Your entries will be saved on the server as the ground truth answer key.</p>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-xl space-y-3 transition-colors hover:border-zinc-800/60"
              >
                <div className="flex items-start space-x-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-purple-400">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-zinc-200 pt-0.5">{q.text}</p>
                </div>
                <Input
                  placeholder="Lock in your answer..."
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  maxLength={200}
                  required
                />
              </div>
            ))}
          </div>

          {submissionError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/50 text-xs font-semibold text-rose-400">
              {submissionError}
            </div>
          )}

          <Button
            type="button"
            onClick={handleLaunchGame}
            isLoading={isDeploying}
            className="w-full shadow-lg"
          >
            Generate Quiz Link
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}