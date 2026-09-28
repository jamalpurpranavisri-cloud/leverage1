"use client";

import React, { useState } from "react";
import { useAuth, DEMO_PERSONAS } from "@/context/AuthContext";
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Users,
  Brain,
  Zap,
  Briefcase,
  Layers,
} from "lucide-react";

interface AuthGatewayProps {
  onSuccess?: () => void;
  allowSkip?: boolean;
}

export function AuthGateway({ onSuccess, allowSkip = true }: AuthGatewayProps) {
  const { login, signup, demoLogin } = useAuth();

  const [mode, setMode] = useState<"signup" | "signin">("signup"); // Default to signup as requested
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("Acme Global Enterprise");
  const [department, setDepartment] = useState("Procurement");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your full name.");
          setIsSubmitting(false);
          return;
        }
        if (!email.trim() || !email.includes("@")) {
          setError("Please enter a valid corporate email ID.");
          setIsSubmitting(false);
          return;
        }
        if (!company.trim()) {
          setError("Please enter your company/organization name.");
          setIsSubmitting(false);
          return;
        }
        await signup(name.trim(), email.trim(), department, company.trim());
      } else {
        if (!email.trim()) {
          setError("Please enter your corporate email ID.");
          setIsSubmitting(false);
          return;
        }
        await login(email.trim(), password);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("Authentication failed. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoPersona = (persona: typeof DEMO_PERSONAS[0]) => {
    demoLogin(persona);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Hero Card: Enterprise Brand & Shared Memory Pitch */}
        <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Logo Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-xl text-white block">
                  LEVERAGE
                </span>
                <span className="text-xs text-indigo-300 font-semibold tracking-wide uppercase">
                  Cross-Deal Negotiation Intelligence
                </span>
              </div>
            </div>

            {/* Tagline */}
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
              Never negotiate with a vendor for the{" "}
              <span className="gradient-brand">first time twice</span>.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Enter your enterprise credentials to access your organization&apos;s shared bargaining
              memory bank. Every deal logged by Procurement, IT, and Finance compounds into
              corporate leverage.
            </p>

            {/* Live Shared Memory Preview Box */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-inner mb-8 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Shared Organizational Memory</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Hindsight Active
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold shrink-0">💰 Microsoft:</span>
                  <span>Up to 20% discount unlocked across 8 multi-department deals</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-blue-400 font-bold shrink-0">📅 Terms:</span>
                  <span>60-day billing accepted as standard benchmark across teams</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-amber-400 font-bold shrink-0">🔒 Boundaries:</span>
                  <span>Vendor holds firm on liability caps across all negotiations</span>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
                  <Users className="w-4 h-4" />
                  <span>Cross-Team</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Shared across Procurement, IT, Finance, and Legal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zero Silos</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Empirical playbooks replace lost email threads and spreadsheets.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Powered by Hindsight Shared Agentic Memory</span>
            <span className="text-indigo-400 font-medium">SOC-2 Type II · Zero Data Silos</span>
          </div>
        </div>

        {/* Right Side: Authentication Card */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-2xl">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  mode === "signup"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up / Join Team
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  mode === "signin"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {mode === "signup"
                  ? "Create your enterprise negotiator profile"
                  : "Sign in to your organization"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === "signup"
                  ? "Enter your name, corporate email, company, and department to access organizational memory."
                  : "Access synthesized negotiation playbooks from your colleagues."}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            {/* The Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-indigo-400">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company & Department Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company / Organization <span className="text-indigo-400">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Global Corp"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Department <span className="text-indigo-400">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white transition-colors"
                        >
                          <option value="Procurement">Procurement</option>
                          <option value="IT">IT &amp; Infrastructure</option>
                          <option value="Finance">Finance</option>
                          <option value="Sales-Ops">Sales Operations</option>
                          <option value="Legal">Legal &amp; Compliance</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Executive">Executive Leadership</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Corporate Email ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Corporate Email ID <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.rivera@enterprise.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? "Authenticating..."
                    : mode === "signup"
                    ? "Enter Leverage Workspace"
                    : "Sign In to Leverage"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* ⚡ 1-Click Demo Personas for Quick Evaluation */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>1-Click Team Personas (Seeded Data)</span>
                </div>
                <span className="text-[10px] text-slate-500">Instant Demo Access</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Select any colleague below to explore the app through their departmental perspective:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.email}
                    type="button"
                    onClick={() => handleDemoPersona(persona)}
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs text-white group-hover:text-indigo-300">
                        {persona.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                        {persona.department}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {persona.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Allow Skip Link */}
            {allowSkip && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (onSuccess) onSuccess();
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  <span>Or browse playbooks anonymously as Guest</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
