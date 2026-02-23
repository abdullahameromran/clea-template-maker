import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { InvoiceTemplate } from "@/data/invoiceTemplates";
import { Copy, Check, X, Eye, Code, Download, Printer } from "lucide-react";
import {
  fetchInvoiceTemplateById,
  fetchInvoiceTemplateByNameCandidates,
  getSupabaseConfigError,
  type SupabaseInvoiceTemplateRow,
} from "@/lib/supabaseTemplates";

interface TemplateModalProps {
  template: InvoiceTemplate;
  open: boolean;
  onClose: () => void;
}

type Tab = "preview" | "html";
type SupabaseStatus = "idle" | "loading" | "found" | "not_found" | "error";

type VariableDefinition = {
  key: string;
  label?: string;
  required?: boolean;
  default_value?: unknown;
};

const TemplateModal = ({ template, open, onClose }: TemplateModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>("idle");
  const [supabaseMessage, setSupabaseMessage] = useState("");
  const [supabaseTemplate, setSupabaseTemplate] = useState<SupabaseInvoiceTemplateRow | null>(null);

  const hasPassAccess = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("pass") === "password";
  }, []);

  const nameCandidates = useMemo(() => {
    const base = template.name.trim();
    const lower = base.toLowerCase();
    const kebab = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const snake = lower.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const noSpace = lower.replace(/\s+/g, "");
    return [base, lower, kebab, snake, noSpace];
  }, [template.name]);

  useEffect(() => {
    if (!open || !hasPassAccess) {
      return;
    }

    const configError = getSupabaseConfigError();
    if (configError) {
      setSupabaseStatus("error");
      setSupabaseMessage(configError);
      setSupabaseTemplate(null);
      return;
    }

    let isMounted = true;
    setSupabaseStatus("loading");
    setSupabaseMessage("Checking Supabase...");
    setSupabaseTemplate(null);

    fetchInvoiceTemplateById(template.id)
      .then(async (row) => {
        if (!isMounted) {
          return;
        }

        if (row) {
          setSupabaseTemplate(row);
          setSupabaseStatus("found");
          setSupabaseMessage("Found by ID in Supabase.");
          return;
        }

        const byName = await fetchInvoiceTemplateByNameCandidates(nameCandidates);
        if (!isMounted) {
          return;
        }

        if (byName) {
          setSupabaseTemplate(byName);
          setSupabaseStatus("found");
          setSupabaseMessage("Found by name in Supabase.");
        } else {
          setSupabaseStatus("not_found");
          setSupabaseMessage("No Supabase template found for this invoice.");
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }
        const message = error instanceof Error ? error.message : "Supabase lookup failed.";
        setSupabaseStatus("error");
        setSupabaseMessage(message);
      });

    return () => {
      isMounted = false;
    };
  }, [open, hasPassAccess, template.id, nameCandidates]);

  const variableDefinitions = useMemo(
    () => parseVariableDefinitions(supabaseTemplate?.variables),
    [supabaseTemplate]
  );

  const generatedBody = useMemo(() => {
    if (!supabaseTemplate) {
      return null;
    }

    const variableData = buildVariableData(variableDefinitions);
    const requestBody = {
      template_id: supabaseTemplate.id,
      invoice_number:
        typeof variableData.invoice_number === "string" && variableData.invoice_number.trim() !== ""
          ? variableData.invoice_number
          : "INV-2024-0001",
      variable_data: variableData,
    };

    return JSON.stringify(requestBody, null, 2);
  }, [supabaseTemplate, variableDefinitions]);

  const handleCopy = () => {
    navigator.clipboard.writeText(template.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyGeneratedBody = () => {
    if (!generatedBody) {
      return;
    }
    navigator.clipboard.writeText(generatedBody);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([template.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${template.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(template.html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-4 md:px-6 py-4 border-b border-border bg-card shrink-0">
          <div>
            <DialogTitle className="text-lg font-bold text-foreground font-display">{template.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{template.description}</p>
          </div>
          <div className="flex items-center flex-wrap justify-end gap-2">
            {hasPassAccess && (
              <div className="flex bg-muted rounded-lg p-1 gap-1">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === "preview"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye size={14} />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("html")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === "html"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code size={14} />
                  HTML Code
                </button>
              </div>
            )}
            {hasPassAccess && (
              <>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  <Download size={15} />
                  Download HTML
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  <Printer size={15} />
                  Print/PDF
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                  style={{
                    background: copied ? "#dcfce7" : "hsl(var(--primary))",
                    color: copied ? "#16a34a" : "hsl(var(--primary-foreground))",
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy HTML"}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {hasPassAccess && (
          <>
            <div className="px-4 md:px-6 py-2 border-b border-border bg-background/80 text-xs">
              {supabaseStatus === "idle" && <span className="text-muted-foreground">Supabase status: idle</span>}
              {supabaseStatus === "loading" && <span className="text-muted-foreground">{supabaseMessage}</span>}
              {supabaseStatus === "found" && <span className="text-green-700">{supabaseMessage}</span>}
              {supabaseStatus === "not_found" && <span className="text-amber-700">{supabaseMessage}</span>}
              {supabaseStatus === "error" && <span className="text-red-700">{supabaseMessage}</span>}
            </div>

            {supabaseTemplate && (
              <div className="px-4 md:px-6 py-3 border-b border-border bg-card/80">
                <div className="text-xs text-muted-foreground mb-2">
                  Supabase template: <span className="text-foreground font-semibold">{supabaseTemplate.name}</span> ({supabaseTemplate.id})
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-foreground mb-1">Variables (from Supabase)</div>
                    <pre className="max-h-40 overflow-auto rounded border border-border bg-muted p-2 text-[11px] leading-5">
                      {JSON.stringify(variableDefinitions, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-semibold text-foreground">Sample request body</div>
                      <button
                        onClick={handleCopyGeneratedBody}
                        className="text-xs px-2 py-1 rounded border border-border hover:bg-secondary transition-colors"
                      >
                        {copiedPayload ? "Copied!" : "Copy Body"}
                      </button>
                    </div>
                    <pre className="max-h-40 overflow-auto rounded border border-border bg-muted p-2 text-[11px] leading-5">
                      {generatedBody}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex-1 overflow-hidden">
          {activeTab === "preview" || !hasPassAccess ? (
            <div className="w-full h-full bg-secondary/50 flex items-start justify-center overflow-auto p-6">
              <div className="bg-white rounded-lg overflow-hidden w-full max-w-4xl" style={{ boxShadow: "var(--shadow-xl)" }}>
                <iframe
                  srcDoc={template.html}
                  title={`${template.name} preview`}
                  className="w-full border-none"
                  style={{ height: "900px" }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto bg-[#0d1117] relative">
              <div className="sticky top-0 flex items-center justify-between px-6 py-3 bg-[#161b22] border-b border-[#30363d] z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 text-xs text-[#8b949e] font-mono-code">invoice-{template.id}.html</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors px-3 py-1.5 rounded border border-[#30363d] hover:border-[#6e7681]"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-6 text-[13px] leading-[1.8] font-mono-code overflow-x-auto">
                <code style={{ color: "#e6edf3" }}>
                  {template.html
                    .split("\n")
                    .map((line, i) => (
                      <div key={i} className="flex">
                        <span className="select-none mr-6 text-right shrink-0 w-10 text-[#6e7681] text-xs leading-[1.8]">
                          {i + 1}
                        </span>
                        <span>{colorizeHtml(line)}</span>
                      </div>
                    ))}
                </code>
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function parseVariableDefinitions(raw: unknown): VariableDefinition[] {
  let value: unknown = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
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
    .filter((item): item is VariableDefinition => item !== null);
}

function buildVariableData(definitions: VariableDefinition[]): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const def of definitions) {
    data[def.key] = inferExampleValue(def);
  }
  return data;
}

function inferExampleValue(def: VariableDefinition): unknown {
  if (def.default_value !== undefined && def.default_value !== null && def.default_value !== "") {
    return def.default_value;
  }

  const key = def.key.toLowerCase();
  if (key === "line_items") {
    return [
      { description: "Service A", quantity: 2, unit_price: 120 },
      { description: "Service B", quantity: 1, unit_price: 80 },
    ];
  }
  if (key.includes("line_items_html")) {
    return "<tr><td>Service</td><td>2</td><td>$120</td><td>$240</td></tr>";
  }
  if (key.includes("email")) {
    return "billing@example.com";
  }
  if (key.includes("due_date")) {
    return "March 31, 2024";
  }
  if (key.includes("issue_date") || key.includes("date")) {
    return "March 1, 2024";
  }
  if (key.includes("invoice_number")) {
    return "INV-2024-0001";
  }
  if (key.includes("payment_terms")) {
    return "Net 30";
  }
  if (key.includes("currency")) {
    return "$";
  }
  if (key.includes("amount") || key.includes("total") || key.includes("subtotal") || key.includes("tax")) {
    return 0;
  }
  if (key.includes("address")) {
    return "123 Business Ave, City, ST 10001";
  }
  if (key.includes("name")) {
    return "Sample Name";
  }
  return "";
}

function colorizeHtml(line: string): React.ReactNode {
  return <span dangerouslySetInnerHTML={{ __html: escapeAndHighlight(line) }} />;
}

function escapeAndHighlight(line: string): string {
  const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return escaped
    .replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span style="color:#7ee787">$1</span>')
    .replace(/\b([a-zA-Z-]+)=/g, '<span style="color:#79c0ff">$1</span>=')
    .replace(/"([^"]*)"/g, '"<span style="color:#a5d6ff">$1</span>"')
    .replace(/([a-z-]+):/g, '<span style="color:#d2a8ff">$1</span>:')
    .replace(/&lt;!--(.*)--&gt;/g, '<span style="color:#8b949e">&lt;!--$1--&gt;</span>');
}

export default TemplateModal;
