import React from "react";

interface BriefCardProps {
  title: string;
  emoji: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  accentColor?: "indigo" | "emerald" | "amber" | "red" | "purple" | "blue" | "slate";
}

export function BriefCard({
  title,
  emoji,
  subtitle,
  children,
  badge,
  accentColor = "indigo",
}: BriefCardProps) {
  const accentClasses = {
    indigo: "border-indigo-500/30 hover:border-indigo-500/50",
    emerald: "border-emerald-500/30 hover:border-emerald-500/50",
    amber: "border-amber-500/30 hover:border-amber-500/50",
    red: "border-red-500/30 hover:border-red-500/50",
    purple: "border-purple-500/30 hover:border-purple-500/50",
    blue: "border-blue-500/30 hover:border-blue-500/50",
    slate: "border-slate-700/60 hover:border-slate-600",
  }[accentColor];

  return (
    <div
      className={`glass-card rounded-2xl p-6 flex flex-col justify-between border ${accentClasses} shadow-lg transition-all duration-200`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
              {emoji}
            </span>
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {badge}
        </div>

        <div className="mt-2 text-slate-200">{children}</div>
      </div>
    </div>
  );
}
