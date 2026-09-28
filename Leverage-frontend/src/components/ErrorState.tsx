import React from "react";
import { AlertTriangle, RefreshCw, Terminal } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBackendHelp?: boolean;
}

export function ErrorState({
  title = "Unable to connect to Leverage Backend",
  message = "We could not fetch negotiation data. Please ensure the FastAPI backend is running.",
  onRetry,
  showBackendHelp = true,
}: ErrorStateProps) {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto border border-red-500/30 bg-slate-950/80 my-10 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h3>

      <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
        {message}
      </p>

      {showBackendHelp && (
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Start the backend server:</span>
          </div>
          <code className="text-xs font-mono text-emerald-400 block bg-slate-950 p-2.5 rounded-lg border border-slate-800 select-all overflow-x-auto">
            cd leverage-backend &amp;&amp; uvicorn app.main:app --reload --port 8000
          </code>
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
