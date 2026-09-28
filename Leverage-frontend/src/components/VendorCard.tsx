import React from "react";
import Link from "next/link";
import { Building2, ArrowRight, FileText, PlusCircle } from "lucide-react";
import { VendorSummary } from "@/types";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface VendorCardProps {
  vendor: VendorSummary;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:border-indigo-500/40 group-hover:text-indigo-400 transition-colors shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                {vendor.vendor}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                bank: vendor-{vendor.vendor_slug}
              </p>
            </div>
          </div>
          <ConfidenceBadge confidence={vendor.confidence} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-3 py-3 my-2 border-y border-slate-800/80">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Logged Deals
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white">
                {vendor.negotiation_count}
              </span>
              <span className="text-xs text-slate-400">
                {vendor.negotiation_count === 1 ? "deal" : "deals"}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/60">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-0.5">
              Intelligence
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-semibold text-slate-300">
                Synthesized
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-2 flex items-center gap-2">
        <Link
          href={`/vendors/${encodeURIComponent(vendor.vendor)}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all text-sm font-semibold shadow-sm group-hover:shadow-indigo-500/20"
        >
          <FileText className="w-4 h-4" />
          <span>Prepare Negotiation</span>
          <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href={`/log?vendor=${encodeURIComponent(vendor.vendor)}`}
          className="p-2.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors"
          title={`Log new negotiation for ${vendor.vendor}`}
        >
          <PlusCircle className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
