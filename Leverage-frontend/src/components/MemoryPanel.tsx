import React from "react";
import { Contributor } from "@/types";
import { Brain, Users, Building, Layers, Sparkles } from "lucide-react";
import { Contributors } from "./Contributors";

interface MemoryPanelProps {
  negotiationCount: number;
  contributors: Contributor[];
  vendor: string;
}

export function MemoryPanel({ negotiationCount, contributors, vendor }: MemoryPanelProps) {
  // Compute unique departments
  const uniqueDepartments = Array.from(
    new Set(contributors.map((c) => c.department.trim()).filter(Boolean))
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/70 p-6 sm:p-8 md:p-10 shadow-2xl shadow-indigo-950/40 mb-10">
      {/* Background radial highlight */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header tag and title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-500/30">
              <Brain className="w-7 h-7 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
                  Shared Agentic Memory
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                  Hindsight Core
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>🧠 ORGANIZATIONAL MEMORY</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cross-User Knowledge Base</span>
          </div>
        </div>

        {/* The Core Concept Callout */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/20 mb-8 backdrop-blur-sm">
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong className="text-white font-semibold">
              Never negotiate with {vendor} for the first time twice.
            </strong>{" "}
            This vendor intelligence was synthesized from real negotiations conducted by multiple
            colleagues across your organization. Every logged deal refines the company&apos;s
            collective leverage.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Negotiations */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {negotiationCount}
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {negotiationCount === 1 ? "Negotiation Logged" : "Negotiations Logged"}
              </div>
            </div>
          </div>

          {/* Contributors */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {contributors.length}
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {contributors.length === 1 ? "Team Contributor" : "Team Contributors"}
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {uniqueDepartments.length}
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {uniqueDepartments.length === 1 ? "Department" : "Departments Involved"}
              </div>
            </div>
          </div>
        </div>

        {/* Contributors List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contributing Team Members &amp; Departments
            </h3>
            <span className="text-xs text-indigo-400 font-medium">
              Real organizational attribution
            </span>
          </div>
          <Contributors contributors={contributors} />
        </div>
      </div>
    </section>
  );
}
