"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, ArrowDownCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { NegotiationParseResult } from "@/types";

interface AIParserSectionProps {
  onExtracted: (data: NegotiationParseResult, originalText: string) => void;
}

const SAMPLE_TEXT = `We asked Microsoft for a 25% discount.
They rejected it initially.
After offering a longer contract,
they agreed to 20%.
They refused to change liability terms.`;

export function AIParserSection({ onExtracted }: AIParserSectionProps) {
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExtract = async () => {
    if (!notes.trim()) {
      setError("Please describe the negotiation first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await api.parseNegotiationNotes(notes);
      onExtracted(result, notes);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to extract negotiation details";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = () => {
    setNotes(SAMPLE_TEXT);
    setError(null);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>✨ Describe the negotiation</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Fast-Fill
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Paste or type unformatted meeting notes. The backend AI will extract structured fields automatically.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseSample}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline self-start sm:self-auto"
        >
          Load sample text
        </button>
      </div>

      <div className="relative mt-3">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Example: We asked Microsoft for a 25% discount. They rejected it initially. After offering a longer contract, they agreed to 20%. They refused to change liability terms."
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
          <span className="text-xs text-slate-500">
            Powered by Groq LLM parsing (backend service)
          </span>

          <button
            type="button"
            onClick={handleExtract}
            disabled={isLoading || !notes.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/30 self-end sm:self-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Fields...</span>
              </>
            ) : (
              <>
                <ArrowDownCircle className="w-4 h-4" />
                <span>Extract Negotiation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Fields extracted! Check and refine the form below before submitting.</span>
        </div>
      )}
    </div>
  );
}
