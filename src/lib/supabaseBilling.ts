import { pricingPlansByCode, type PlanCode } from "@/data/pricingPlans";
import { supabase } from "@/lib/supabaseClient";

type SubscriptionStatus = "trialing" | "active" | "past_due" | "cancelled" | "incomplete" | "incomplete_expired";

type BillingPlanRelation = {
  code?: string | null;
  name?: string | null;
  monthly_price_min?: number | null;
  monthly_price_max?: number | null;
  currency?: string | null;
  is_custom?: boolean | null;
} | null;

type SubscriptionRow = {
  status: SubscriptionStatus;
  billing_cycle: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  custom_price: number | null;
  currency: string | null;
  billing_plan?: BillingPlanRelation | BillingPlanRelation[];
};

export interface CurrentPlanSnapshot {
  code: PlanCode;
  name: string;
  status: SubscriptionStatus | "free";
  billingCycle: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  monthlyLabel: string;
}

export interface UserUsageSnapshot {
  usageMonth: string;
  invoicesGenerated: number;
  apiRequests: number;
  savedTemplates: number;
  automationRuns: number;
}

const ACTIVE_STATUSES: SubscriptionStatus[] = ["trialing", "active", "past_due"];

function startOfCurrentMonth(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
}

function normalizePlanCode(rawCode: string | null | undefined): PlanCode {
  if (rawCode === "pro" || rawCode === "business" || rawCode === "enterprise") {
    return rawCode;
  }
  return "free";
}

function buildFallbackPlan(): CurrentPlanSnapshot {
  const freePlan = pricingPlansByCode.free;
  return {
    code: freePlan.code,
    name: freePlan.name,
    status: "free",
    billingCycle: "monthly",
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    monthlyLabel: freePlan.monthlyLabel,
  };
}

function extractBillingPlan(rawPlan: BillingPlanRelation | BillingPlanRelation[] | undefined): BillingPlanRelation {
  if (Array.isArray(rawPlan)) {
    return rawPlan[0] ?? null;
  }
  return rawPlan ?? null;
}

export async function fetchCurrentUserPlan(userId: string): Promise<CurrentPlanSnapshot> {
  if (!supabase) {
    return buildFallbackPlan();
  }

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(
      "status,billing_cycle,current_period_end,cancel_at_period_end,custom_price,currency,billing_plan:billing_plans!user_subscriptions_plan_id_fkey(code,name,monthly_price_min,monthly_price_max,currency,is_custom)"
    )
    .eq("user_id", userId)
    .in("status", ACTIVE_STATUSES)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return buildFallbackPlan();
  }

  const row = data as SubscriptionRow;
  const billingPlan = extractBillingPlan(row.billing_plan);
  const code = normalizePlanCode(billingPlan?.code);
  const fallback = pricingPlansByCode[code];
  const customPrice =
    row.custom_price != null && Number.isFinite(Number(row.custom_price))
      ? `$${Number(row.custom_price).toFixed(0)} / month`
      : null;

  return {
    code,
    name: billingPlan?.name?.trim() || fallback.name,
    status: row.status,
    billingCycle: row.billing_cycle || "monthly",
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    monthlyLabel: customPrice || fallback.monthlyLabel,
  };
}

export async function fetchCurrentUserUsage(userId: string): Promise<UserUsageSnapshot | null> {
  if (!supabase) {
    return null;
  }

  const usageMonth = startOfCurrentMonth();
  const { data, error } = await supabase
    .from("user_monthly_usage")
    .select("usage_month,invoices_generated,api_requests,saved_templates,automation_runs")
    .eq("user_id", userId)
    .eq("usage_month", usageMonth)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    usageMonth: String(data.usage_month),
    invoicesGenerated: Number(data.invoices_generated ?? 0),
    apiRequests: Number(data.api_requests ?? 0),
    savedTemplates: Number(data.saved_templates ?? 0),
    automationRuns: Number(data.automation_runs ?? 0),
  };
}
