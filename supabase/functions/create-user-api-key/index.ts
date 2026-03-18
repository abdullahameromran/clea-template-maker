import { corsHeaders } from "../_shared/cors.ts";
import {
  createAdminSupabaseClient,
  generatePlainApiKey,
  getUserActivePlan,
  keyPrefixFromPlainKey,
  requireAuthenticatedUser,
  sha256Hex,
} from "../_shared/api-access.ts";

type CreateApiKeyRequest = {
  label?: string;
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
    const body = (await request.json().catch(() => ({}))) as CreateApiKeyRequest;
    const adminClient = createAdminSupabaseClient();
    const plan = await getUserActivePlan(adminClient, user.id);

    if (plan.api_access_level === "none") {
      return jsonResponse({ error: "Your current plan does not include API access." }, 403);
    }

    const plainKey = generatePlainApiKey();
    const keyHash = await sha256Hex(plainKey);
    const label = body.label?.trim() || "Default key";
    const prefix = keyPrefixFromPlainKey(plainKey);

    const { data, error } = await adminClient
      .from("user_api_keys")
      .insert({
        user_id: user.id,
        label,
        key_prefix: prefix,
        key_hash: keyHash,
      })
      .select("id,label,key_prefix,created_at")
      .single();

    if (error) {
      throw error;
    }

    return jsonResponse({
      id: data.id,
      label: data.label,
      key_prefix: data.key_prefix,
      created_at: data.created_at,
      api_key: plainKey,
      plan_code: plan.code,
      plan_name: plan.name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create API key.";
    const status = message === "Unauthorized" ? 401 : 500;
    return jsonResponse({ error: message }, status);
  }
});
