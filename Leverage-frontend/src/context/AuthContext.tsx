"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    department: string,
    organization: string
  ) => Promise<boolean>;
  demoLogin: (persona: { name: string; department: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "leverage_active_user";

// Pre-configured team demo personas for 1-click evaluation
export const DEMO_PERSONAS = [
  {
    name: "A. Kumar",
    department: "Procurement",
    email: "a.kumar@enterprise.com",
    role: "Lead Procurement Officer",
  },
  {
    name: "R. Singh",
    department: "IT",
    email: "r.singh@enterprise.com",
    role: "IT Infrastructure Director",
  },
  {
    name: "D. Fernandes",
    department: "Sales-Ops",
    email: "d.fernandes@enterprise.com",
    role: "Sales Operations Manager",
  },
  {
    name: "P. Mehta",
    department: "Finance",
    email: "p.mehta@enterprise.com",
    role: "Financial Controller",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Derive name and department or match persona
    const matched = DEMO_PERSONAS.find(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    );

    const newUser: User = matched
      ? {
          id: matched.email,
          name: matched.name,
          email: matched.email,
          department: matched.department,
          organization: "Acme Global Enterprise",
        }
      : {
          id: email,
          name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email: email,
          department: "Procurement",
          organization: "Acme Global Enterprise",
        };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    department: string,
    organization: string
  ): Promise<boolean> => {
    const newUser: User = {
      id: email,
      name,
      email,
      department,
      organization: organization || "Acme Global Enterprise",
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    return true;
  };

  const demoLogin = (persona: { name: string; department: string; email: string }) => {
    const newUser: User = {
      id: persona.email,
      name: persona.name,
      email: persona.email,
      department: persona.department,
      organization: "Acme Global Enterprise",
    };
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, demoLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
