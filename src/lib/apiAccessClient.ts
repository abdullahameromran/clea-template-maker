import { supabase } from "@/lib/supabaseClient";

export interface UserApiKeyRow {
  id: string;
  label: string;
  key_prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface CreatedApiKeyPayload {
  id: string;
  label: string;
  key_prefix: string;
  created_at: string;
  api_key: string;
  plan_code: string;
  plan_name: string;
}

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
    throw new Error("You need to log in again before managing API keys.");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function fetchUserApiKeys(): Promise<UserApiKeyRow[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("user_api_keys")
    .select("id,label,key_prefix,last_used_at,revoked_at,created_at")
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as UserApiKeyRow[];
}

export async function createUserApiKey(label = "Default key"): Promise<CreatedApiKeyPayload> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const headers = await getFunctionAuthHeaders();
  const { data, error } = await supabase.functions.invoke<CreatedApiKeyPayload>("create-user-api-key", {
    headers,
    body: { label },
  });

  if (error) {
    throw new Error(error.message || "Failed to create API key.");
  }

  if (!data?.api_key) {
    throw new Error("API key creation succeeded but no key was returned.");
  }

  return data;
}

export async function revokeUserApiKey(keyId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const headers = await getFunctionAuthHeaders();
  const { error } = await supabase.functions.invoke("revoke-user-api-key", {
    headers,
    body: { keyId },
  });

  if (error) {
    throw new Error(error.message || "Failed to revoke API key.");
  }
}
