"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  User,
  Briefcase,
  Calendar,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Loader2,
  Tag,
  Plus,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { api } from "@/lib/api";
import { NegotiationIn, NegotiationOut, NegotiationParseResult } from "@/types";
import { AIParserSection } from "./AIParserSection";
import { useAuth } from "@/context/AuthContext";

interface NegotiationFormProps {
  initialVendor?: string;
}

const COMMON_DEPARTMENTS = [
  "Procurement",
  "IT",
  "Finance",
  "Sales-Ops",
  "Engineering",
  "Legal",
  "Operations",
  "HR",
];

const SUGGESTED_FLEXIBLE_TERMS = [
  "payment_terms",
  "contract_duration",
  "volume_discount",
  "seat_count_minimums",
  "implementation_support",
  "trial_period",
];

const SUGGESTED_FIRM_TERMS = [
  "liability_clause",
  "governing_law",
  "ip_ownership",
  "data_residency",
  "payment_terms",
  "sla_penalties",
];

export function NegotiationForm({ initialVendor = "" }: NegotiationFormProps) {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [vendor, setVendor] = useState(initialVendor);
  const [loggedBy, setLoggedBy] = useState(user?.name || "");
  const [department, setDepartment] = useState(user?.department || "Procurement");

  useEffect(() => {
    if (user) {
      if (!loggedBy) setLoggedBy(user.name);
      if (user.department) setDepartment(user.department);
    }
  }, [user]);

  const [date, setDate] = useState(today);
  const [discountPct, setDiscountPct] = useState<string>("");
  const [paymentTermsDays, setPaymentTermsDays] = useState<string>("");
  const [flexibleTerms, setFlexibleTerms] = useState<string[]>([]);
  const [firmTerms, setFirmTerms] = useState<string[]>([]);
  const [customFlexTerm, setCustomFlexTerm] = useState("");
  const [customFirmTerm, setCustomFirmTerm] = useState("");
  const [tactic, setTactic] = useState("");
  const [tacticWorked, setTacticWorked] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<NegotiationOut | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle data extracted from the AI parser
  const handleAIExtracted = (parsed: NegotiationParseResult, originalText: string) => {
    if (parsed.discount_pct !== null && parsed.discount_pct !== undefined) {
      setDiscountPct(parsed.discount_pct.toString());
    }
    if (parsed.payment_terms_days !== null && parsed.payment_terms_days !== undefined) {
      setPaymentTermsDays(parsed.payment_terms_days.toString());
    }
    if (parsed.flexible_terms && parsed.flexible_terms.length > 0) {
      setFlexibleTerms((prev) => Array.from(new Set([...prev, ...parsed.flexible_terms])));
    }
    if (parsed.firm_terms && parsed.firm_terms.length > 0) {
      setFirmTerms((prev) => Array.from(new Set([...prev, ...parsed.firm_terms])));
    }
    if (parsed.tactic) {
      setTactic(parsed.tactic);
    }
    if (parsed.tactic_worked !== null && parsed.tactic_worked !== undefined) {
      setTacticWorked(parsed.tactic_worked);
    }
    if (!notes && originalText) {
      setNotes(originalText);
    }
  };

  const addFlexTerm = (term: string) => {
    const clean = term.trim().toLowerCase().replace(/\s+/g, "_");
    if (clean && !flexibleTerms.includes(clean)) {
      setFlexibleTerms([...flexibleTerms, clean]);
    }
    setCustomFlexTerm("");
  };

  const removeFlexTerm = (term: string) => {
    setFlexibleTerms(flexibleTerms.filter((t) => t !== term));
  };

  const addFirmTerm = (term: string) => {
    const clean = term.trim().toLowerCase().replace(/\s+/g, "_");
    if (clean && !firmTerms.includes(clean)) {
      setFirmTerms([...firmTerms, clean]);
    }
    setCustomFirmTerm("");
  };

  const removeFirmTerm = (term: string) => {
    setFirmTerms(firmTerms.filter((t) => t !== term));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic client validation
    if (!vendor.trim()) {
      setFormError("Vendor name is required.");
      return;
    }
    if (!loggedBy.trim()) {
      setFormError("Your name (Logged by) is required.");
      return;
    }
    if (!department.trim()) {
      setFormError("Department is required.");
      return;
    }
    if (!date) {
      setFormError("Date is required.");
      return;
    }

    const payload: NegotiationIn = {
      vendor: vendor.trim(),
      logged_by: loggedBy.trim(),
      department: department.trim(),
      date,
      discount_pct: discountPct !== "" ? parseInt(discountPct, 10) : null,
      payment_terms_days: paymentTermsDays !== "" ? parseInt(paymentTermsDays, 10) : null,
      flexible_terms: flexibleTerms,
      firm_terms: firmTerms,
      tactic: tactic.trim() || null,
      tactic_worked: tacticWorked,
      notes: notes.trim() || null,
    };

    setIsSubmitting(true);

    try {
      const result = await api.logNegotiation(payload);
      setSubmissionResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record negotiation";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setFormError(null);
    setDiscountPct("");
    setPaymentTermsDays("");
    setFlexibleTerms([]);
    setFirmTerms([]);
    setTactic("");
    setTacticWorked(null);
    setNotes("");
  };

  if (submissionResult) {
    return (
      <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto border-2 border-emerald-500/40 bg-slate-900/90 shadow-2xl animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          ✓ Negotiation added
        </h2>

        <p className="text-emerald-300 font-medium text-base mb-6">
          This negotiation is now part of the organization&apos;s vendor memory.
        </p>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left max-w-lg mx-auto mb-8 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Vendor:</span>
            <span className="font-semibold text-white">{submissionResult.vendor}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Hindsight Shared Bank:</span>
            <span className="font-mono text-indigo-300">{submissionResult.bank_id}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Updated Negotiations Total:</span>
            <span className="font-semibold text-white">
              {submissionResult.negotiation_count} deals
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Updated Confidence:</span>
            <span className="font-semibold text-emerald-400">
              {submissionResult.confidence}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/vendors/${encodeURIComponent(submissionResult.vendor)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
          >
            <span>View {submissionResult.vendor} Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Log Another Deal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Optional AI extraction section */}
      <AIParserSection onExtracted={handleAIExtracted} />

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl"
      >
        <div className="border-b border-slate-800/80 pb-6 mb-8">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Log Negotiation Record
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Every entry here is retained into the vendor&apos;s shared Hindsight bank for all employees.
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-sm text-red-300">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Section 1: Core Context (Required) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
              <span>1. Context &amp; Attribution</span>
              <span className="text-[10px] text-slate-500 normal-case">(Required)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Vendor */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Vendor Name <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Microsoft, Snowflake, AWS"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Logged By */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Name (Logged By) <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={loggedBy}
                    onChange={(e) => setLoggedBy(e.target.value)}
                    placeholder="e.g. A. Kumar or Jane Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Department <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Procurement, IT, Finance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    list="departments-list"
                  />
                  <datalist id="departments-list">
                    {COMMON_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Negotiation Date <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Numbers & Terms */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
              <span>2. Commercial Terms &amp; Concessions</span>
              <span className="text-[10px] text-slate-500 normal-case">(Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Discount % */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Discount Percentage Achieved (%)
                </label>
                <div className="relative">
                  <Percent className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Payment Terms (Days) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Payment Terms Agreed (Days)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    min="0"
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(e.target.value)}
                    placeholder="e.g. 30, 45, 60, 90"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Flexible Terms Tags */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                📄 Terms Vendor Was Flexible On
              </label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex flex-wrap gap-2 mb-2">
                  {flexibleTerms.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={() => removeFlexTerm(term)}
                        className="text-emerald-400 hover:text-emerald-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {flexibleTerms.length === 0 && (
                    <span className="text-xs text-slate-600 italic">No flexible terms added yet</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customFlexTerm}
                    onChange={(e) => setCustomFlexTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFlexTerm(customFlexTerm);
                      }
                    }}
                    placeholder="Type term (e.g. payment_terms) and press Add"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => addFlexTerm(customFlexTerm)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-600/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
                  {SUGGESTED_FLEXIBLE_TERMS.filter((t) => !flexibleTerms.includes(t)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addFlexTerm(s)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Firm Terms Tags */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                🔒 Terms Vendor Held Firm On (Refused to budge)
              </label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex flex-wrap gap-2 mb-2">
                  {firmTerms.map((term) => (
                    <span
                      key={term}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/15 text-red-300 border border-red-500/30"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={() => removeFirmTerm(term)}
                        className="text-red-400 hover:text-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {firmTerms.length === 0 && (
                    <span className="text-xs text-slate-600 italic">No firm terms added yet</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customFirmTerm}
                    onChange={(e) => setCustomFirmTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFirmTerm(customFirmTerm);
                      }
                    }}
                    placeholder="Type term (e.g. liability_clause) and press Add"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => addFirmTerm(customFirmTerm)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-medium hover:bg-red-600/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
                  {SUGGESTED_FIRM_TERMS.filter((t) => !firmTerms.includes(t)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addFirmTerm(s)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tactics & Notes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
              <span>3. Tactics &amp; Strategic Notes</span>
            </h3>

            {/* Tactic text */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Negotiation Tactic Used
              </label>
              <input
                type="text"
                value={tactic}
                onChange={(e) => setTactic(e.target.value)}
                placeholder="e.g. Asked for discount before discussing contract length"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Tactic outcome toggle */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Did this tactic work?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTacticWorked(true)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                    tacticWorked === true
                      ? "bg-emerald-600/20 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Yes, Worked</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTacticWorked(false)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                    tacticWorked === false
                      ? "bg-red-600/20 text-red-300 border-red-500 ring-2 ring-red-500/20"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>No, Failed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTacticWorked(null)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                    tacticWorked === null
                      ? "bg-indigo-600/20 text-indigo-300 border-indigo-500 ring-2 ring-indigo-500/20"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Unspecified / Neutral</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Additional Observations / Context
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any qualitative insights, vendor tendencies, or advice for the next colleague who negotiates with them."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Retains directly into Hindsight memory bank on submission.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Retaining in Shared Memory...</span>
              </>
            ) : (
              <>
                <span>Save to Organizational Memory</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
