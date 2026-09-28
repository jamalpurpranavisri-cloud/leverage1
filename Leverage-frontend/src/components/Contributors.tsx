import React from "react";
import { Contributor } from "@/types";
import { UserCheck } from "lucide-react";

interface ContributorsProps {
  contributors: Contributor[];
}

export function Contributors({ contributors }: ContributorsProps) {
  if (!contributors || contributors.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">No contributors recorded yet.</p>
    );
  }

  // Get department badge color styling
  const getDeptColor = (dept: string) => {
    const d = dept.toLowerCase();
    if (d.includes("procure")) return "bg-purple-500/10 text-purple-300 border-purple-500/30";
    if (d.includes("it") || d.includes("tech") || d.includes("eng"))
      return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
    if (d.includes("sales")) return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
    if (d.includes("finan") || d.includes("legal"))
      return "bg-amber-500/10 text-amber-300 border-amber-500/30";
    if (d.includes("hr") || d.includes("people") || d.includes("op"))
      return "bg-pink-500/10 text-pink-300 border-pink-500/30";
    return "bg-slate-500/10 text-slate-300 border-slate-500/30";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {contributors.map((c, idx) => {
        const initials = c.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div
            key={`${c.name}-${c.department}-${idx}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-inner">
              {initials || <UserCheck className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-sm text-slate-200 block truncate">
                {c.name}
              </span>
              <span
                className={`inline-block px-2 py-0.5 mt-0.5 text-[10px] font-medium tracking-wide uppercase rounded-md border ${getDeptColor(
                  c.department
                )}`}
              >
                {c.department}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
