"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { VendorSummary } from "@/types";

interface VendorSearchProps {
  vendors: VendorSummary[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function VendorSearch({ vendors, searchQuery, onSearchChange }: VendorSearchProps) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if vendor matches an existing one or prepare for new
    const trimmed = searchQuery.trim();
    const matched = vendors.find(
      (v) => v.vendor.toLowerCase() === trimmed.toLowerCase()
    );
    if (matched) {
      router.push(`/vendors/${encodeURIComponent(matched.vendor)}`);
    } else {
      router.push(`/vendors/${encodeURIComponent(trimmed)}`);
    }
  };

  const selectVendor = (vendorName: string) => {
    router.push(`/vendors/${encodeURIComponent(vendorName)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-3 p-2 bg-slate-900/90 border rounded-2xl shadow-2xl transition-all duration-200 ${
            isFocused
              ? "border-indigo-500 ring-4 ring-indigo-500/20 shadow-indigo-500/10"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search a vendor (e.g. Microsoft, Zenith Staffing Co)..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-base sm:text-lg focus:outline-none"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Prepare Negotiation</span>
            <ArrowRight className="w-4 h-4 sm:hidden" />
          </button>
        </div>

        {/* Quick Suggestions Dropdown if query typed and focused */}
        {isFocused && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-30">
            <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              Matching Vendors in Organizational Memory
            </div>
            {vendors.filter((v) =>
              v.vendor.toLowerCase().includes(searchQuery.toLowerCase())
            ).length > 0 ? (
              <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                {vendors
                  .filter((v) =>
                    v.vendor.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((v) => (
                    <button
                      key={v.vendor_slug}
                      type="button"
                      onClick={() => selectVendor(v.vendor)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-800/70 transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-white block">
                          {v.vendor}
                        </span>
                        <span className="text-xs text-slate-400">
                          {v.negotiation_count} recorded deals · {v.confidence} confidence
                        </span>
                      </div>
                      <span className="text-xs text-indigo-400 flex items-center gap-1 font-medium">
                        View Brief <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-slate-400 mb-2">
                  No previous records for &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  type="submit"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                >
                  Prepare fresh intelligence or log first negotiation →
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
