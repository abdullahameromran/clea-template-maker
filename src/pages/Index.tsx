import heroBanner from "@/assets/hero-banner.jpg";
import { useState, useMemo } from "react";
import { invoiceTemplates } from "@/data/invoiceTemplates";
import TemplateCard from "@/components/TemplateCard";
import InvoiceEditor from "@/components/InvoiceEditor";
import { Search, FileText, Zap, Download } from "lucide-react";

const categories = ["All", "Minimal", "Modern", "Luxury", "Creative", "Corporate"];

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return invoiceTemplates.filter((t) => {
      const matchesSearch =
        search.trim() === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-navy sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <FileText size={16} className="text-foreground" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Dynamic <span className="text-gold">Invoice Engine</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#editor" className="hover:text-white transition-colors">Editor</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
          <a
            href="#templates"
            className="text-sm font-semibold px-4 py-2 rounded-lg gradient-gold text-foreground hover:opacity-90 transition-opacity"
          >
            Open JSON Templates
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden gradient-hero text-white py-24 px-6">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <Zap size={14} className="text-gold" />
            <span className="text-white/90">Install plugin + paste JSON + generate PDF</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
            Dynamic Invoice Engine
            <br />
            <span className="text-gold">JSON to PDF</span> in Seconds
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Just install the plugin, copy the JSON body template from this website, paste it into your request, and your invoice PDF is generated.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#templates"
              className="gradient-gold text-foreground font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold inline-flex items-center gap-2"
            >
              <FileText size={18} />
              Get JSON Template
            </a>
            <a
              href="#features"
              className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
              <Download size={18} />
              Generate PDF
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="bg-card border-b border-border py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: "??", title: "1. Install Plugin", desc: "Install Dynamic Invoice Engine in your automation flow" },
            { icon: "??", title: "2. Copy JSON Body", desc: "Use the JSON body template shown on this website" },
            { icon: "??", title: "3. Paste & Run", desc: "Paste the JSON body in your request and execute the node" },
            { icon: "??", title: "4. PDF Generated", desc: "Your final invoice PDF is generated automatically" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="text-2xl">{f.icon}</div>
              <div>
                <div className="font-bold text-foreground text-sm">{f.title}</div>
                <div className="text-muted-foreground text-sm mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-3">
              JSON Body Templates
            </h2>
            <p className="text-muted-foreground text-lg">
              Open any template, copy the JSON body, and use it with Dynamic Invoice Engine to generate a PDF
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search JSON templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-navy text-white"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Showing <strong className="text-foreground">{filtered.length}</strong> template{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-4xl mb-4">??</div>
              <p className="font-semibold text-foreground">No templates found</p>
              <p className="text-sm mt-1">Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>

      <InvoiceEditor />

      <footer className="bg-navy text-white/60 py-10 px-6 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md gradient-gold flex items-center justify-center">
            <FileText size={12} className="text-foreground" />
          </div>
          <span className="text-white font-bold">Dynamic Invoice Engine</span>
        </div>
        <p>Install the plugin, paste the JSON body template, and generate invoice PDFs.</p>
        <p className="mt-1">Simple setup. Fast output. Production-ready documents.</p>
      </footer>
    </div>
  );
};

export default Index;
