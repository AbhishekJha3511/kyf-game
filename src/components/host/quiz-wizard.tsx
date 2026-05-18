"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { sampleRandomQuestions, type PresetQuestion } from "@/lib/constants/questions";
import { createQuiz } from "@/app/actions/quiz";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Shuffle } from "lucide-react";

type WizardStep = "IDENTITY" | "QUESTIONS";

interface ConfiguredQuestion {
  questionText: string;
  correctAnswer: string;
  sortOrder: number;
}

export function QuizWizard() {
  const router = useRouter();
  
  // Local persistence link to remember ownership safely without accounts
  const [, setOwnership] = useLocalStorage<Record<string, string>>("kyf_owned_quizzes", {});

  // Step state machine variables
  const [step, setStep] = React.useState<WizardStep>("IDENTITY");
  const [hostName, setHostName] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  
  // Question configuration management matrices
  const [questions, setQuestions] = React.useState<PresetQuestion[]>([]);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [submissionError, setSubmissionError] = React.useState("");
  const [isDeploying, setIsDeploying] = React.useState(false);

  // Phase 1: Initialize the session with 10 random questions on step progression
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

  // Utility to let the host re-roll their entire question sheet instantly
  const handleReshuffleQuestions = () => {
    setQuestions(sampleRandomQuestions(10));
    setAnswers({}); // Flush answers to prevent stale inputs matching mismatched indices
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Phase 2: Transmit configuration to server context
  const handleLaunchGame = async () => {
    setSubmissionError("");
    
    // Defensive check: Ensure all 10 inputs are fully satisfied
    const nonBlankAnswers = questions.filter((q) => answers[q.id]?.trim());
    if (nonBlankAnswers.length < 10) {
      setSubmissionError("Please fill out the answers to all 10 questions before launching.");
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
      setSubmissionError(result.error || "An internal transaction failure occurred.");
      setIsDeploying(false);
      return;
    }

    // Persist ownership record locally before rerouting to dashboard
    setOwnership((prev) => ({
      ...prev,
      [result.quizId!]: result.ownerToken!,
    }));

    // Perform atomic router push onto our operational Host Control Deck
    router.push(`/host/${result.quizId}`);
  };

  // --- RENDERING ROUTINES ---

  if (step === "IDENTITY") {
    return (
      <form onSubmit={handleProceedToQuestions} className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Know Your Friends!
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            How well do your friends actually know you? Let&apos;s build a flashcard test to find out.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <Input
            label="What is your name?"
            placeholder="e.g., Sarah"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            error={nameError}
            maxLength={50}
            required
          />
          <Button type="submit" className="w-full">
            Get Started
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Set Up Your Answers</h2>
          <p className="text-xs text-slate-500">Answer honestly—your friends will guess these exact strings!</p>
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={handleReshuffleQuestions}
          className="self-start sm:self-center !min-h-[38px] text-xs h-auto py-1.5"
        >
          <Shuffle className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Shuffle Questions
        </Button>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex items-start space-x-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-slate-800 pt-0.5">{q.text}</p>
            </div>
            <Input
              placeholder="Your answer..."
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              maxLength={200}
              required
            />
          </div>
        ))}
      </div>

      {submissionError && (
        <div className="p-4 rounded-xl bg-rose-50 text-sm font-semibold text-rose-600 border border-rose-100">
          {submissionError}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="button"
          onClick={handleLaunchGame}
          isLoading={isDeploying}
          className="w-full shadow-md bg-indigo-600 hover:bg-indigo-700"
        >
          Generate Quiz Link
        </Button>
      </div>
    </div>
  );
}