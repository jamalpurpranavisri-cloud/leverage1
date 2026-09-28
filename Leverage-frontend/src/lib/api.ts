import {
  VendorSummary,
  NegotiationBrief,
  NegotiationIn,
  NegotiationOut,
  NegotiationParseResult,
  HealthResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(`API Error ${status}: ${detail}`);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let detail = `Request failed with status ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson && errJson.detail) {
          detail = errJson.detail;
        }
      } catch {
        // use fallback detail message
      }
      throw new ApiError(res.status, detail);
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Failed to connect to backend server";
    throw new ApiError(0, `${message}. Is backend running on ${BASE_URL}?`);
  }
}

/**
 * API client methods mapping 1:1 to Leverage FastAPI endpoints.
 */
export const api = {
  /**
   * GET /health - Uptime check
   */
  async checkHealth(): Promise<HealthResponse> {
    return request<HealthResponse>("/health");
  },

  /**
   * GET /vendors - List all vendors with confidence badges from local index
   */
  async getVendors(): Promise<VendorSummary[]> {
    return request<VendorSummary[]>("/vendors");
  },

  /**
   * GET /vendors/{vendor}/brief - The core product: synthesized negotiation brief
   */
  async getVendorBrief(vendor: string): Promise<NegotiationBrief> {
    const encoded = encodeURIComponent(vendor);
    return request<NegotiationBrief>(`/vendors/${encoded}/brief`);
  },

  /**
   * POST /negotiations - Log a new negotiation (writes into vendor's shared Hindsight bank)
   */
  async logNegotiation(payload: NegotiationIn): Promise<NegotiationOut> {
    return request<NegotiationOut>("/negotiations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /negotiations/parse - Optional Groq helper: freeform text -> structured fields
   */
  async parseNegotiationNotes(notes: string): Promise<NegotiationParseResult> {
    return request<NegotiationParseResult>("/negotiations/parse", {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  },
};
