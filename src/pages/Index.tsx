import heroBanner from "@/assets/hero-banner.jpg";
import { useState, useMemo, useEffect } from "react";
import { InvoiceTemplate, invoiceTemplates } from "@/data/invoiceTemplates";
import TemplateCard from "@/components/TemplateCard";
import InvoiceEditor from "@/components/InvoiceEditor";
import AITemplateStudio from "@/components/AITemplateStudio";
import PricingSection from "@/components/PricingSection";
import {
  Copy,
  Download,
  Edit,
  FileText,
  LayoutDashboard,
  Search,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { fetchInvoiceTemplateNameActivity, getSupabaseConfigError } from "@/lib/supabaseTemplates";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

const categories = ["All", "Minimal", "Modern", "Luxury", "Creative", "Corporate"];

type WorkspaceTab = "overview" | "templates" | "editor" | "billing" | "ai";

interface IndexProps {
  user: User | null;
}

const workspaceTabs: Array<{
  id: WorkspaceTab;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: "overview",
    label: "Overview",
    description: "Workspace summary",
    icon: LayoutDashboard,
  },
  {
    id: "templates",
    label: "Templates",
    description: "Browse and preview",
    icon: FileText,
  },
  {
    id: "editor",
    label: "Editor",
    description: "Build and customize",
    icon: Edit,
  },
  {
    id: "billing",
    label: "Billing",
    description: "Plans and API access",
    icon: Wallet,
  },
  {
    id: "ai",
    label: "AI Studio",
    description: "Generate with AI",
    icon: Sparkles,
  },
];

function LoggedInWorkspace({
  user,
  filtered,
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  userTemplates,
  setUserTemplates,
  handleSignOut,
}: {
  user: User;
  filtered: InvoiceTemplate[];
  search: string;
  setSearch: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  userTemplates: InvoiceTemplate[];
  setUserTemplates: (templates: InvoiceTemplate[]) => void;
  handleSignOut: () => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");

  const activeTabMeta = workspaceTabs.find((tab) => tab.id === activeTab) ?? workspaceTabs[0];

  const handleTabSelect = (tabId: WorkspaceTab) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-navy sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <FileText size={16} className="text-foreground" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              PDF<span className="text-gold">Generator</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-white/75">
            <Link to="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <span className="truncate max-w-[240px]">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="text-sm font-semibold px-4 py-2 rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/15 transition-colors"
            >
              Billing
            </Link>
            <button
              onClick={() => void handleSignOut()}
              className="text-sm font-semibold px-4 py-2 rounded-lg gradient-gold text-foreground hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:shrink-0 lg:w-[92px]">
            <div
              className="group/sidebar rounded-[28px] border border-border bg-card p-3 transition-[box-shadow,transform,width] duration-300 ease-out lg:fixed lg:top-[88px] lg:z-[9999999999999] lg:w-[84px] lg:hover:w-[272px]"
              style={{
                boxShadow: "var(--shadow-md)",
                left: "max(1rem, calc((100vw - 80rem) / 2 + 1.5rem))",
              }}
            >
              <div className="space-y-2">
                {workspaceTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={(event) => {
                        handleTabSelect(tab.id);
                        event.currentTarget.blur();
                      }}
                      title={tab.label}
                      className={`flex w-full items-center justify-center rounded-2xl border px-3 py-3 text-left transition-all duration-300 ease-out lg:group-hover/sidebar:justify-start ${
                        isActive
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isActive ? "bg-primary text-white" : "bg-secondary text-foreground"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="overflow-hidden transition-all duration-300 ease-out max-w-0 opacity-0 translate-x-2 lg:ml-0 lg:group-hover/sidebar:ml-3 lg:group-hover/sidebar:max-w-[150px] lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:translate-x-0">
                        <div className="font-semibold whitespace-nowrap">{tab.label}</div>
                        <div className="mt-1 text-xs whitespace-nowrap">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="overflow-hidden transition-all duration-300 ease-out mt-0 max-h-0 opacity-0 translate-y-2 lg:group-hover/sidebar:mt-4 lg:group-hover/sidebar:max-h-40 lg:group-hover/sidebar:opacity-100 lg:group-hover/sidebar:translate-y-0">
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Quick Stats</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-secondary px-3 py-3">
                      <div className="text-xs text-muted-foreground">Saved</div>
                      <div className="mt-1 text-lg font-semibold text-foreground">{userTemplates.length}</div>
                    </div>
                    <div className="rounded-xl bg-secondary px-3 py-3">
                      <div className="text-xs text-muted-foreground">Templates</div>
                      <div className="mt-1 text-lg font-semibold text-foreground">{filtered.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="rounded-[28px] border border-border bg-card p-5 md:p-6" style={{ boxShadow: "var(--shadow-md)" }}>
              <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{activeTabMeta.label}</div>
                  <h2 className="mt-2 font-display text-4xl font-bold text-foreground">
                    {activeTab === "overview" && "Everything in one organized workspace"}
                    {activeTab === "templates" && "Browse, filter, and preview templates"}
                    {activeTab === "editor" && "Customize invoice layouts visually"}
                    {activeTab === "billing" && "Plans, usage, and API access"}
                    {activeTab === "ai" && "Generate and refine templates with AI"}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {activeTab === "overview" && "Use the left sidebar to jump between templates, billing, editor tools, and AI generation without leaving the page."}
                    {activeTab === "templates" && "Search all available templates, mix saved and public layouts, and preview what you want to edit next."}
                    {activeTab === "editor" && "Open the editor tools when you want to tweak a design manually instead of generating a new one from scratch."}
                    {activeTab === "billing" && "Check plan details, open pricing, manage API access, and keep usage in one dedicated billing tab."}
                    {activeTab === "ai" && "Use your own Google AI key, generate drafts, and iterate on the same saved template with live preview."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleTabSelect("templates")}
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                  >
                    Open Templates
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabSelect("billing")}
                    className="rounded-xl gradient-gold px-4 py-2.5 text-sm font-semibold text-foreground shadow-gold hover:opacity-95"
                  >
                    Manage Plan
                  </button>
                </div>
              </div>

              {activeTab === "overview" && (
                <div className="space-y-8 pt-6">
                  <section className="grid gap-4 md:grid-cols-3">
                    {[
                      {
                        icon: <FileText size={20} className="text-primary" />,
                        title: "Template library",
                        copy: "Browse all public templates plus your saved drafts from one tab.",
                        action: () => handleTabSelect("templates"),
                      },
                      {
                        icon: <Wallet size={20} className="text-primary" />,
                        title: "Billing and API",
                        copy: "Check plans, API keys, usage, and upgrade options in one place.",
                        action: () => handleTabSelect("billing"),
                      },
                      {
                        icon: <Sparkles size={20} className="text-primary" />,
                        title: "AI generation",
                        copy: "Generate invoice templates with your own Google AI key and refine them live.",
                        action: () => handleTabSelect("ai"),
                      },
                    ].map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={item.action}
                        className="rounded-3xl border border-border bg-background p-5 text-left transition-colors hover:bg-secondary"
                      >
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                          {item.icon}
                        </div>
                        <div className="mt-4 text-xl font-bold text-foreground">{item.title}</div>
                        <div className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</div>
                      </button>
                    ))}
                  </section>

                  <section className="relative overflow-hidden rounded-[28px] gradient-hero px-6 py-8 text-white">
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: `url(${heroBanner})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="relative max-w-4xl">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm">
                        <Zap size={14} className="text-gold" />
                        <span className="text-white/90">Workspace Snapshot</span>
                      </div>
                      <h3 className="mt-5 font-display text-4xl font-bold leading-tight">
                        Keep design, billing, and AI generation inside one focused dashboard.
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                        This logged-in view is organized into tabs so the page feels lighter and faster to use. Switch from template browsing to billing or AI without losing context.
                      </p>
                    </div>
                  </section>

                  <section className="grid gap-4 md:grid-cols-4">
                    {[
                      { icon: <Zap size={22} className="text-primary" />, title: "Start on Free", desc: "100 invoices per month, templates, and API access." },
                      { icon: <Copy size={22} className="text-primary" />, title: "Keep It Branded", desc: "Free already supports custom branding. Upgrade when you need watermark removal and higher limits." },
                      { icon: <Edit size={22} className="text-primary" />, title: "Edit Faster", desc: "Jump into the editor or AI tab without extra navigation." },
                      { icon: <Download size={22} className="text-primary" />, title: "Ship PDFs", desc: "Generate invoices and test API calls from the billing area." },
                    ].map((item) => (
                      <div key={item.title} className="rounded-2xl border border-border bg-background p-5">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                          {item.icon}
                        </div>
                        <div className="mt-4 font-bold text-foreground">{item.title}</div>
                        <div className="mt-2 text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    ))}
                  </section>
                </div>
              )}

              {activeTab === "templates" && (
                <div className="pt-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
                              : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="mt-6 text-sm text-muted-foreground">
                    Showing <strong className="text-foreground">{filtered.length}</strong> template{filtered.length !== 1 ? "s" : ""}
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
              )}

              {activeTab === "editor" && (
                <div className="pt-6">
                  <InvoiceEditor />
                </div>
              )}

              {activeTab === "billing" && (
                <div className="pt-6">
                  <PricingSection user={user} />
                </div>
              )}

              {activeTab === "ai" && (
                <div className="pt-6">
                  <AITemplateStudio user={user} onTemplatesUpdated={setUserTemplates} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function GuestLanding({
  user,
  filtered,
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  handleSignOut,
}: {
  user: User | null;
  filtered: InvoiceTemplate[];
  search: string;
  setSearch: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  handleSignOut: () => Promise<void>;
}) {
  return (
    <div className="min-h-screen bg-background">
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
            <a href="#templates" className="hover:text-white transition-colors">
              Templates
            </a>
            <a href="#editor" className="hover:text-white transition-colors">
              Editor
            </a>
            <Link to="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <a href="#ai-studio" className="hover:text-white transition-colors">
              AI Studio
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden lg:inline text-xs text-white/75">{user.email}</span>
                <button
                  onClick={() => void handleSignOut()}
                  className="text-sm font-semibold px-4 py-2 rounded-lg gradient-gold text-foreground hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-semibold px-4 py-2 rounded-lg gradient-gold text-foreground hover:opacity-90 transition-opacity"
              >
                Login / Signup
              </Link>
            )}
          </div>
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
            <span className="text-white/90">Start Free, Upgrade When Volume Kicks In</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
            Beautiful Invoice
            <br />
            <span className="text-gold">Templates</span> with Built-In Billing Plans
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Browse templates, generate branded PDFs, and scale from 100 free invoices per month to enterprise-grade automation with API access and priority rendering.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#templates"
              className="gradient-gold text-foreground font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold inline-flex items-center gap-2"
            >
              <FileText size={18} />
              Browse Templates
            </a>
            <Link
              to="/pricing"
              className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
              <Download size={18} />
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="bg-card border-b border-border py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Zap size={22} className="text-primary" />, title: "1. Start on Free", desc: "Access every template with 100 invoices per month and basic PDF generation" },
            { icon: <Copy size={22} className="text-primary" />, title: "2. Keep Your Brand", desc: "Free supports logo and colors already. Upgrade to Pro to remove the watermark and raise limits" },
            { icon: <Edit size={22} className="text-primary" />, title: "3. Connect Workflows", desc: "Business unlocks API, automation, team seats, and invoice history" },
            { icon: <Download size={22} className="text-primary" />, title: "4. Scale Confidently", desc: "Enterprise gives you priority queue, SLA, white-label, and bulk generation" },
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

      <PricingSection user={user} />

      <section id="templates" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-3">All Invoice Templates</h2>
            <p className="text-muted-foreground text-lg">
              Click any template to preview it full-screen or view its HTML source code
            </p>
          </div>

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
              <div className="flex justify-center mb-4">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">No templates found</p>
              <p className="text-sm mt-1">Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>

      <InvoiceEditor />
      <section id="ai-studio" className="py-16 px-6 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-foreground mb-3">AI Template Studio</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Browse templates as guest. Login to generate with AI, save templates, and use drag & drop editor.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center rounded-xl gradient-gold text-foreground px-6 py-3 text-sm font-bold"
          >
            Login to Use AI Tools
          </Link>
        </div>
      </section>

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
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, dbActiveByName, userTemplates]);

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <LoggedInWorkspace
        user={user}
        filtered={filtered}
        search={search}
        setSearch={setSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        userTemplates={userTemplates}
        setUserTemplates={setUserTemplates}
        handleSignOut={handleSignOut}
      />
    );
  }

  return (
    <GuestLanding
      user={user}
      filtered={filtered}
      search={search}
      setSearch={setSearch}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      handleSignOut={handleSignOut}
    />
  );
};

export default Index;
