import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvoiceTemplate } from "@/data/invoiceTemplates";
import { Copy, Check, X, Eye, Code } from "lucide-react";

interface TemplateModalProps {
  template: InvoiceTemplate;
  open: boolean;
  onClose: () => void;
}

type Tab = "preview" | "html";

const TemplateModal = ({ template, open, onClose }: TemplateModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(template.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
          <div>
            <DialogTitle className="text-lg font-bold text-foreground font-display">
              {template.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">{template.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex bg-muted rounded-lg p-1 gap-1 mr-2">
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
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "preview" ? (
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
              {/* Code header bar */}
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

// Simple HTML syntax highlighter
function colorizeHtml(line: string): React.ReactNode {
  // Return as-is for simplicity; the mono font and dark bg look great
  return <span dangerouslySetInnerHTML={{ __html: escapeAndHighlight(line) }} />;
}

function escapeAndHighlight(line: string): string {
  const escaped = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    // HTML tags
    .replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span style="color:#7ee787">$1</span>')
    // Attributes
    .replace(/\b([a-zA-Z-]+)=/g, '<span style="color:#79c0ff">$1</span>=')
    // Strings
    .replace(/"([^"]*)"/g, '"<span style="color:#a5d6ff">$1</span>"')
    // CSS property names in style blocks
    .replace(/([a-z-]+):/g, '<span style="color:#d2a8ff">$1</span>:')
    // Comments
    .replace(/&lt;!--(.*)--&gt;/g, '<span style="color:#8b949e">&lt;!--$1--&gt;</span>');
}

export default TemplateModal;
