"use client";

import * as React from "react";
import { Button } from "@/components/core/button";
import { Check, Copy, Link2 } from "lucide-react";

interface ShareCardProps {
  quizId: string;
  hostName: string;
}

export function ShareCard({ quizId, hostName }: ShareCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/play/${quizId}`);
    }
  }, [quizId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("[Clipboard Error] Failed copy sequence:", err);
    }
  };

  return (
    <div className="w-full bg-zinc-500/10 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-4">
      <div className="space-y-1.5">
        <h3 className="font-bold text-lg text-zinc-500 tracking-tight flex items-center gap-2">
          <Link2 className="w-4 h-4 text-purple-400" />
          Your Quiz is Live! 🎉
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
          Copy your unique match link below and send it to your inner circle. Their live scores will populate instantly down on the rankings deck.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="flex-1 bg-zinc-950/60 border border-zinc-800/80 rounded-xl px-4 py-3 text-sm font-mono truncate select-all flex items-center text-zinc-300">
          {shareUrl || "Generating custom invite URL..."}
        </div>
        <Button
          variant="primary"
          onClick={handleCopy}
          disabled={!shareUrl}
          className="shrink-0 !h-12 text-xs font-semibold px-5"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-emerald-400 stroke-[2.5]" />
              Link Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Invite URL
            </>
          )}
        </Button>
      </div>
    </div>
  );
}