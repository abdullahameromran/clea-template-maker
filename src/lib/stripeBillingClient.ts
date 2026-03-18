import { supabase } from "@/lib/supabaseClient";
import type { PlanCode } from "@/data/pricingPlans";

type CheckoutPayload = {
  planCode: Exclude<PlanCode, "free" | "enterprise">;
  billingCycle?: "monthly" | "yearly";
  successPath?: string;
  cancelPath?: string;
};

type CheckoutResponse = {
  url: string;
};

type PortalResponse = {
  url: string;
};

async function getFunctionAuthHeaders(): Promise<Record<string, string>> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message || "Could not read your session.");
  }

  if (!session?.access_token) {
    throw new Error("You need to log in again before upgrading your plan.");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function createStripeCheckoutSession(payload: CheckoutPayload): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const headers = await getFunctionAuthHeaders();
  const { data, error } = await supabase.functions.invoke<CheckoutResponse>(
    "create-stripe-checkout-session",
    {
      headers,
      body: payload,
    }
  );

  if (error) {
    throw new Error(error.message || "Failed to create Stripe checkout session.");
  }

  if (!data?.url) {
    throw new Error("Stripe checkout session did not return a URL.");
  }

  return data.url;
}

export async function createStripePortalSession(returnPath = "/#pricing"): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const headers = await getFunctionAuthHeaders();
  const { data, error } = await supabase.functions.invoke<PortalResponse>(
    "create-stripe-portal-session",
    {
      headers,
      body: { returnPath },
    }
  );

  if (error) {
    throw new Error(error.message || "Failed to create Stripe portal session.");
  }

  if (!data?.url) {
    throw new Error("Stripe portal session did not return a URL.");
  }

  return data.url;
}
