"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { submitResponse } from "@/app/actions/quiz";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";

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
  // Game progression states
  const [gameState, setGameState] = React.useState<GameState>("GUEST_IDENTITY");
  const [guestName, setGuestName] = React.useState("");
  const [nameError, setNameError] = React.useState("");

  // Running flashcard index indicators
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentInput, setCurrentInput] = React.useState("");
  const [savedAnswers, setSavedAnswers] = React.useState<Array<{ questionId: number; chosenAnswer: string }>>([]);

  // Terminal submission states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [finalScore, setFinalScore] = React.useState<{ score: number; total: number } | null>(null);
  const [submissionError, setSubmissionError] = React.useState("");

  const activeQuestion = questions[currentIndex];
  const progressPercentage = ((currentIndex) / questions.length) * 100;

  // Onboarding Submission
  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || guestName.trim().length < 2) {
      setNameError("Please enter your name (at least 2 characters) to play.");
      return;
    }
    setNameError("");
    setGameState("PLAYING");
  };

  // Step progression card handlers
  const handleNextCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    // Log the current answer selection safely before moving forward
    const updatedAnswers = [
      ...savedAnswers,
      { questionId: activeQuestion.id, chosenAnswer: currentInput.trim() }
    ];
    setSavedAnswers(updatedAnswers);
    setCurrentInput("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last card completed: Trigger secure server evaluation loop
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
      setSubmissionError(result.error || "Failed to calculate your final score.");
      setIsSubmitting(false);
      return;
    }

    setFinalScore({ score: result.score, total: result.totalQuestions });
    setGameState("SCORED");
  };

  // --- VIEW RENDERING ROUTINES ---

  if (gameState === "GUEST_IDENTITY") {
    return (
      <form onSubmit={handleStartQuiz} className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
            You&apos;ve Been Challenged! 💥
          </h1>
          <p className="text-slate-500 text-sm">
            <span className="font-bold text-indigo-600">{hostName}</span> wants to see how well you actually know them. Enter your name below to start the quiz.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <Input
            label="What is your name?"
            placeholder="e.g., Alex"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            error={nameError}
            maxLength={50}
            required
          />
          <Button type="submit" className="w-full">
            Accept Challenge
          </Button>
        </div>
      </form>
    );
  }

  if (gameState === "PLAYING") {
    return (
      <div className="w-full max-w-md mx-auto p-4 space-y-6">
        {/* Dynamic UI Progress Metrics */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Progress</span>
            <span>Question {currentIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* The Core Active Flashcard Structure */}
        <form 
          onSubmit={handleNextCard} 
          key={activeQuestion.id}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="space-y-3">
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
              Guess {hostName}&apos;s Answer
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {activeQuestion.questionText}
            </h3>
          </div>

          <Input
            placeholder="Type what you think they answered..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            maxLength={200}
            autoFocus
            required
          />

          {submissionError && (
            <div className="p-3 rounded-xl bg-rose-50 text-xs font-bold text-rose-600 border border-rose-100">
              {submissionError}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={!currentInput.trim()} 
            isLoading={isSubmitting}
            className="w-full shadow-sm"
          >
            {currentIndex === questions.length - 1 ? "Finish & See Score" : "Next Question"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    );
  }

  // Final Complete/Scored View Module
  return (
    <div className="w-full max-w-md mx-auto p-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md space-y-6 relative overflow-hidden">
        {/* Decorative subtle visual accent drops */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <Trophy className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Quiz Complete!</h2>
          <p className="text-slate-500 text-sm">
            Your results have been locked into <span className="font-bold text-slate-800">{hostName}&apos;s</span> live dashboard tracker.
          </p>
        </div>

        {/* Clean Score Metric Visualization */}
        <div className="bg-slate-50 py-4 px-6 rounded-2xl inline-flex items-baseline justify-center space-x-1 border border-slate-100">
          <span className="text-4xl font-black text-indigo-600">{finalScore?.score}</span>
          <span className="text-slate-400 font-semibold text-sm">/ {finalScore?.total} Correct</span>
        </div>

        <p className="text-xs text-slate-400 italic">
          {finalScore && finalScore.score >= finalScore.total * 0.8 
            ? "Wow, you two are absolute mind-readers! 🧠" 
            : "Time to schedule a catch-up hangout session! ☕"}
        </p>
      </div>

      {/* The Viral Loop Trigger Action */}
      <div className="space-y-3 bg-indigo-900 text-white p-6 rounded-3xl shadow-md text-left relative">
        <div className="space-y-1">
          <h4 className="font-bold text-base flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-amber-300 fill-amber-300" />
            Turn the tables!
          </h4>
          <p className="text-indigo-200 text-xs leading-relaxed">
            Think your friends can guess your answers? Build your own rapid 10-question test link in seconds and challenge your circle.
          </p>
        </div>
        <Link href="/" className="block">
          <Button variant="secondary" className="w-full bg-white text-indigo-950 hover:bg-indigo-50">
            Create My Own Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
}