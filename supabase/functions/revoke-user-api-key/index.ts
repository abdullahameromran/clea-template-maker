import { corsHeaders } from "../_shared/cors.ts";
import { createAdminSupabaseClient, requireAuthenticatedUser } from "../_shared/api-access.ts";

type RevokeApiKeyRequest = {
  keyId?: string;
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
    const body = (await request.json().catch(() => ({}))) as RevokeApiKeyRequest;

    if (!body.keyId) {
      return jsonResponse({ error: "Missing keyId." }, 400);
    }

    const adminClient = createAdminSupabaseClient();
    const { error } = await adminClient
      .from("user_api_keys")
      .update({
        revoked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.keyId)
      .eq("user_id", user.id)
      .is("revoked_at", null);

    if (error) {
      throw error;
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to revoke API key.";
    const status = message === "Unauthorized" ? 401 : 500;
    return jsonResponse({ error: message }, status);
  }
});
