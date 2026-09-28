"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { VendorSummary } from "@/types";
import { VendorSearch } from "@/components/VendorSearch";
import { VendorCard } from "@/components/VendorCard";
import { VendorGridSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { AuthGateway } from "@/components/AuthGateway";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Plus,
  Sparkles,
  Database,
  Users,
  Building,
  UserCheck,
  LogOut,
  LogIn,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  const [vendors, setVendors] = useState<VendorSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getVendors();
      setVendors(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load vendors";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((v) =>
    v.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalNegotiations = vendors.reduce(
    (acc, v) => acc + (v.negotiation_count || 0),
    0
  );

  // If user is not signed in and has not chosen guest mode, show the Sign In / Sign Up gateway as the VERY FIRST PAGE
  if (!user && !guestMode) {
    return (
      <div className="w-full">
        <AuthGateway onSuccess={() => setGuestMode(false)} allowSkip={true} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Authenticated User Status Bar */}
      {user ? (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm shadow-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-sm shadow-inner">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Welcome, {user.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
                  {user.department}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Organization:{" "}
                <strong className="text-slate-300">
                  {user.organization || "Enterprise"}
                </strong>{" "}
                · Connected to shared bargaining memory
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/log"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              + Log Deal as {user.name.split(" ")[0]}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch User</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Browsing playbooks anonymously as <strong>Guest</strong>.
          </span>
          <button
            type="button"
            onClick={() => setGuestMode(false)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to attribute deals to your department</span>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-2 pb-10 sm:pt-6 sm:pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cross-Deal Negotiation Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          Never negotiate with a vendor for the{" "}
          <span className="gradient-brand">first time twice</span>.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Harness the shared bargaining memories of your entire organization.
          Turn fragmented departmental deals into company-wide leverage.
        </p>

        {/* Vendor Search Bar */}
        <VendorSearch
          vendors={vendors}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Quick Organizational Stats Banner */}
        {!isLoading && !error && vendors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left mt-8">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Active Vendors
              </span>
              <span className="text-2xl font-bold text-white">
                {vendors.length}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Retained Deals
              </span>
              <span className="text-2xl font-bold text-indigo-300">
                {totalNegotiations}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                Memory Architecture
              </span>
              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
                <Database className="w-3.5 h-3.5" />
                Hindsight Cloud
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Main Vendor Content */}
      <section className="mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Tracked Vendors in Memory
            </h2>
            <p className="text-xs text-slate-400">
              Select a vendor to access synthesized cross-user intelligence and previous concessions.
            </p>
          </div>

          <Link
            href="/log"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Negotiation</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && <VendorGridSkeleton />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState message={error} onRetry={fetchVendors} />
        )}

        {/* Empty State: 0 vendors in backend */}
        {!isLoading && !error && vendors.length === 0 && (
          <EmptyState
            title="No vendors in memory yet"
            description="Your organization has not logged any negotiations yet. Seed the demo data or log the first negotiation to build shared memory."
            actionText="Log First Negotiation"
            actionHref="/log"
          />
        )}

        {/* Search returned 0 matching */}
        {!isLoading && !error && vendors.length > 0 && filteredVendors.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-400 text-sm mb-4">
              No existing memory found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <Link
              href={`/log?vendor=${encodeURIComponent(searchQuery)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Negotiation for &ldquo;{searchQuery}&rdquo;</span>
            </Link>
          </div>
        )}

        {/* Vendor Grid */}
        {!isLoading && !error && filteredVendors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.vendor_slug} vendor={vendor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
