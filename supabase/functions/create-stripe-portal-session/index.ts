import { corsHeaders } from "../_shared/cors.ts";
import {
  createAdminSupabaseClient,
  getSiteUrl,
  requireAuthenticatedUser,
  stripeFormRequest,
} from "../_shared/stripe.ts";

type PortalRequest = {
  returnPath?: string;
};

type PortalSession = {
  url: string;
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
    const body = (await request.json().catch(() => ({}))) as PortalRequest;
    const siteUrl = getSiteUrl(request.headers.get("origin"));
    const returnUrl = new URL(body.returnPath ?? "/#pricing", siteUrl).toString();
    const adminClient = createAdminSupabaseClient();

    const { data: subscription } = await adminClient
      .from("user_subscriptions")
      .select("external_customer_id")
      .eq("user_id", user.id)
      .not("external_customer_id", "is", null)
      .in("status", ["trialing", "active", "past_due"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!subscription?.external_customer_id) {
      return jsonResponse({ error: "No Stripe customer found for this account yet." }, 400);
    }

    const form = new URLSearchParams();
    form.set("customer", subscription.external_customer_id);
    form.set("return_url", returnUrl);

    const portalSession = await stripeFormRequest<PortalSession>("/billing_portal/sessions", form);

    return jsonResponse({ url: portalSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create Stripe billing portal session.";
    const status = message === "Unauthorized" ? 401 : 500;
    return jsonResponse({ error: message }, status);
  }
});
