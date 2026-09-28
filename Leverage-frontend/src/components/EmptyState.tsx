import React from "react";
import Link from "next/link";
import { FolderSearch, PlusCircle, Sparkles } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  vendor?: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No negotiation history yet",
  description = "Be the first person to add organizational memory for this vendor.",
  vendor,
  actionText = "Log First Negotiation",
  actionHref,
}: EmptyStateProps) {
  const targetHref =
    actionHref || (vendor ? `/log?vendor=${encodeURIComponent(vendor)}` : "/log");

  return (
    <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-xl mx-auto border border-dashed border-slate-700/80 my-10">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
        <FolderSearch className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h3>

      <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={targetHref}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-slate-300 font-medium text-sm hover:bg-slate-800 border border-slate-800 transition-colors"
        >
          <span>Back to Vendors</span>
        </Link>
      </div>

      {vendor && (
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            Hindsight bank <code className="text-slate-400 font-mono">vendor-{vendor.toLowerCase().replace(/\s+/g, "-")}</code> will be initialized on first log.
          </span>
        </div>
      )}
    </div>
  );
}
