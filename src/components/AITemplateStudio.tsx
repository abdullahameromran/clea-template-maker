import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { InvoiceTemplate } from "@/data/invoiceTemplates";
import InvoiceVisualBuilder from "@/components/InvoiceVisualBuilder";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type VariableDefinition = {
  key: string;
  label?: string;
  required?: boolean;
  default_value?: unknown;
};

type CalculationStep = {
  sort_order: number;
  output_key: string;
  operation: string;
  operand_a?: string | null;
  operand_b?: string | null;
  operand_c?: string | null;
  format?: string | null;
  description?: string | null;
};

type AIDraft = {
  id?: string;
  name: string;
  description: string;
  html_body: string;
  variables: VariableDefinition[];
  variable_map: Record<string, string>;
  calculations: CalculationStep[];
  sample_body?: Record<string, unknown> | null;
};

type InvoiceTemplateRow = {
  id: string;
  name: string;
  description: string | null;
  html_body: string;
  variables: unknown;
  sample_body: unknown;
  version: number;
  is_active: boolean;
  user_id: string | null;
  updated_at: string;
};

type AIResponse = {
  success: boolean;
  invoice_template?: {
    id: string;
    name: string;
    description: string | null;
    html_body: string;
    variables: unknown;
    sample_body: unknown;
    updated_at?: string;
  };
  template_calculations?: unknown[];
  summary?: {
    calc_count?: number;
    template_name?: string;
  };
  error?: string;
};

const EDGE_PROMPT_INSTRUCTIONS = `You are an invoice template designer. Generate a complete, professional invoice template.
- CSS must be self-contained (no external dependencies)
- Include print-friendly styles (@media print)
- Professional, clean design`;
const EDGE_TIMEOUT_MS = 120000;
const EDGE_MAX_RETRIES = 2;

interface AITemplateStudioProps {
  user: User;
  onTemplatesUpdated: (templates: InvoiceTemplate[]) => void;
}

const REQUIRED_EDGE_PLACEHOLDERS = [
  "invoice_number",
  "issue_date",
  "due_date",
  "payment_terms",
  "from_name",
  "from_address",
  "from_email",
  "to_name",
  "to_address",
  "company_name",
  "company_address",
  "company_email",
  "line_items_html",
  "subtotal",
  "vat_label",
  "vat_amount",
  "total",
];

const ALLOWED_EDGE_PLACEHOLDERS = new Set([
  "invoice_number",
  "issue_date",
  "due_date",
  "payment_terms",
  "engagement_name",
  "from_name",
  "from_address",
  "from_tax_id",
  "from_email",
  "to_name",
  "to_address",
  "to_po_number",
  "to_email",
  "company_name",
  "company_tagline",
  "company_address",
  "company_email",
  "line_items_html",
  "professional_fees",
  "expenses",
  "subtotal",
  "vat_label",
  "vat_amount",
  "total",
  "bank_details",
  "currency",
]);

function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

function parseVariables(raw: unknown): VariableDefinition[] {
  let parsed = raw;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const key = "key" in item && typeof item.key === "string" ? item.key : "";
      if (!key) {
        return null;
      }
      return {
        key,
        label: "label" in item && typeof item.label === "string" ? item.label : undefined,
        required: "required" in item && typeof item.required === "boolean" ? item.required : undefined,
        default_value: "default_value" in item ? item.default_value : undefined,
      };
    })
    .filter((v): v is VariableDefinition => Boolean(v));
}

function parseCalculationSteps(raw: unknown): CalculationStep[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const sortOrder =
        "sort_order" in item && typeof item.sort_order === "number"
          ? item.sort_order
          : Number("sort_order" in item ? item.sort_order : NaN);
      const outputKey = "output_key" in item && typeof item.output_key === "string" ? item.output_key.trim() : "";
      const operation = "operation" in item && typeof item.operation === "string" ? item.operation.trim() : "";

      if (!Number.isFinite(sortOrder) || !outputKey || !operation) {
        return null;
      }

      return {
        sort_order: sortOrder,
        output_key: outputKey,
        operation,
        operand_a: "operand_a" in item && item.operand_a != null ? String(item.operand_a) : null,
        operand_b: "operand_b" in item && item.operand_b != null ? String(item.operand_b) : null,
        operand_c: "operand_c" in item && item.operand_c != null ? String(item.operand_c) : null,
        format: "format" in item && item.format != null ? String(item.format) : null,
        description: "description" in item && item.description != null ? String(item.description) : null,
      };
    })
    .filter((step): step is CalculationStep => Boolean(step))
    .sort((a, b) => a.sort_order - b.sort_order);
}

function findMissingPlaceholders(html: string): string[] {
  const missing: string[] = [];
  for (const key of REQUIRED_EDGE_PLACEHOLDERS) {
    if (!html.includes(`{{${key}}}`)) {
      missing.push(key);
    }
  }
  return missing;
}

function normalizeHtmlForEdge(html: string): { normalizedHtml: string; removedUnknown: string[] } {
  const aliasMap: Record<string, string> = {
    line_items: "line_items_html",
    items_html: "line_items_html",
    amount_charged: "total",
    grand_total: "total",
    tax_amount: "vat_amount",
    tax_label: "vat_label",
    invoice_no: "invoice_number",
    invoice_id: "invoice_number",
    client_name: "to_name",
    client_address: "to_address",
  };

  let normalized = html;
  for (const [from, to] of Object.entries(aliasMap)) {
    normalized = normalized.replaceAll(`{{${from}}}`, `{{${to}}}`);
  }

  const unknown = new Set<string>();
  normalized = normalized.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    if (ALLOWED_EDGE_PLACEHOLDERS.has(key)) {
      return `{{${key}}}`;
    }
    unknown.add(key);
    return "";
  });

  normalized = stabilizeInvoiceStructure(normalized);
  return { normalizedHtml: normalized, removedUnknown: Array.from(unknown) };
}

function stabilizeInvoiceStructure(html: string): string {
  let out = html;
  const lineItemsToken = "{{line_items_html}}";

  if (out.includes(lineItemsToken)) {
    const tokenInsideTbody = /<tbody[^>]*>[\s\S]*\{\{line_items_html\}\}[\s\S]*<\/tbody>/i.test(out);

    if (!tokenInsideTbody) {
      out = out.replaceAll(lineItemsToken, "");

      if (/<tbody[^>]*>[\s\S]*<\/tbody>/i.test(out)) {
        out = out.replace(/<tbody([^>]*)>[\s\S]*?<\/tbody>/i, `<tbody$1>\n${lineItemsToken}\n</tbody>`);
      } else if (/<table[^>]*>[\s\S]*<\/table>/i.test(out)) {
        out = out.replace(/<\/table>/i, `<tbody>\n${lineItemsToken}\n</tbody>\n</table>`);
      } else {
        out += `\n<table style="width:100%;border-collapse:collapse;"><tbody>${lineItemsToken}</tbody></table>`;
      }
    }
  }

  return out;
}

function mapDbRowToUiTemplate(row: InvoiceTemplateRow): InvoiceTemplate {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "AI generated template",
    category: "Creative",
    tags: ["ai", "custom", "personal"],
    primaryColor: "#1e3a5f",
    html: row.html_body,
  };
}

function renderTemplateWithVars(html: string, data: Record<string, string>): string {
  let rendered = html;

  // Resolve simple Handlebars-like conditional blocks for preview readability.
  // Example: {{#if company_logo_url}} ... {{/if}}
  const ifBlockRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifBlockRegex, (_full, key: string, inner: string) => {
    const value = (data[key] ?? "").trim();
    return value ? inner : "";
  });

  // Replace plain placeholders after conditionals are applied.
  rendered = rendered.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => data[key] ?? "");

  return rendered;
}

function extractTemplateKeys(html: string): string[] {
  const keys = new Set<string>();
  const regex = /\{\{(\w+)\}\}/g;
  let match = regex.exec(html);
  while (match) {
    if (match[1]) {
      keys.add(match[1]);
    }
    match = regex.exec(html);
  }
  return Array.from(keys);
}

function buildPreviewVars(sampleBody?: Record<string, unknown> | null): Record<string, string> {
  const defaults: Record<string, string> = {
    invoice_number: "INV-2026-1042",
    issue_date: "March 2, 2026",
    due_date: "March 16, 2026",
    payment_terms: "Net 14",
    engagement_name: "Consulting Services",
    from_name: "Apex Consulting",
    from_address: "24 Business Ave, New York, NY 10001",
    from_tax_id: "US-98-1234567",
    from_email: "billing@apexconsulting.com",
    to_name: "NextWave Corp",
    to_address: "450 Market St, San Francisco, CA 94105",
    to_po_number: "PO-7742",
    to_email: "accounts@nextwave.io",
    company_name: "Apex Consulting",
    company_logo_url: "https://dummyimage.com/180x50/0f172a/ffffff.png&text=Apex+Consulting",
    company_tagline: "Strategy and Growth Partner",
    company_address: "24 Business Ave, New York, NY 10001",
    company_email: "billing@apexconsulting.com",
    professional_fees: "7,200.00",
    expenses: "0.00",
    subtotal: "7,200.00",
    vat_label: "Tax (8%)",
    vat_amount: "576.00",
    total: "7,776.00",
    bank_details: "Bank of America - 9988776655",
    currency: "$",
    line_items_html:
      "<tr><td>Strategy Workshop</td><td>16</td><td>$450.00</td><td>$7,200.00</td></tr>",
  };

  if (!sampleBody) {
    return defaults;
  }

  const source =
    sampleBody.variable_data &&
    typeof sampleBody.variable_data === "object" &&
    !Array.isArray(sampleBody.variable_data)
      ? (sampleBody.variable_data as Record<string, unknown>)
      : sampleBody;

  const mapped = { ...defaults };
  for (const [k, v] of Object.entries(source)) {
    mapped[k] = String(v ?? "");
  }

  if (Array.isArray(source.line_items) && source.line_items.length > 0) {
    const rows = source.line_items
      .map((item) => {
        if (!item || typeof item !== "object") {
          return "";
        }
        const description = "description" in item ? String(item.description ?? "") : "";
        const quantity = Number("quantity" in item ? item.quantity : 0);
        const unitPrice = Number("unit_price" in item ? item.unit_price : 0);
        const amount = quantity * unitPrice;
        const currency = mapped.currency ?? "$";
        return `<tr><td>${description}</td><td>${quantity}</td><td>${currency}${unitPrice.toFixed(2)}</td><td>${currency}${amount.toFixed(2)}</td></tr>`;
      })
      .join("");
    if (rows.trim()) {
      mapped.line_items_html = rows;
    }
  }

  return mapped;
}

const AITemplateStudio = ({ user, onTemplatesUpdated }: AITemplateStudioProps) => {
  const [prompt, setPrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [compatWarning, setCompatWarning] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [rows, setRows] = useState<InvoiceTemplateRow[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [previewOverrides, setPreviewOverrides] = useState<Record<string, string>>({});
  const [builderOpen, setBuilderOpen] = useState(false);
  const emptyDraft: AIDraft = {
    name: "",
    description: "",
    html_body: "",
    variables: [],
    variable_map: {},
    calculations: [],
    sample_body: null,
  };
  const [draft, setDraft] = useState<AIDraft>(emptyDraft);
  const previewRef = useRef<HTMLIFrameElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState(1120);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey =
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_API_KEY as string | undefined);

  const selectedRow = useMemo(() => rows.find((r) => r.id === selectedId) ?? null, [rows, selectedId]);
  const uiTemplates = useMemo(() => rows.map(mapDbRowToUiTemplate), [rows]);
  const basePreviewVars = useMemo(() => buildPreviewVars(draft.sample_body), [draft.sample_body]);
  const templateKeys = useMemo(() => extractTemplateKeys(draft.html_body), [draft.html_body]);
  const editableKeys = useMemo(() => {
    const fromVariables = draft.variables.map((v) => v.key);
    return Array.from(new Set([...templateKeys, ...fromVariables, ...Object.keys(basePreviewVars)])).sort();
  }, [templateKeys, draft.variables, basePreviewVars]);
  const mergedPreviewVars = useMemo(() => ({ ...basePreviewVars, ...previewOverrides }), [basePreviewVars, previewOverrides]);

  const previewHtml = useMemo(() => {
    if (!draft.html_body.trim()) {
      return "";
    }
    return renderTemplateWithVars(draft.html_body, mergedPreviewVars);
  }, [draft.html_body, mergedPreviewVars]);

  useEffect(() => {
    setPreviewOverrides({});
  }, [draft.id, draft.html_body]);

  useEffect(() => {
    if (selectedId === "") {
      setDraft(emptyDraft);
      setPreviewOverrides({});
      setCompatWarning("");
      setMessage("");
    }
  }, [selectedId]);

  useEffect(() => {
    onTemplatesUpdated(uiTemplates);
  }, [uiTemplates, onTemplatesUpdated]);

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        return;
      }
      const { data, error: loadError } = await supabase
        .from("invoice_templates")
        .select("id,name,description,html_body,variables,sample_body,version,is_active,user_id,updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (loadError) {
        setError(loadError.message);
        return;
      }
      const loaded = (data ?? []) as InvoiceTemplateRow[];
      setRows(loaded);
    };

    void load();
  }, [user.id]);

  useEffect(() => {
    if (!selectedRow) {
      return;
    }
    let mounted = true;
    const loadTemplateDetails = async () => {
      let calculations: CalculationStep[] = [];
      if (supabase) {
        const { data } = await supabase
          .from("template_calculations")
          .select("sort_order,output_key,operation,operand_a,operand_b,operand_c,format,description")
          .eq("template_id", selectedRow.id)
          .order("sort_order", { ascending: true });
        calculations = parseCalculationSteps(data ?? []);
      }

      if (!mounted) {
        return;
      }

      setDraft({
        id: selectedRow.id,
        name: selectedRow.name,
        description: selectedRow.description ?? "",
        html_body: selectedRow.html_body,
        variables: parseVariables(selectedRow.variables),
        variable_map: {},
        calculations,
        sample_body:
          selectedRow.sample_body && typeof selectedRow.sample_body === "object" && !Array.isArray(selectedRow.sample_body)
            ? (selectedRow.sample_body as Record<string, unknown>)
            : null,
      });
      setChat((prev) => [...prev, { role: "assistant", content: `Loaded template "${selectedRow.name}". Continue chatting to update it.` }]);
    };

    void loadTemplateDetails();
    return () => {
      mounted = false;
    };
  }, [selectedRow]);

  const syncPreviewHeight = () => {
    const iframe = previewRef.current;
    if (!iframe) {
      return;
    }

    const doc = iframe.contentDocument;
    if (!doc) {
      return;
    }

    const bodyHeight = doc.body?.scrollHeight ?? 0;
    const htmlHeight = doc.documentElement?.scrollHeight ?? 0;
    const nextHeight = Math.max(bodyHeight, htmlHeight);

    if (nextHeight > 0) {
      setPreviewHeight(Math.min(Math.max(nextHeight + 12, 760), 2600));
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(syncPreviewHeight, 120);
    return () => window.clearTimeout(timer);
  }, [previewHtml]);

  const runAI = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setCompatWarning("");

    const userPrompt = prompt.trim();
    if (!userPrompt) {
      return;
    }
    if (!supabase || !supabaseUrl || !supabaseKey) {
      setError("Missing Supabase configuration.");
      return;
    }

    const nextUserMessage: ChatMessage = { role: "user", content: userPrompt };
    const nextChat = [...chat, nextUserMessage];
    setChat(nextChat);
    setPrompt("");
    setBusy(true);

    try {
      const session = await supabase.auth.getSession();
      const authToken = session.data.session?.access_token ?? supabaseKey;

      let response: Response | null = null;
      let parsed: AIResponse | null = null;
      let lastError: unknown = null;

      for (let attempt = 1; attempt <= EDGE_MAX_RETRIES; attempt += 1) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), EDGE_TIMEOUT_MS);
        try {
          response = await fetch(`${supabaseUrl}/functions/v1/generate-pdf-with-ai`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              use_case: `${userPrompt}\n\n${EDGE_PROMPT_INSTRUCTIONS}`,
              primary_color: primaryColor,
            }),
          });

          const raw = await response.text();
          try {
            parsed = JSON.parse(raw) as AIResponse;
          } catch {
            throw new Error(`Invalid JSON response from edge function (${response.status}).`);
          }

          if (!response.ok || !parsed.success || !parsed.invoice_template) {
            throw new Error(parsed.error ?? `Edge function failed (${response.status}).`);
          }

          break;
        } catch (err: unknown) {
          lastError = err;
          const isAbort = err instanceof Error && err.name === "AbortError";
          const isNetwork = err instanceof TypeError;
          if (attempt < EDGE_MAX_RETRIES && (isAbort || isNetwork)) {
            setMessage(`Edge function is slow, retrying (${attempt}/${EDGE_MAX_RETRIES - 1})...`);
            await new Promise((resolve) => window.setTimeout(resolve, 700));
            continue;
          }
          throw err;
        } finally {
          window.clearTimeout(timer);
        }
      }

      if (!response || !parsed || !parsed.invoice_template) {
        throw new Error(
          lastError instanceof Error ? lastError.message : "Edge function failed after retries."
        );
      }

      const template = parsed.invoice_template;
      const parsedVariables = parseVariables(template.variables);
      const parsedCalculations = parseCalculationSteps(parsed.template_calculations ?? []);
      const sampleBody =
        template.sample_body && typeof template.sample_body === "object" && !Array.isArray(template.sample_body)
          ? (template.sample_body as Record<string, unknown>)
          : null;

      const rawHtml = template.html_body ?? draft.html_body;
      const { normalizedHtml, removedUnknown } = rawHtml
        ? normalizeHtmlForEdge(rawHtml)
        : { normalizedHtml: rawHtml, removedUnknown: [] };
      const nextHtml = normalizedHtml;
      const missingPlaceholders = nextHtml ? findMissingPlaceholders(nextHtml) : [];

      setDraft((prev) => ({
        id: template.id ?? prev.id,
        name: template.name ?? prev.name,
        description: template.description ?? prev.description,
        html_body: nextHtml,
        variables: parsedVariables.length > 0 ? parsedVariables : prev.variables,
        variable_map: prev.variable_map,
        calculations: parsedCalculations.length > 0 ? parsedCalculations : prev.calculations,
        sample_body: sampleBody ?? prev.sample_body,
      }));
      setSelectedId(template.id);
      const updatedRow: InvoiceTemplateRow = {
        id: template.id,
        name: template.name,
        description: template.description,
        html_body: template.html_body,
        variables: template.variables,
        sample_body: template.sample_body,
        version: 1,
        is_active: true,
        user_id: user.id,
        updated_at: template.updated_at ?? new Date().toISOString(),
      };
      setRows((prev) => [updatedRow, ...prev.filter((row) => row.id !== updatedRow.id)]);
      setMessage("Template generated and saved from edge function.");
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Created "${template.name}" with ${parsed.summary?.calc_count ?? parsedCalculations.length} calculation step(s).`,
        },
      ]);
      if (missingPlaceholders.length > 0) {
        setCompatWarning(
          `Template is missing edge placeholders: ${missingPlaceholders
            .slice(0, 8)
            .join(", ")}${missingPlaceholders.length > 8 ? " ..." : ""}`
        );
      } else if (removedUnknown.length > 0) {
        setCompatWarning(
          `Removed unsupported placeholders: ${removedUnknown
            .slice(0, 8)
            .join(", ")}${removedUnknown.length > 8 ? " ..." : ""}`
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "AI generation failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="ai-studio" className="py-16 px-6 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <Sparkles size={14} className="text-primary" />
            <span className="text-foreground/80">AI Template Studio</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-3">Generate Templates with AI</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Describe your invoice style, then keep chatting to revise the same template. Save anytime to your Supabase account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="bg-background rounded-2xl border border-border p-5 lg:col-span-4">
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved templates</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full mt-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
              >
                <option value="">New template draft</option>
                {rows.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Template name (optional)"
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
              />
            </div>

            <form onSubmit={runAI} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/.test(primaryColor) ? primaryColor : "#0ea5e9"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-11 w-14 rounded-lg border border-border bg-card p-1 cursor-pointer"
                  title="Pick primary color"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#0ea5e9"
                  className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
                />
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe use case. Example: Medical clinic invoice with patient details, doctor info and treatment breakdown."
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm min-h-28"
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-navy text-white py-2.5 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {busy ? "Generating..." : "Generate with AI (Edge Function)"}
              </button>
            </form>
            <p className="text-[11px] text-muted-foreground mt-2">
              Uses `generate-pdf-with-ai` edge function and applies preview sample data automatically.
            </p>
            <button
              type="button"
              onClick={() => setBuilderOpen(true)}
              disabled={!draft.html_body}
              className="w-full mt-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              Open Drag & Drop Builder
            </button>

            {selectedId !== "" && draft.html_body.trim() !== "" && editableKeys.length > 0 && (
              <div className="mt-4 border border-border rounded-xl bg-card">
                <div className="px-3 py-2 border-b border-border text-xs font-semibold text-foreground">
                  Preview Data Editor
                </div>
                <div className="p-3 space-y-2 max-h-72 overflow-auto">
                  {editableKeys.map((key) => {
                    const value = previewOverrides[key] ?? mergedPreviewVars[key] ?? "";
                    const isColorField = key.toLowerCase().includes("color") && /^#[0-9A-Fa-f]{6}$/.test(value);
                    const isLong = key === "line_items_html" || value.length > 80;
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground">{key}</label>
                        {isLong ? (
                          <textarea
                            value={value}
                            onChange={(e) =>
                              setPreviewOverrides((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs min-h-20"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {isColorField && (
                              <input
                                type="color"
                                value={value}
                                onChange={(e) =>
                                  setPreviewOverrides((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                className="h-8 w-10 rounded border border-border bg-card p-0.5"
                              />
                            )}
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                setPreviewOverrides((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="px-3 py-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setPreviewOverrides({})}
                    className="text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-secondary"
                  >
                    Reset Preview Data
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-700 mt-3">{error}</p>}
            {compatWarning && <p className="text-xs text-amber-700 mt-3">{compatWarning}</p>}
            {message && (
              <p className="text-xs text-green-700 mt-3 inline-flex items-center gap-1.5">
                <Check size={12} />
                {message}
              </p>
            )}
          </div>

          <div className="bg-background rounded-2xl border border-border overflow-hidden lg:col-span-8">
            <div className="px-4 py-3 border-b border-border bg-muted text-sm font-semibold">Chat & Live Preview</div>
            <div className="p-4 space-y-3 h-48 overflow-auto border-b border-border">
              {chat.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Start with a prompt, then keep chatting to refine your generated template.
                </p>
              )}
              {chat.map((m, idx) => (
                <div
                  key={`${m.role}-${idx}`}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-navy text-white ml-8" : "bg-secondary text-foreground mr-8"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
            <div className="p-4 bg-secondary/40">
              {draft.html_body ? (
                <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
                  <iframe
                    ref={previewRef}
                    srcDoc={previewHtml}
                    title="AI Template Preview"
                    className="w-full border-none"
                    style={{ height: `${previewHeight}px` }}
                    sandbox="allow-same-origin"
                    onLoad={syncPreviewHeight}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No generated HTML yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <InvoiceVisualBuilder
        open={builderOpen}
        initialHtml={draft.html_body}
        onClose={() => setBuilderOpen(false)}
        onApply={async (nextHtml) => {
          const { normalizedHtml } = normalizeHtmlForEdge(nextHtml);
          setError("");
          setMessage("");

          if (!supabase) {
            setDraft((prev) => ({ ...prev, html_body: normalizedHtml }));
            setBuilderOpen(false);
            setError("Supabase is not configured.");
            return;
          }

          setBusy(true);
          try {
            const payload = {
              name: draft.name.trim() || "Visual Edited Template",
              description: draft.description.trim() || null,
              html_body: normalizedHtml,
              variables: draft.variables,
              sample_body: draft.sample_body ?? null,
              is_active: true,
              user_id: user.id,
            };

            let saved: InvoiceTemplateRow | null = null;
            if (draft.id) {
              const { data, error: updateError } = await supabase
                .from("invoice_templates")
                .update(payload)
                .eq("id", draft.id)
                .eq("user_id", user.id)
                .select("id,name,description,html_body,variables,sample_body,version,is_active,user_id,updated_at")
                .single();
              if (updateError) {
                throw updateError;
              }
              saved = data as InvoiceTemplateRow;
            } else {
              const { data, error: insertError } = await supabase
                .from("invoice_templates")
                .insert(payload)
                .select("id,name,description,html_body,variables,sample_body,version,is_active,user_id,updated_at")
                .single();
              if (insertError) {
                throw insertError;
              }
              saved = data as InvoiceTemplateRow;
            }

            if (saved) {
              setRows((prev) => [saved as InvoiceTemplateRow, ...prev.filter((row) => row.id !== saved!.id)]);
              setSelectedId(saved.id);
              setDraft((prev) => ({
                ...prev,
                id: saved!.id,
                name: saved!.name,
                description: saved!.description ?? prev.description,
                html_body: saved!.html_body,
                variables: parseVariables(saved!.variables),
                sample_body:
                  saved!.sample_body && typeof saved!.sample_body === "object" && !Array.isArray(saved!.sample_body)
                    ? (saved!.sample_body as Record<string, unknown>)
                    : prev.sample_body,
              }));
            } else {
              setDraft((prev) => ({ ...prev, html_body: normalizedHtml }));
            }

            setBuilderOpen(false);
            setMessage("Visual builder changes saved to database.");
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save visual changes.");
          } finally {
            setBusy(false);
          }
        }}
      />
    </section>
  );
};

export default AITemplateStudio;
