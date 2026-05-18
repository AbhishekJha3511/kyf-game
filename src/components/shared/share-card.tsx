"use client";

import * as React from "react";
import { Button } from "@/components/core/button";
import { Check, Copy } from "lucide-react";

interface ShareCardProps {
  quizId: string;
  hostName: string;
}

export function ShareCard({ quizId, hostName }: ShareCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  // Construct URL strictly on mount to ensure SSR execution bypasses window definitions
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/play/${quizId}`);
    }
  }, [quizId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Debounce visual success toggle
    } catch (err) {
      console.error("[Clipboard Error] Failed copy sequence:", err);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md space-y-4">
      <div className="space-y-1">
        <h3 className="font-bold text-lg tracking-tight">Your Quiz is Live! 🎉</h3>
        <p className="text-indigo-100 text-xs sm:text-sm">
          Copy the unique link below and text it to your friends. Their scores will instantly appear on the leaderboard below.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <div className="flex-1 bg-indigo-800/40 backdrop-blur-sm border border-indigo-500/30 rounded-xl px-4 py-3 text-sm font-mono truncate select-all flex items-center">
          {shareUrl || "Generating invite link..."}
        </div>
        <Button
          variant="secondary"
          onClick={handleCopy}
          disabled={!shareUrl}
          className="bg-white text-indigo-700 hover:bg-indigo-50 shrink-0 !min-h-[44px]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-emerald-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}