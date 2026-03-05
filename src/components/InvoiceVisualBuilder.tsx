import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

interface InvoiceVisualBuilderProps {
  open: boolean;
  initialHtml: string;
  onClose: () => void;
  onApply: (nextHtml: string) => void;
}

function extractBodyHtml(inputHtml: string): string {
  const bodyMatch = inputHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch?.[1]) {
    return bodyMatch[1];
  }
  return inputHtml;
}

function extractInlineCss(inputHtml: string): string {
  const cssChunks: string[] = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match = styleRegex.exec(inputHtml);
  while (match) {
    if (match[1]) {
      cssChunks.push(match[1]);
    }
    match = styleRegex.exec(inputHtml);
  }
  return cssChunks.join("\n\n");
}

function extractStylesheetLinks(inputHtml: string): string[] {
  const links: string[] = [];
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const hrefRegex = /href=["']([^"']+)["']/i;
  let match = linkRegex.exec(inputHtml);
  while (match) {
    const tag = match[0];
    const hrefMatch = tag.match(hrefRegex);
    if (hrefMatch?.[1]) {
      links.push(hrefMatch[1]);
    }
    match = linkRegex.exec(inputHtml);
  }
  return links;
}

const InvoiceVisualBuilder = ({ open, initialHtml, onClose, onApply }: InvoiceVisualBuilderProps) => {
  const editorRef = useRef<ReturnType<typeof grapesjs.init> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !containerRef.current) {
      return;
    }

    const bodyHtml = extractBodyHtml(initialHtml);
    const inlineCss = extractInlineCss(initialHtml);
    const stylesheetLinks = extractStylesheetLinks(initialHtml);

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "85vh",
      width: "100%",
      fromElement: false,
      storageManager: false,
      panels: { defaults: [] },
      blockManager: {
        appendTo: "#gjs-blocks",
      },
      layerManager: {
        appendTo: "#gjs-layers",
      },
      styleManager: {
        appendTo: "#gjs-styles",
      },
      traitManager: {
        appendTo: "#gjs-traits",
      },
      selectorManager: {
        appendTo: "#gjs-selectors",
      },
      canvas: {
        styles: [
          ...stylesheetLinks,
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        ],
      },
    });

    editor.BlockManager.add("section", {
      label: "Section",
      category: "Layout",
      content: `<section style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:14px;">New section</section>`,
    });
    editor.BlockManager.add("text", {
      label: "Text",
      category: "Basic",
      content: `<p style="font-size:14px;line-height:1.7;color:#334155;">Edit this text</p>`,
    });
    editor.BlockManager.add("heading", {
      label: "Heading",
      category: "Basic",
      content: `<h2 style="font-size:24px;font-weight:700;color:#0f172a;">Invoice Heading</h2>`,
    });
    editor.BlockManager.add("two-cols", {
      label: "2 Columns",
      category: "Layout",
      content:
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;"><div style="min-height:40px;border:1px dashed #cbd5e1;padding:8px;">Column 1</div><div style="min-height:40px;border:1px dashed #cbd5e1;padding:8px;">Column 2</div></div>',
    });
    editor.BlockManager.add("table", {
      label: "Invoice Table",
      category: "Invoice",
      content: `<table style="width:100%;border-collapse:collapse;margin-top:12px;">
        <thead><tr><th style="text-align:left;padding:8px;border-bottom:1px solid #e2e8f0;">Description</th><th style="text-align:right;padding:8px;border-bottom:1px solid #e2e8f0;">Qty</th><th style="text-align:right;padding:8px;border-bottom:1px solid #e2e8f0;">Rate</th><th style="text-align:right;padding:8px;border-bottom:1px solid #e2e8f0;">Amount</th></tr></thead>
        <tbody>{{line_items_html}}</tbody>
      </table>`,
    });
    editor.BlockManager.add("logo", {
      label: "Logo",
      category: "Invoice",
      content: `<div style="margin-bottom:14px;">
        <!-- Logo: replace {{logo_url}} with your image URL from preview data -->
        <img src="{{logo_url}}" alt="Logo" style="height:48px;max-width:180px;object-fit:contain;" />
      </div>`,
    });

    editor.setComponents(bodyHtml);
    if (inlineCss.trim()) {
      editor.setStyle(inlineCss);
    }
    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [open, initialHtml]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 p-4 md:p-6">
      <div className="h-full w-full bg-white rounded-xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm font-semibold">Visual Invoice Builder (Drag & Drop)</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const editor = editorRef.current;
                if (!editor) {
                  return;
                }
                const html = editor.getHtml();
                const css = editor.getCss();
                const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${css}</style></head><body>${html}</body></html>`;
                onApply(fullHtml);
              }}
              className="px-3 py-1.5 text-sm bg-navy text-white rounded-md"
            >
              Apply Changes
            </button>
          </div>
        </div>
        <div className="px-4 py-2 text-xs text-gray-600 border-b border-gray-200">
          Logo tip: Add the <strong>Logo</strong> block, then set `logo_url` in Preview Data Editor.
        </div>

        <div className="grid grid-cols-12 flex-1 min-h-0">
          <div className="col-span-2 border-r border-gray-200 overflow-auto">
            <div className="text-xs font-semibold px-3 py-2 border-b border-gray-200">Blocks</div>
            <div id="gjs-blocks" className="p-2" />
          </div>
          <div className="col-span-8 min-h-0">
            <div ref={containerRef} />
          </div>
          <div className="col-span-2 border-l border-gray-200 overflow-auto">
            <div className="text-xs font-semibold px-3 py-2 border-b border-gray-200">Styles</div>
            <div id="gjs-styles" className="p-2 border-b border-gray-200" />
            <div className="text-xs font-semibold px-3 py-2 border-b border-gray-200">Layers</div>
            <div id="gjs-layers" className="p-2 border-b border-gray-200" />
            <div className="text-xs font-semibold px-3 py-2 border-b border-gray-200">Traits</div>
            <div id="gjs-traits" className="p-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceVisualBuilder;
