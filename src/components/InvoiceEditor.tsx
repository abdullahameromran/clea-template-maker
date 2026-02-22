import { useState, useMemo } from "react";
import { invoiceTemplates } from "@/data/invoiceTemplates";
import { Download, Copy, Check, FileText, ChevronDown, Eye } from "lucide-react";

interface InvoiceVars {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
}

const defaultVars: InvoiceVars = {
  companyName: "",
  companyAddress: "",
  companyEmail: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",
};

const InvoiceEditor = () => {
  const [vars, setVars] = useState<InvoiceVars>(defaultVars);
  const [selectedTemplateId, setSelectedTemplateId] = useState(invoiceTemplates[0].id);
  const [copied, setCopied] = useState(false);
  const hasPassAccess = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("pass") === "password";
  }, []);

  const selectedTemplate = invoiceTemplates.find((t) => t.id === selectedTemplateId)!;

  const processedHtml = useMemo(() => {
    let html = selectedTemplate.html;

    // Replace common company/from patterns
    if (vars.companyName) {
      // Replace company names in the template (first "From" section company name)
      html = html.replace(
        /(<div class="(?:brand|company-name|firm-name|brand-name|brand-stamp|sidebar-logo|pn|party-name|pname|name|bname|cname)"[^>]*>)([^<]+)(<\/div>)/,
        `$1${vars.companyName}$3`
      );
    }

    if (vars.clientName) {
      // Find client/bill-to name and replace
      const billToRegex = /Bill(?:ed)?\s*To[\s\S]*?(<div class="(?:pn|party-name|pname|client-name|bill-name|bb-name|addr-name|ci-name)"[^>]*>)([^<]+)(<\/div>)/i;
      html = html.replace(billToRegex, (match, p1, p2, p3) => match.replace(p2, vars.clientName));
    }

    if (vars.invoiceNumber) {
      // Replace invoice numbers
      html = html.replace(/(#[A-Z]{2,5}-\d{4}-\d{2,5})/i, vars.invoiceNumber);
    }

    if (vars.invoiceDate) {
      // Replace common date patterns near "Issue" or "Date Issued"
      html = html.replace(
        /((?:Issue[d]?|Invoice)\s*(?:Date)?[\s\S]*?<div class="(?:mv|value|dv|hgv|mc-value|di-value|sbv|eiv|siv|dc-value|ib-value|ig-value|pgv|ccv|dgv|ebv)"[^>]*>)([^<]+)(<\/div>)/i,
        `$1${vars.invoiceDate}$3`
      );
    }

    if (vars.dueDate) {
      html = html.replace(
        /((?:Due|Payment Due)[\s\S]*?<div class="(?:mv|value|dv|hgv|mc-value|di-value|sbv|dc-value|ib-value|ig-value|pgv|ccv)"[^>]*>)([^<]+)(<\/div>)/i,
        `$1${vars.dueDate}$3`
      );
    }

    if (vars.companyEmail) {
      html = html.replace(/[\w.-]+@[\w.-]+\.\w{2,}/i, vars.companyEmail);
    }

    return html;
  }, [selectedTemplate, vars]);

  const handleCopy = () => {
    if (!hasPassAccess) {
      return;
    }
    navigator.clipboard.writeText(processedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!hasPassAccess) {
      return;
    }
    const blob = new Blob([processedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${selectedTemplate.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!hasPassAccess) {
      return;
    }
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(processedHtml);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const hasAnyVar = Object.values(vars).some((v) => v.trim() !== "");

  const updateVar = (key: keyof InvoiceVars, value: string) => {
    setVars((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section id="editor" className="py-16 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <FileText size={14} className="text-gold" />
            <span className="text-foreground/80">Customize & Download</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-3">
            Fill Your Invoice Details
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select a template, fill in your business details below, and download or print your customized invoice
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-card rounded-2xl border border-border p-6" style={{ boxShadow: "var(--shadow-md)" }}>
            {/* Template selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">Choose Template</label>
              <div className="relative">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-10"
                >
                  {invoiceTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.category}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-5">
              {/* Company Info */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Your Company</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={vars.companyName}
                    onChange={(e) => updateVar("companyName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={vars.companyAddress}
                    onChange={(e) => updateVar("companyAddress", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={vars.companyEmail}
                    onChange={(e) => updateVar("companyEmail", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Client Details</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={vars.clientName}
                    onChange={(e) => updateVar("clientName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Client Address"
                    value={vars.clientAddress}
                    onChange={(e) => updateVar("clientAddress", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Client Email"
                    value={vars.clientEmail}
                    onChange={(e) => updateVar("clientEmail", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Invoice Info</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Invoice Number (e.g. #INV-2024-001)"
                    value={vars.invoiceNumber}
                    onChange={(e) => updateVar("invoiceNumber", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Invoice Date"
                      value={vars.invoiceDate}
                      onChange={(e) => updateVar("invoiceDate", e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Due Date"
                      value={vars.dueDate}
                      onChange={(e) => updateVar("dueDate", e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
              {hasPassAccess && (
                <>
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl gradient-gold text-foreground hover:opacity-90 transition-opacity"
                  >
                    <Download size={16} />
                    Download HTML
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <FileText size={16} />
                    Download PDF
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border border-border bg-card text-foreground hover:bg-secondary transition-colors"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </>
              )}
            </div>

            {hasAnyVar && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                ✅ Your details will be applied to the template
              </p>
            )}
          </div>

          {/* Right: Preview */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
            <div className="bg-muted px-6 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-muted-foreground">Live Preview — {selectedTemplate.name}</span>
              </div>
              <Eye size={14} className="text-muted-foreground" />
            </div>
            <div className="bg-secondary/50 p-4 overflow-auto" style={{ height: "680px" }}>
              <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
                <iframe
                  srcDoc={processedHtml}
                  title="Invoice Preview"
                  className="w-full border-none"
                  style={{ height: "900px" }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceEditor;
