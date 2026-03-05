import heroBanner from "@/assets/hero-banner.jpg";
import { useState, useMemo, useEffect } from "react";
import { InvoiceTemplate, invoiceTemplates } from "@/data/invoiceTemplates";
import TemplateCard from "@/components/TemplateCard";
import InvoiceEditor from "@/components/InvoiceEditor";
import AITemplateStudio from "@/components/AITemplateStudio";
import { Search, FileText, Zap, Download, Edit, Copy } from "lucide-react";
import { fetchInvoiceTemplateNameActivity, getSupabaseConfigError } from "@/lib/supabaseTemplates";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

const categories = ["All", "Minimal", "Modern", "Luxury", "Creative", "Corporate"];

// Invoice template gallery page
interface IndexProps {
  user: User;
}

const Index = ({ user }: IndexProps) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [dbActiveByName, setDbActiveByName] = useState<Record<string, boolean>>({});
  const [userTemplates, setUserTemplates] = useState<InvoiceTemplate[]>([]);

  useEffect(() => {
    const configError = getSupabaseConfigError();
    if (configError) {
      return;
    }

    let isMounted = true;
    fetchInvoiceTemplateNameActivity()
      .then((map) => {
        if (!isMounted) {
          return;
        }
        setDbActiveByName(map);
      })
      .catch(() => {
        // Fallback to local templates if Supabase activity lookup fails.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const templates = [...userTemplates, ...invoiceTemplates];
    return templates.filter((t) => {
      const dbActive = dbActiveByName[t.name.trim().toLowerCase()];
      if (dbActive === false) {
        return false;
      }

      const matchesSearch =
        search.trim() === "" ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, dbActiveByName, userTemplates]);

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-navy sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <FileText size={16} className="text-foreground" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              PDF<span className="text-gold">Generator</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#editor" className="hover:text-white transition-colors">Editor</a>
            <a href="#ai-studio" className="hover:text-white transition-colors">AI Studio</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-xs text-white/75">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm font-semibold px-4 py-2 rounded-lg gradient-gold text-foreground hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
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
            <span className="text-white/90">20+ Professional Templates - 100% Free</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
            Beautiful Invoice
            <br />
            <span className="text-gold">Templates</span> Ready to Use
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Browse, preview, and copy complete HTML invoice templates. Each one is production-ready and fully customizable for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#templates"
              className="gradient-gold text-foreground font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold inline-flex items-center gap-2"
            >
              <FileText size={18} />
              Browse Templates
            </a>
            <a
              href="#features"
              className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
              <Download size={18} />
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section id="features" className="bg-card border-b border-border py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Zap size={22} className="text-primary" />, title: "1. Install Plugin", desc: "Install Dynamic Invoice Engine in your automation flow" },
            { icon: <Copy size={22} className="text-primary" />, title: "2. Copy JSON Body", desc: "Use the JSON body template shown on this website" },
            { icon: <Edit size={22} className="text-primary" />, title: "3. Paste & Run", desc: "Paste the JSON body in your request and execute the node" },
            { icon: <Download size={22} className="text-primary" />, title: "4. PDF Generated", desc: "Your final invoice PDF is generated automatically" },
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

      {/* Templates section */}
      <section id="templates" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-3">
              All Invoice Templates
            </h2>
            <p className="text-muted-foreground text-lg">
              Click any template to preview it full-screen or view its HTML source code
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
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

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing <strong className="text-foreground">{filtered.length}</strong> template{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <div className="flex justify-center mb-4">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">No templates found</p>
              <p className="text-sm mt-1">Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>

      {/* Invoice Editor */}
      <InvoiceEditor />
      <AITemplateStudio user={user} onTemplatesUpdated={setUserTemplates} />

      {/* Footer */}
      <footer className="bg-navy text-white/60 py-10 px-6 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md gradient-gold flex items-center justify-center">
            <FileText size={12} className="text-foreground" />
          </div>
          <span className="text-white font-bold">PDF Generator</span>
        </div>
        <p>Free professional invoice templates for businesses of all sizes.</p>
        <p className="mt-1">Copy, customize, and use without restrictions.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-white/80">
          <a
            href="https://linkedin.com/in/abdullah-amer-584237224/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://wa.me/201554670453"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
