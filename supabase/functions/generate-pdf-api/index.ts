import { corsHeaders } from "../_shared/cors.ts";
import {
  createAdminSupabaseClient,
  extractApiKeyFromRequest,
  getUserActivePlan,
  sha256Hex,
  startOfCurrentMonth,
} from "../_shared/api-access.ts";

type ApiKeyRow = {
  id: string;
  user_id: string;
  label: string;
  key_prefix: string;
  revoked_at: string | null;
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

async function logApiEvent(
  adminClient: ReturnType<typeof createAdminSupabaseClient>,
  payload: {
    userId: string;
    apiKeyId?: string | null;
    statusCode: number;
    metadata?: Record<string, unknown>;
  }
) {
  await adminClient.from("api_request_events").insert({
    user_id: payload.userId,
    api_key_id: payload.apiKeyId ?? null,
    endpoint: "generate-pdf-api",
    status_code: payload.statusCode,
    metadata: payload.metadata ?? {},
  });
}

async function incrementUsage(
  adminClient: ReturnType<typeof createAdminSupabaseClient>,
  userId: string
) {
  const usageMonth = startOfCurrentMonth();
  const nowIso = new Date().toISOString();
  const { data: existing } = await adminClient
    .from("user_monthly_usage")
    .select("id,invoices_generated,api_requests,saved_templates,automation_runs")
    .eq("user_id", userId)
    .eq("usage_month", usageMonth)
    .maybeSingle();

  if (existing?.id) {
    await adminClient
      .from("user_monthly_usage")
      .update({
        invoices_generated: Number(existing.invoices_generated ?? 0) + 1,
        api_requests: Number(existing.api_requests ?? 0) + 1,
        last_activity_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", existing.id);
    return Number(existing.invoices_generated ?? 0) + 1;
  }

  await adminClient.from("user_monthly_usage").insert({
    user_id: userId,
    usage_month: usageMonth,
    invoices_generated: 1,
    api_requests: 1,
    saved_templates: 0,
    automation_runs: 0,
    last_activity_at: nowIso,
  });

  return 1;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const adminClient = createAdminSupabaseClient();
  const rawApiKey = extractApiKeyFromRequest(request);

  if (!rawApiKey) {
    return jsonResponse({ error: "Missing API key. Send it in x-api-key or Authorization: Bearer <key>." }, 401);
  }

  try {
    const keyHash = await sha256Hex(rawApiKey);
    const { data: apiKey, error: apiKeyError } = await adminClient
      .from("user_api_keys")
      .select("id,user_id,label,key_prefix,revoked_at")
      .eq("key_hash", keyHash)
      .is("revoked_at", null)
      .maybeSingle();

    if (apiKeyError) {
      throw apiKeyError;
    }
    if (!apiKey) {
      return jsonResponse({ error: "Invalid API key." }, 401);
    }

    const activeKey = apiKey as ApiKeyRow;
    const plan = await getUserActivePlan(adminClient, activeKey.user_id);

    if (plan.api_access_level === "none") {
      await logApiEvent(adminClient, {
        userId: activeKey.user_id,
        apiKeyId: activeKey.id,
        statusCode: 403,
        metadata: { reason: "plan_has_no_api_access", plan_code: plan.code },
      });
      return jsonResponse({ error: "Your plan does not include API access." }, 403);
    }

    if (plan.requests_per_second != null) {
      const oneSecondAgo = new Date(Date.now() - 1000).toISOString();
      const { count } = await adminClient
        .from("api_request_events")
        .select("*", { count: "exact", head: true })
        .eq("user_id", activeKey.user_id)
        .gte("request_at", oneSecondAgo);

      if ((count ?? 0) >= plan.requests_per_second) {
        await logApiEvent(adminClient, {
          userId: activeKey.user_id,
          apiKeyId: activeKey.id,
          statusCode: 429,
          metadata: { reason: "rate_limit_exceeded", plan_code: plan.code },
        });
        return jsonResponse({ error: `Rate limit exceeded for plan ${plan.name}.` }, 429);
      }
    }

    if (plan.invoices_per_month != null) {
      const usageMonth = startOfCurrentMonth();
      const { data: usage } = await adminClient
        .from("user_monthly_usage")
        .select("invoices_generated")
        .eq("user_id", activeKey.user_id)
        .eq("usage_month", usageMonth)
        .maybeSingle();

      if (Number(usage?.invoices_generated ?? 0) >= plan.invoices_per_month) {
        await logApiEvent(adminClient, {
          userId: activeKey.user_id,
          apiKeyId: activeKey.id,
          statusCode: 403,
          metadata: { reason: "monthly_invoice_limit_reached", plan_code: plan.code },
        });
        return jsonResponse({ error: `Monthly invoice limit reached for plan ${plan.name}.` }, 403);
      }
    }

    const requestBody = await request.text();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase service role configuration.");
    }

    const upstreamResponse = await fetch(`${supabaseUrl}/functions/v1/generate_pdf_via_aws`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": request.headers.get("content-type") || "application/json",
      },
      body: requestBody,
    });

    const responseBuffer = await upstreamResponse.arrayBuffer();

    await adminClient
      .from("user_api_keys")
      .update({
        last_used_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeKey.id);

    await logApiEvent(adminClient, {
      userId: activeKey.user_id,
      apiKeyId: activeKey.id,
      statusCode: upstreamResponse.status,
      metadata: {
        plan_code: plan.code,
        key_prefix: activeKey.key_prefix,
      },
    });

    if (upstreamResponse.ok) {
      await incrementUsage(adminClient, activeKey.user_id);
    }

    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set(
      "Content-Type",
      upstreamResponse.headers.get("content-type") || "application/json"
    );

    const contentDisposition = upstreamResponse.headers.get("content-disposition");
    if (contentDisposition) {
      responseHeaders.set("Content-Disposition", contentDisposition);
    }

    const contentLength = upstreamResponse.headers.get("content-length");
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }

    return new Response(responseBuffer, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Managed PDF API request failed.";
    return jsonResponse({ error: message }, 500);
  }
});
