import React from "react";

interface ConfidenceBadgeProps {
  confidence: string;
  size?: "sm" | "md" | "lg";
}

export function ConfidenceBadge({ confidence, size = "md" }: ConfidenceBadgeProps) {
  const norm = (confidence || "Low").toLowerCase();

  let colorClasses = "bg-amber-950/40 text-amber-300 border-amber-500/40";
  let dotClass = "bg-amber-400";
  let label = "Low";

  if (norm.includes("high")) {
    colorClasses = "bg-emerald-950/40 text-emerald-300 border-emerald-500/40";
    dotClass = "bg-emerald-400";
    label = "High";
  } else if (norm.includes("medium") || norm.includes("med")) {
    colorClasses = "bg-blue-950/40 text-blue-300 border-blue-500/40";
    dotClass = "bg-blue-400";
    label = "Medium";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2",
    lg: "px-3.5 py-1.5 text-sm gap-2.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm ${sizeClasses} ${colorClasses}`}
      title={`Confidence: ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClass}`} />
      <span className="tracking-wide">{label} Confidence</span>
    </span>
  );
}
