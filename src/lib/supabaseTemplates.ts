export interface SupabaseInvoiceTemplateRow {
  id: string;
  name: string;
  description: string | null;
  html_body: string;
  variables: unknown;
  sample_body?: unknown;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseInvoiceRow {
  id: string;
  template_id: string;
  invoice_number: string;
  status: string;
  variable_data: unknown;
  issued_at: string | null;
  due_at: string | null;
  total_amount: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseInvoiceLineItemRow {
  id: string;
  invoice_id: string;
  sort_order: number;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number | null;
  created_at: string;
}

export interface SupabaseInvoiceSample {
  invoice: SupabaseInvoiceRow;
  lineItems: SupabaseInvoiceLineItemRow[];
}

interface SupabaseTemplateActivityRow {
  name: string;
  is_active: boolean;
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

  const url = `${supabaseUrl}/rest/v1/invoice_templates?select=id,name,description,html_body,variables,sample_body,version,is_active,created_at,updated_at&is_active=eq.true&order=created_at.desc`;
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
  const url = `${supabaseUrl}/rest/v1/invoice_templates?select=id,name,description,html_body,variables,sample_body,version,is_active,created_at,updated_at&id=eq.${encodedId}&is_active=eq.true&limit=1`;
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
  const url = `${supabaseUrl}/rest/v1/invoice_templates?select=id,name,description,html_body,variables,sample_body,version,is_active,created_at,updated_at&name=eq.${encodedName}&is_active=eq.true&limit=1`;
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

export async function fetchLatestInvoiceSampleByTemplateId(templateId: string): Promise<SupabaseInvoiceSample | null> {
  const configError = getSupabaseConfigError();
  if (configError || !supabaseUrl || !supabaseApiKey) {
    throw new Error(configError ?? "Supabase config is missing.");
  }

  const encodedTemplateId = encodeURIComponent(templateId);
  const invoiceUrl = `${supabaseUrl}/rest/v1/invoices?select=id,template_id,invoice_number,status,variable_data,issued_at,due_at,total_amount,currency,created_at,updated_at&template_id=eq.${encodedTemplateId}&order=created_at.desc&limit=1`;
  const invoiceResponse = await fetch(invoiceUrl, {
    headers: {
      apikey: supabaseApiKey,
      Authorization: `Bearer ${supabaseApiKey}`,
    },
  });

  if (!invoiceResponse.ok) {
    const errorBody = await invoiceResponse.text();
    throw new Error(`Supabase invoice request failed (${invoiceResponse.status}): ${errorBody}`);
  }

  const invoices = (await invoiceResponse.json()) as SupabaseInvoiceRow[];
  const invoice = invoices[0];
  if (!invoice) {
    return null;
  }

  const encodedInvoiceId = encodeURIComponent(invoice.id);
  const lineItemsUrl = `${supabaseUrl}/rest/v1/invoice_line_items?select=id,invoice_id,sort_order,description,quantity,unit_price,amount,created_at&invoice_id=eq.${encodedInvoiceId}&order=sort_order.asc`;
  const lineItemsResponse = await fetch(lineItemsUrl, {
    headers: {
      apikey: supabaseApiKey,
      Authorization: `Bearer ${supabaseApiKey}`,
    },
  });

  if (!lineItemsResponse.ok) {
    const errorBody = await lineItemsResponse.text();
    throw new Error(`Supabase line items request failed (${lineItemsResponse.status}): ${errorBody}`);
  }

  const lineItems = (await lineItemsResponse.json()) as SupabaseInvoiceLineItemRow[];
  return { invoice, lineItems };
}

export async function fetchInvoiceTemplateNameActivity(): Promise<Record<string, boolean>> {
  const configError = getSupabaseConfigError();
  if (configError || !supabaseUrl || !supabaseApiKey) {
    throw new Error(configError ?? "Supabase config is missing.");
  }

  const url = `${supabaseUrl}/rest/v1/invoice_templates?select=name,is_active,updated_at&order=updated_at.desc`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseApiKey,
      Authorization: `Bearer ${supabaseApiKey}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Supabase activity request failed (${response.status}): ${errorBody}`);
  }

  const rows = (await response.json()) as SupabaseTemplateActivityRow[];
  const byName: Record<string, boolean> = {};

  for (const row of rows) {
    const name = row?.name?.trim().toLowerCase();
    if (!name) {
      continue;
    }
    if (!(name in byName)) {
      byName[name] = Boolean(row.is_active);
    }
  }

  return byName;
}
