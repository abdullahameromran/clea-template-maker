export interface SupabaseInvoiceTemplateRow {
  id: string;
  name: string;
  description: string | null;
  html_body: string;
  variables: unknown;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY as string | undefined;

export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl) {
    return "Missing VITE_SUPABASE_URL";
  }
  if (!supabaseApiKey) {
    return "Missing VITE_SUPABASE_API_KEY";
  }
  return null;
}

export function getTemplateByIdEndpoint(templateId: string): string {
  if (!supabaseUrl) {
    return "";
  }
  const encodedId = encodeURIComponent(templateId);
  return `${supabaseUrl}/rest/v1/invoice_templates?select=*&id=eq.${encodedId}`;
}

export async function fetchInvoiceTemplates(): Promise<SupabaseInvoiceTemplateRow[]> {
  const configError = getSupabaseConfigError();
  if (configError || !supabaseUrl || !supabaseApiKey) {
    throw new Error(configError ?? "Supabase config is missing.");
  }

  const url = `${supabaseUrl}/rest/v1/invoice_templates?select=id,name,description,html_body,variables,version,is_active,created_at,updated_at&is_active=eq.true&order=created_at.desc`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseApiKey,
      Authorization: `Bearer ${supabaseApiKey}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${errorBody}`);
  }

  return (await response.json()) as SupabaseInvoiceTemplateRow[];
}

export async function fetchInvoiceTemplateById(templateId: string): Promise<SupabaseInvoiceTemplateRow | null> {
  const configError = getSupabaseConfigError();
  if (configError || !supabaseUrl || !supabaseApiKey) {
    throw new Error(configError ?? "Supabase config is missing.");
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(templateId);
  if (!isUuid) {
    return null;
  }

  const encodedId = encodeURIComponent(templateId);
  const url = `${supabaseUrl}/rest/v1/invoice_templates?select=id,name,description,html_body,variables,version,is_active,created_at,updated_at&id=eq.${encodedId}&limit=1`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseApiKey,
      Authorization: `Bearer ${supabaseApiKey}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${errorBody}`);
  }

  const rows = (await response.json()) as SupabaseInvoiceTemplateRow[];
  return rows[0] ?? null;
}

export async function fetchInvoiceTemplateByName(templateName: string): Promise<SupabaseInvoiceTemplateRow | null> {
  const configError = getSupabaseConfigError();
  if (configError || !supabaseUrl || !supabaseApiKey) {
    throw new Error(configError ?? "Supabase config is missing.");
  }

  const encodedName = encodeURIComponent(templateName);
  const url = `${supabaseUrl}/rest/v1/invoice_templates?select=id,name,description,html_body,variables,version,is_active,created_at,updated_at&name=eq.${encodedName}&limit=1`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseApiKey,
      Authorization: `Bearer ${supabaseApiKey}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${errorBody}`);
  }

  const rows = (await response.json()) as SupabaseInvoiceTemplateRow[];
  return rows[0] ?? null;
}

export async function fetchInvoiceTemplateByNameCandidates(templateNames: string[]): Promise<SupabaseInvoiceTemplateRow | null> {
  const uniqueNames = Array.from(
    new Set(templateNames.map((name) => name.trim()).filter((name) => name.length > 0))
  );

  for (const name of uniqueNames) {
    const row = await fetchInvoiceTemplateByName(name);
    if (row) {
      return row;
    }
  }

  return null;
}
