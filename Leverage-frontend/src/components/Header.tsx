"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, PlusCircle, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    let mounted = true;
    api
      .checkHealth()
      .then(() => {
        if (mounted) setBackendOnline(true);
      })
      .catch(() => {
        if (mounted) setBackendOnline(false);
      });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-lg text-white">LEVERAGE</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Agentic Memory
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Cross-Deal Negotiation Intelligence</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Backend status badge */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border border-slate-800 bg-slate-900/60">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline === null
                    ? "bg-slate-400 animate-pulse"
                    : backendOnline
                    ? "bg-emerald-400"
                    : "bg-red-400"
                }`}
              />
              <span className="text-slate-400 font-mono text-[11px]">
                {backendOnline === null
                  ? "Checking API..."
                  : backendOnline
                  ? "Backend Connected"
                  : "API Offline"}
              </span>
            </div>

            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-slate-800 text-white shadow-inner"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Vendors</span>
              </Link>

              <Link
                href="/log"
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  pathname === "/log"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Negotiation</span>
              </Link>
            </nav>

            {/* Auth Profile / Sign In Button */}
            <div className="flex items-center pl-2 border-l border-slate-800">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 p-1.5 sm:pr-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs tracking-wider">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-medium text-indigo-400 leading-tight">
                        {user.department}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900/80 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    pathname === "/auth" || pathname === "/signin" || pathname === "/login"
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
