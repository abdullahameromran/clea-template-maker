import { createAdminSupabaseClient, getSiteUrl, requireAuthenticatedUser } from "./stripe.ts";

type ActivePlanRow = {
  user_id: string;
  billing_plan: {
    code: string;
    name: string;
    invoices_per_month: number | null;
    requests_per_second: number | null;
    api_access_level: string;
  } | {
    code: string;
    name: string;
    invoices_per_month: number | null;
    requests_per_second: number | null;
    api_access_level: string;
  }[] | null;
};

export { createAdminSupabaseClient, getSiteUrl, requireAuthenticatedUser };

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Hex(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return toHex(new Uint8Array(digest));
}

export function generatePlainApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `ih_live_${toHex(bytes)}`;
}

export function keyPrefixFromPlainKey(plainKey: string): string {
  return plainKey.slice(0, 14);
}

function unwrapPlan(plan: ActivePlanRow["billing_plan"]) {
  if (Array.isArray(plan)) {
    return plan[0] ?? null;
  }
  return plan ?? null;
}

export async function getUserActivePlan(adminClient: ReturnType<typeof createAdminSupabaseClient>, userId: string) {
  const { data, error } = await adminClient
    .from("user_subscriptions")
    .select("user_id,billing_plan:billing_plans!user_subscriptions_plan_id_fkey(code,name,invoices_per_month,requests_per_second,api_access_level)")
    .eq("user_id", userId)
    .in("status", ["trialing", "active", "past_due"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new Error("No active plan found for this user.");
  }

  const plan = unwrapPlan((data as ActivePlanRow).billing_plan);
  if (!plan) {
    throw new Error("Billing plan metadata is missing.");
  }

  return {
    ...plan,
    api_access_level:
      plan.code === "free" && plan.api_access_level === "none"
        ? "basic"
        : plan.api_access_level,
  };
}

export function extractApiKeyFromRequest(request: Request): string | null {
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey) {
    return xApiKey.trim();
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

export function startOfCurrentMonth(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
}
