import { corsHeaders } from "../_shared/cors.ts";
import {
  createAdminSupabaseClient,
  resolvePlanCodeFromPriceId,
  verifyStripeWebhookSignature,
  type SupportedPlanCode,
} from "../_shared/stripe.ts";

type StripeEvent = {
  id: string;
  type: string;
  livemode: boolean;
  data: {
    object: Record<string, unknown>;
  };
};

type StripeSubscription = {
  id: string;
  status: string;
  customer: string;
  currency?: string | null;
  cancel_at_period_end?: boolean;
  current_period_start?: number;
  current_period_end?: number;
  metadata?: Record<string, string | undefined>;
  items?: {
    data?: Array<{
      price?: {
        id?: string | null;
        product?: string | null;
        recurring?: {
          interval?: string | null;
        } | null;
      } | null;
    }>;
  };
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

function normalizeStatus(status: string): string {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "incomplete":
      return "incomplete";
    case "incomplete_expired":
      return "incomplete_expired";
    case "canceled":
      return "cancelled";
    default:
      return "cancelled";
  }
}

function toIso(timestamp?: number): string | null {
  if (!timestamp || !Number.isFinite(timestamp)) {
    return null;
  }
  return new Date(timestamp * 1000).toISOString();
}

async function findPlanId(adminClient: ReturnType<typeof createAdminSupabaseClient>, planCode: SupportedPlanCode) {
  const { data, error } = await adminClient
    .from("billing_plans")
    .select("id")
    .eq("code", planCode)
    .limit(1)
    .maybeSingle();

  if (error || !data?.id) {
    throw new Error(`Billing plan "${planCode}" not found.`);
  }

  return data.id as string;
}

async function resolveUserId(
  adminClient: ReturnType<typeof createAdminSupabaseClient>,
  subscription: StripeSubscription
): Promise<string | null> {
  const metadataUserId = subscription.metadata?.supabase_user_id;
  if (metadataUserId) {
    return metadataUserId;
  }

  const { data } = await adminClient
    .from("user_subscriptions")
    .select("user_id")
    .or(`external_subscription_id.eq.${subscription.id},external_customer_id.eq.${subscription.customer}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.user_id as string | undefined) ?? null;
}

async function syncSubscriptionFromStripe(
  adminClient: ReturnType<typeof createAdminSupabaseClient>,
  subscription: StripeSubscription
) {
  const firstItem = subscription.items?.data?.[0]?.price ?? null;
  const planCode =
    (subscription.metadata?.plan_code as SupportedPlanCode | undefined) ??
    resolvePlanCodeFromPriceId(firstItem?.id ?? null);

  if (!planCode) {
    throw new Error("Could not map Stripe subscription price to a billing plan.");
  }

  const userId = await resolveUserId(adminClient, subscription);
  if (!userId) {
    throw new Error("Could not resolve Supabase user for Stripe subscription.");
  }

  const planId = await findPlanId(adminClient, planCode);
  const normalizedStatus = normalizeStatus(subscription.status);
  const billingCycle =
    firstItem?.recurring?.interval === "year" ? "yearly" : firstItem?.recurring?.interval === "month" ? "monthly" : "custom";

  const { data: existing } = await adminClient
    .from("user_subscriptions")
    .select("id")
    .eq("external_subscription_id", subscription.id)
    .maybeSingle();

  const updatePayload = {
    user_id: userId,
    plan_id: planId,
    status: normalizedStatus,
    billing_cycle: billingCycle,
    provider: "stripe",
    current_period_start: toIso(subscription.current_period_start),
    current_period_end: toIso(subscription.current_period_end),
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    currency: subscription.currency?.toUpperCase() ?? "USD",
    external_customer_id: subscription.customer,
    external_subscription_id: subscription.id,
    metadata: subscription.metadata ?? {},
    provider_payload: subscription,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    await adminClient
      .from("user_subscriptions")
      .update(updatePayload)
      .eq("id", existing.id);
  } else {
    await adminClient
      .from("user_subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .in("status", ["trialing", "active", "past_due"]);

    await adminClient.from("user_subscriptions").insert(updatePayload);
  }
}

async function handleCheckoutCompleted(
  adminClient: ReturnType<typeof createAdminSupabaseClient>,
  session: Record<string, unknown>
) {
  const sessionMetadata =
    session.metadata && typeof session.metadata === "object"
      ? (session.metadata as Record<string, unknown>)
      : null;
  const userId =
    typeof session.client_reference_id === "string"
      ? session.client_reference_id
      : typeof sessionMetadata?.supabase_user_id === "string"
        ? sessionMetadata.supabase_user_id
        : null;

  if (!userId) {
    return;
  }

  await adminClient
    .from("user_subscriptions")
    .update({
      provider: "stripe",
      external_customer_id: typeof session.customer === "string" ? session.customer : null,
      external_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      checkout_session_id: typeof session.id === "string" ? session.id : null,
      provider_payload: session,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .in("status", ["trialing", "active", "past_due"]);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawBody = await request.text();
    await verifyStripeWebhookSignature(rawBody, request.headers.get("Stripe-Signature"));
    const event = JSON.parse(rawBody) as StripeEvent;
    const adminClient = createAdminSupabaseClient();

    const { data: existingEvent, error: existingEventError } = await adminClient
      .from("stripe_webhook_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .limit(1)
      .maybeSingle();

    if (existingEventError) {
      throw existingEventError;
    }
    if (existingEvent?.id) {
      return jsonResponse({ received: true, duplicate: true });
    }

    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(adminClient, event.data.object);
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await syncSubscriptionFromStripe(adminClient, event.data.object as unknown as StripeSubscription);
    }

    const { error: insertEventError } = await adminClient
      .from("stripe_webhook_events")
      .insert({
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        livemode: event.livemode,
        payload: event,
      });

    if (insertEventError) {
      throw insertEventError;
    }

    return jsonResponse({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook failed.";
    return jsonResponse({ error: message }, 400);
  }
});
