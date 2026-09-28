/**
 * Data contracts strictly matching the Leverage FastAPI backend schemas.
 */

export interface VendorSummary {
  vendor: string;
  vendor_slug: string;
  negotiation_count: number;
  confidence: "Low" | "Medium" | "High" | string;
}

export interface Contributor {
  name: string;
  department: string;
}

export interface NegotiationBrief {
  vendor: string;
  max_discount_pct: number | null;
  payment_terms_note: string | null;
  flexible_on: string[];
  firm_on: string[];
  worked_tactics: string[];
  failed_tactics: string[];
  confidence: "Low" | "Medium" | "High" | string;
  negotiation_count: number;
  contributors: Contributor[];
  raw_reflection?: string | null;
}

export interface NegotiationIn {
  vendor: string;
  logged_by: string;
  department: string;
  date: string; // ISO date YYYY-MM-DD
  discount_pct?: number | null;
  payment_terms_days?: number | null;
  flexible_terms: string[];
  firm_terms: string[];
  tactic?: string | null;
  tactic_worked?: boolean | null;
  notes?: string | null;
}

export interface NegotiationOut {
  status: string;
  vendor: string;
  bank_id: string;
  negotiation_count: number;
  confidence: string;
}

export interface NegotiationParseResult {
  discount_pct: number | null;
  payment_terms_days: number | null;
  flexible_terms: string[];
  firm_terms: string[];
  tactic: string | null;
  tactic_worked: boolean | null;
}

export interface HealthResponse {
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  organization?: string;
  avatar?: string;
}
