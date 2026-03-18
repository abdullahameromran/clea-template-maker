import { corsHeaders } from "../_shared/cors.ts";
import {
  createAdminSupabaseClient,
  getSiteUrl,
  requireAuthenticatedUser,
  resolveStripePriceId,
  stripeFormRequest,
  type BillingCycle,
  type SupportedPlanCode,
} from "../_shared/stripe.ts";

type CheckoutRequest = {
  planCode?: SupportedPlanCode;
  billingCycle?: BillingCycle;
  successPath?: string;
  cancelPath?: string;
};

type CheckoutSession = {
  id: string;
  url: string;
  customer: string | null;
  subscription: string | null;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user } = await requireAuthenticatedUser(request);
    const body = (await request.json()) as CheckoutRequest;
    const planCode = body.planCode;
    const billingCycle = body.billingCycle ?? "monthly";

    if (planCode !== "pro" && planCode !== "business") {
      return jsonResponse({ error: "Unsupported plan code." }, 400);
    }

    const priceId = resolveStripePriceId(planCode, billingCycle);
    const siteUrl = getSiteUrl(request.headers.get("origin"));
    const successUrl = new URL(body.successPath ?? "/?checkout=success#pricing", siteUrl).toString();
    const cancelUrl = new URL(body.cancelPath ?? "/?checkout=cancelled#pricing", siteUrl).toString();
    const adminClient = createAdminSupabaseClient();

    const { data: existingSubscription } = await adminClient
      .from("user_subscriptions")
      .select("external_customer_id")
      .eq("user_id", user.id)
      .not("external_customer_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set("success_url", successUrl);
    form.set("cancel_url", cancelUrl);
    form.set("allow_promotion_codes", "true");
    form.set("client_reference_id", user.id);
    form.set("line_items[0][price]", priceId);
    form.set("line_items[0][quantity]", "1");
    form.set("metadata[supabase_user_id]", user.id);
    form.set("metadata[plan_code]", planCode);
    form.set("subscription_data[metadata][supabase_user_id]", user.id);
    form.set("subscription_data[metadata][plan_code]", planCode);

    if (existingSubscription?.external_customer_id) {
      form.set("customer", existingSubscription.external_customer_id);
    } else if (user.email) {
      form.set("customer_email", user.email);
    }

    const session = await stripeFormRequest<CheckoutSession>("/checkout/sessions", form);

    await adminClient
      .from("user_subscriptions")
      .update({
        checkout_session_id: session.id,
        provider: "stripe",
        provider_payload: {
          checkout_session_id: session.id,
          checkout_url: session.url,
          requested_plan_code: planCode,
          requested_billing_cycle: billingCycle,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .in("status", ["trialing", "active", "past_due"]);

    return jsonResponse({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create Stripe checkout session.";
    const status = message === "Unauthorized" ? 401 : 500;
    return jsonResponse({ error: message }, status);
  }
});
