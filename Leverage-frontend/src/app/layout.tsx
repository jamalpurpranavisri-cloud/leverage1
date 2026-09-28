import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "LEVERAGE — Cross-Deal Negotiation Intelligence",
  description:
    "Never negotiate with a vendor for the first time twice. Cross-deal negotiation intelligence powered by Hindsight shared memory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>
          <Header />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </main>

          <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-slate-400">LEVERAGE</span>
                <span className="text-slate-600">·</span>
                <span>Never negotiate with a vendor for the first time twice.</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cross-User Agentic Memory powered by Hindsight</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
