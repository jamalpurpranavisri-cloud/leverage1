"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NegotiationForm } from "@/components/NegotiationForm";
import { ArrowLeft, PlusCircle } from "lucide-react";

function LogNegotiationContent() {
  const searchParams = useSearchParams();
  const initialVendor = searchParams.get("vendor") || "";

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Vendors</span>
        </Link>

        {initialVendor && (
          <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Logging for {initialVendor}
          </span>
        )}
      </div>

      <NegotiationForm initialVendor={initialVendor} />
    </div>
  );
}

export default function LogNegotiationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-400">
          Loading negotiation form...
        </div>
      }
    >
      <LogNegotiationContent />
    </Suspense>
  );
}
