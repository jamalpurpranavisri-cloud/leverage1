"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { NegotiationBrief } from "@/types";
import { MemoryPanel } from "@/components/MemoryPanel";
import { BriefCard } from "@/components/BriefCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { BriefSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import {
  Building2,
  PlusCircle,
  ArrowLeft,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  Code2,
  Percent,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    vendor: string;
  }>;
}

export default function VendorIntelligencePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const vendorName = decodeURIComponent(resolvedParams.vendor);

  const [brief, setBrief] = useState<NegotiationBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawReflection, setShowRawReflection] = useState(false);

  const fetchBrief = async () => {
    setIsLoading(true);
    setIs404(false);
    setError(null);

    try {
      const data = await api.getVendorBrief(vendorName);
      setBrief(data);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 404) {
        setIs404(true);
      } else {
        const msg = err instanceof Error ? err.message : "Failed to load vendor intelligence";
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [vendorName]);

  if (isLoading) {
    return <BriefSkeleton />;
  }

  if (is404) {
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all vendors</span>
          </Link>
        </div>

        <EmptyState
          title={`No negotiation history yet for "${vendorName}"`}
          description="Be the first person to add organizational memory for this vendor. All your colleagues will benefit from your insights in future negotiations."
          vendor={vendorName}
          actionText={`Log First Negotiation with ${vendorName}`}
        />
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all vendors</span>
          </Link>
        </div>

        <ErrorState
          title={`Could not synthesize intelligence for ${vendorName}`}
          message={error || "An unexpected error occurred while querying vendor memory."}
          onRetry={fetchBrief}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Back button & top breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all vendors</span>
        </Link>

        <span className="text-xs text-slate-500 font-mono">
          Memory Bank: vendor-{vendorName.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>

      {/* Vendor Profile Top Bar */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 shrink-0">
            <Building2 className="w-8 h-8" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {brief.vendor}
              </h1>
              <ConfidenceBadge confidence={brief.confidence} size="md" />
            </div>

            <p className="text-xs sm:text-sm text-slate-400">
              Synthesized from{" "}
              <strong className="text-slate-200">{brief.negotiation_count}</strong> historical{" "}
              {brief.negotiation_count === 1 ? "deal" : "deals"} across the organization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/log?vendor=${encodeURIComponent(brief.vendor)}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Negotiation for {brief.vendor}</span>
          </Link>
        </div>
      </div>

      {/* 🧠 MOST IMPORTANT SECTION: ORGANIZATIONAL MEMORY */}
      <MemoryPanel
        negotiationCount={brief.negotiation_count}
        contributors={brief.contributors}
        vendor={brief.vendor}
      />

      {/* Cards Grid: 6 Distinct Intelligence Areas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Negotiation Intelligence &amp; Playbook
            </h2>
            <p className="text-xs text-slate-400">
              Key bargaining parameters synthesized live by Hindsight agentic memory.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. 💰 Pricing */}
          <BriefCard
            title="Pricing &amp; Historical Discounts"
            emoji="💰"
            subtitle="Maximum discount percentage achieved by colleagues"
            accentColor="emerald"
            badge={
              brief.max_discount_pct !== null ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Best: {brief.max_discount_pct}%
                </span>
              ) : undefined
            }
          >
            {brief.max_discount_pct !== null ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">
                    Up to {brief.max_discount_pct}% discount
                  </div>
                  <div className="text-xs text-slate-400">
                    Achieved in prior negotiations with this vendor.
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic p-3">
                No specific discount percentage recorded yet in past deals.
              </p>
            )}
          </BriefCard>

          {/* 2. 📅 Payment Terms */}
          <BriefCard
            title="Payment Terms"
            emoji="📅"
            subtitle="Commercial billing terms accepted previously"
            accentColor="blue"
          >
            {brief.payment_terms_note ? (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">
                    {brief.payment_terms_note}
                  </div>
                  <div className="text-xs text-slate-400">
                    Historical standard accepted by {brief.vendor}.
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic p-3">
                No payment terms note established yet.
              </p>
            )}
          </BriefCard>

          {/* 3. 📄 Flexible Terms */}
          <BriefCard
            title="Flexible Terms"
            emoji="📄"
            subtitle="Contract clauses the vendor historically bents or concessions made"
            accentColor="indigo"
          >
            {brief.flexible_on && brief.flexible_on.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {brief.flexible_on.map((term, i) => (
                  <span
                    key={`${term}-${i}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 text-indigo-200 border border-indigo-500/30 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{term.replace(/_/g, " ")}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic p-3">
                No specific flexible terms recorded yet.
              </p>
            )}
          </BriefCard>

          {/* 4. 🔒 Firm Terms */}
          <BriefCard
            title="Firm Terms"
            emoji="🔒"
            subtitle="Clauses where the vendor consistently stood firm or refused changes"
            accentColor="amber"
          >
            {brief.firm_on && brief.firm_on.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {brief.firm_on.map((term, i) => (
                  <span
                    key={`${term}-${i}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-200 border border-amber-500/30 shadow-sm"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{term.replace(/_/g, " ")}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic p-3">
                No firm terms recorded yet.
              </p>
            )}
          </BriefCard>

          {/* 5. ✅ Successful Tactics */}
          <BriefCard
            title="Successful Tactics"
            emoji="✅"
            subtitle="Tactics that worked in previous rounds"
            accentColor="emerald"
          >
            {brief.worked_tactics && brief.worked_tactics.length > 0 ? (
              <ul className="space-y-2.5 pt-1">
                {brief.worked_tactics.map((tactic, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-xs sm:text-sm text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tactic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic p-3">
                No successful tactics documented yet.
              </p>
            )}
          </BriefCard>

          {/* 6. ❌ Failed Tactics */}
          <BriefCard
            title="Failed Tactics"
            emoji="❌"
            subtitle="Approaches that backfired, stalled, or were rejected"
            accentColor="red"
          >
            {brief.failed_tactics && brief.failed_tactics.length > 0 ? (
              <ul className="space-y-2.5 pt-1">
                {brief.failed_tactics.map((tactic, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-red-500/20 text-xs sm:text-sm text-slate-200"
                  >
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{tactic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic p-3">
                No failed tactics documented yet.
              </p>
            )}
          </BriefCard>
        </div>
      </div>

      {/* 📊 Confidence Section Summary */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            📊 Synthesis Confidence Score
          </span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white">
              {brief.confidence} Confidence
            </span>
            <ConfidenceBadge confidence={brief.confidence} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculated directly from the number of recorded historical negotiations ({brief.negotiation_count} deals logged).
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          &lt;3 = Low · 3-5 = Medium · 6+ = High
        </div>
      </div>

      {/* Raw Reflection / Transparency Toggle (for judges/audit) */}
      {brief.raw_reflection && (
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
          <button
            type="button"
            onClick={() => setShowRawReflection(!showRawReflection)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">
                Inspect Raw Hindsight Reflection (System Transparency)
              </span>
            </div>
            {showRawReflection ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showRawReflection && (
            <div className="p-6 border-t border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {brief.raw_reflection}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
