import { createClient } from "npm:@supabase/supabase-js@2";

export type SupportedPlanCode = "pro" | "business";
export type BillingCycle = "monthly" | "yearly";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getSiteUrl(requestOrigin?: string | null): string {
  return Deno.env.get("SITE_URL") || requestOrigin || "http://localhost:5173";
}

export function createUserSupabaseClient(authHeader: string | null) {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

export function createAdminSupabaseClient() {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function requireAuthenticatedUser(request: Request) {
  const userClient = createUserSupabaseClient(request.headers.get("Authorization"));
  const {
    data: { user },
    error,
  } = await userClient.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { user, userClient };
}

export function resolveStripePriceId(planCode: SupportedPlanCode, billingCycle: BillingCycle): string {
  const envName =
    planCode === "pro"
      ? billingCycle === "yearly"
        ? "STRIPE_PRICE_PRO_YEARLY"
        : "STRIPE_PRICE_PRO_MONTHLY"
      : billingCycle === "yearly"
        ? "STRIPE_PRICE_BUSINESS_YEARLY"
        : "STRIPE_PRICE_BUSINESS_MONTHLY";

  return requireEnv(envName);
}

export function resolvePlanCodeFromPriceId(priceId: string | null | undefined): SupportedPlanCode | null {
  if (!priceId) {
    return null;
  }

  const mapping: Record<string, SupportedPlanCode> = {};
  const proMonthly = Deno.env.get("STRIPE_PRICE_PRO_MONTHLY");
  const proYearly = Deno.env.get("STRIPE_PRICE_PRO_YEARLY");
  const businessMonthly = Deno.env.get("STRIPE_PRICE_BUSINESS_MONTHLY");
  const businessYearly = Deno.env.get("STRIPE_PRICE_BUSINESS_YEARLY");

  if (proMonthly) {
    mapping[proMonthly] = "pro";
  }
  if (proYearly) {
    mapping[proYearly] = "pro";
  }
  if (businessMonthly) {
    mapping[businessMonthly] = "business";
  }
  if (businessYearly) {
    mapping[businessYearly] = "business";
  }

  return mapping[priceId] ?? null;
}

export async function stripeFormRequest<T>(path: string, body: URLSearchParams): Promise<T> {
  const stripeSecretKey = requireEnv("STRIPE_SECRET_KEY");
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = await response.json();
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload && payload.error && typeof payload.error === "object" && "message" in payload.error
        ? String(payload.error.message)
        : "Stripe request failed.";
    throw new Error(message);
  }

  return payload as T;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  const bytes = new Uint8Array(clean.length / 2);
  for (let index = 0; index < clean.length; index += 2) {
    bytes[index / 2] = Number.parseInt(clean.slice(index, index + 2), 16);
  }
  return bytes;
}

function secureCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a[index] ^ b[index];
  }

  return diff === 0;
}

function parseStripeSignatureHeader(header: string): { timestamp: string; signatures: string[] } {
  const entries = header.split(",").map((part) => part.trim());
  const timestamp = entries.find((entry) => entry.startsWith("t="))?.slice(2);
  const signatures = entries
    .filter((entry) => entry.startsWith("v1="))
    .map((entry) => entry.slice(3))
    .filter(Boolean);

  if (!timestamp || signatures.length === 0) {
    throw new Error("Invalid Stripe-Signature header.");
  }

  return { timestamp, signatures };
}

export async function verifyStripeWebhookSignature(rawBody: string, signatureHeader: string | null): Promise<void> {
  if (!signatureHeader) {
    throw new Error("Missing Stripe-Signature header.");
  }

  const webhookSecret = requireEnv("STRIPE_WEBHOOK_SECRET");
  const { timestamp, signatures } = parseStripeSignatureHeader(signatureHeader);
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signedPayload = `${timestamp}.${rawBody}`;
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload)));
  const matches = signatures.some((signature) => secureCompare(digest, hexToBytes(signature)));

  if (!matches) {
    throw new Error("Invalid Stripe webhook signature.");
  }
}
