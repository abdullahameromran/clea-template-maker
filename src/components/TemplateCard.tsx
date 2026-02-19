import { useState } from "react";
import { InvoiceTemplate } from "@/data/invoiceTemplates";
import { Eye, Code, Copy, Check } from "lucide-react";
import TemplateModal from "./TemplateModal";

interface TemplateCardProps {
  template: InvoiceTemplate;
}

const categoryColors: Record<string, string> = {
  Minimal: "bg-slate-100 text-slate-600",
  Modern: "bg-indigo-100 text-indigo-700",
  Luxury: "bg-amber-100 text-amber-700",
  Creative: "bg-pink-100 text-pink-700",
  Corporate: "bg-blue-100 text-blue-700",
};

const TemplateCard = ({ template }: TemplateCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyHtml = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(template.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="group relative bg-card rounded-xl border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
        style={{ boxShadow: "var(--shadow-md)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xl)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
        }}
        onClick={() => setModalOpen(true)}
      >
        {/* Preview window */}
        <div className="relative h-48 bg-secondary overflow-hidden border-b border-border">
          {/* Browser chrome */}
          <div className="bg-muted h-7 flex items-center px-3 gap-1.5 border-b border-border shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div className="ml-2 flex-1 bg-background rounded h-3.5" />
          </div>
          <iframe
            srcDoc={template.html}
            title={template.name}
            className="w-full border-none"
            style={{
              height: "600px",
              transform: "scale(0.295)",
              transformOrigin: "top left",
              width: "338%",
              pointerEvents: "none",
            }}
            sandbox="allow-same-origin"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/70 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 mt-7">
            <button
              className="flex items-center gap-2 bg-card text-primary text-sm font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-secondary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              <Eye size={15} />
              Preview
            </button>
            <button
              className="flex items-center gap-2 bg-card text-primary text-sm font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-secondary transition-colors"
              onClick={handleCopyHtml}
            >
              {copied ? <Check size={15} className="text-green-600" /> : <Code size={15} />}
              {copied ? "Copied!" : "Copy HTML"}
            </button>
          </div>
        </div>

        {/* Card info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-foreground leading-tight">{template.name}</h3>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${categoryColors[template.category] ?? "bg-muted text-muted-foreground"}`}
            >
              {template.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{template.description}</p>
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Color accent bar */}
        <div
          className="h-1"
          style={{ background: template.primaryColor }}
        />
      </div>

      <TemplateModal
        template={template}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default TemplateCard;
