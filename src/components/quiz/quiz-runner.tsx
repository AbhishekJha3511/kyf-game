"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { submitResponse } from "@/app/actions/quiz";
import { ArrowRight, Sparkles, Trophy, HelpCircle, UserCheck } from "lucide-react";

interface ObfuscatedQuestion {
  id: number;
  questionText: string;
  sortOrder: number;
}

interface QuizRunnerProps {
  quizId: string;
  hostName: string;
  questions: ObfuscatedQuestion[];
}

type GameState = "GUEST_IDENTITY" | "PLAYING" | "SCORED";

export function QuizRunner({ quizId, hostName, questions }: QuizRunnerProps) {
  const [gameState, setGameState] = React.useState<GameState>("GUEST_IDENTITY");
  const [guestName, setGuestName] = React.useState("");
  const [nameError, setNameError] = React.useState("");

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentInput, setCurrentInput] = React.useState("");
  const [savedAnswers, setSavedAnswers] = React.useState<Array<{ questionId: number; chosenAnswer: string }>>([]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [finalScore, setFinalScore] = React.useState<{ score: number; total: number } | null>(null);
  const [submissionError, setSubmissionError] = React.useState("");

  const activeQuestion = questions[currentIndex];
  // Calculate true progressive mathematical percentage bounds safely
  const progressPercentage = ((currentIndex) / questions.length) * 100;

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || guestName.trim().length < 2) {
      setNameError("Please enter your name (at least 2 characters) to unlock the challenge.");
      return;
    }
    setNameError("");
    setGameState("PLAYING");
  };

  const handleNextCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const updatedAnswers = [
      ...savedAnswers,
      { questionId: activeQuestion.id, chosenAnswer: currentInput.trim() }
    ];
    setSavedAnswers(updatedAnswers);
    setCurrentInput("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      processFinalEvaluation(updatedAnswers);
    }
  };

  const processFinalEvaluation = async (finalPayload: typeof savedAnswers) => {
    setIsSubmitting(true);
    setSubmissionError("");

    const result = await submitResponse(quizId, {
      guestName: guestName.trim(),
      answers: finalPayload
    });

    if (!result.success || result.score === undefined || result.totalQuestions === undefined) {
      setSubmissionError(result.error || "Failed to finalize execution scoring matrices.");
      setIsSubmitting(false);
      return;
    }

    setFinalScore({ score: result.score, total: result.totalQuestions });
    setGameState("SCORED");
  };

  return (
    <AnimatePresence mode="wait">
      {gameState === "GUEST_IDENTITY" && (
        <motion.div
          key="guest-onboarding"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col text-left space-y-6 px-4"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-purple-400 tracking-wide uppercase shadow-sm">
              <UserCheck className="w-3 h-3" />
              <span>Challenge Received</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-500 leading-tight">
              You&apos;ve been challenged! 💥
            </h1>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              <span className="font-bold text-purple-400 text-zinc-200">{hostName}</span> wants to see how well you actually know them. Enter your name below to launch the match.
            </p>
          </div>

          <form 
            onSubmit={handleStartQuiz} 
            className="w-full bg-zinc-500/10 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-4"
          >
            <Input
              label="What's your name?"
              placeholder="e.g. Alex"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                if (nameError) setNameError("");
              }}
              error={nameError}
              maxLength={50}
              required
            />
            <Button type="submit" className="w-full">
              Accept Challenge
            </Button>
          </form>
        </motion.div>
      )}

      {gameState === "PLAYING" && (
        <motion.div
          key="gameplay-deck"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto px-4 space-y-6"
        >
          {/* Top Progress Meter Matrix */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <span>Match Progress</span>
              <span>Prompt {currentIndex + 1} of {questions.length}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 border border-zinc-800/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Active Question Runner Form Frame */}
          <form 
            onSubmit={handleNextCard} 
            key={activeQuestion.id}
            className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="space-y-3">
              <span className="inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-purple-400 tracking-wider uppercase">
                Guess {hostName}&apos;s Answer
              </span>
              <h3 className="text-lg font-bold text-zinc-600 leading-snug tracking-tight">
                {activeQuestion.questionText}
              </h3>
            </div>

            <Input
              placeholder="What did they lock in?"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              maxLength={200}
              autoFocus
              required
            />

            {submissionError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 text-xs font-semibold text-rose-400">
                {submissionError}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={!currentInput.trim()} 
              isLoading={isSubmitting}
              className="w-full shadow-md"
            >
              {currentIndex === questions.length - 1 ? "Complete Validation" : "Next Prompt"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </motion.div>
      )}

      {gameState === "SCORED" && (
        <motion.div
          key="terminal-score"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md mx-auto px-4 text-center space-y-6"
        >
          {/* Main Results Structural Frame */}
          <div className="bg-zinc-900/10 backdrop-blur-md border border-zinc-900 p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500" />
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400 shadow-md">
              <Trophy className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-zinc-600">Match Concluded!</h2>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                Your answers have been processed and uploaded straight onto <span className="font-bold text-zinc-200">{hostName}&apos;s</span> live hub board scorecard panel.
              </p>
            </div>

            {/* Score Ring Value Tag */}
            <div className="bg-zinc-950/80 py-4 px-6 rounded-xl inline-flex items-baseline justify-center space-x-1 border border-zinc-800/60">
              <span className="text-4xl font-black tracking-tight text-purple-400">{finalScore?.score}</span>
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-wide">/ {finalScore?.total} Correct</span>
            </div>

            <p className="text-xs text-zinc-500 italic font-medium leading-normal px-2">
              {finalScore && finalScore.score >= finalScore.total * 0.8 
                ? "Incredible, you two share an absolute neural connection! 🧠" 
                : "Perfect excuse to coordinate a weekend hang out session! ☕"}
            </p>
          </div>

          {/* Viral Expansion Box Loop Component */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 p-6 rounded-2xl shadow-xl text-left space-y-4 relative">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-zinc-200 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-400 fill-purple-400/20" />
                Turn the tables!
              </h4>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                Think your social circle can accurately guess your habits, memories, and choices? Build your custom 10-prompt deck link in seconds.
              </p>
            </div>
            <Link href="/" className="block">
              <Button variant="secondary" className="w-full text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
                Create My Own Quiz Link
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}