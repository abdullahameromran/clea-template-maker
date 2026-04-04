import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, Crown, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import PricingSection from "@/components/PricingSection";
import { getOrganizationJsonLd, useSeo } from "@/lib/seo";

interface PricingPageProps {
  user: User | null;
}

const PricingPage = ({ user }: PricingPageProps) => {
  useSeo({
    title: "Pricing Plans for Invoice PDF API & Templates | InvoiceHub",
    description:
      "Compare Free, Pro, Business, and Enterprise pricing for invoice templates, PDF generation, API access, usage limits, and automation workflows.",
    path: "/pricing",
    jsonLd: [
      getOrganizationJsonLd(),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "InvoiceHub Pricing",
        description:
          "Compare Free, Pro, Business, and Enterprise pricing for invoice templates, PDF generation, API access, usage limits, and automation workflows.",
      },
    ],
  });

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  };

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

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/15 transition-colors"
            >
              <ArrowLeft size={14} />
              Back Home
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-sm font-semibold px-4 py-2 rounded-lg gradient-gold text-foreground hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
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

      <section className="relative overflow-hidden gradient-hero px-6 py-16 text-white">
        <div className="absolute inset-0">
          <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-[-6%] bottom-[-12%] h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white/85">
            <Crown size={14} className="text-gold" />
            Public Pricing Link
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight">
            Link directly to plans,
            <br />
            pricing, and upgrade paths
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-white/72">
            This page has its own URL, so you can reference it directly from terms and conditions, onboarding emails, help docs, or sales pages.
          </p>
        </div>
      </section>

      <PricingSection user={user} fullPage />
    </div>
  );
};

export default PricingPage;
