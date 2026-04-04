import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { getSupabaseClientConfigError, supabase } from "@/lib/supabaseClient";
import { useSeo } from "@/lib/seo";

type Mode = "login" | "signup";

const AuthPage = () => {
  useSeo({
    title: "Login or Sign Up for InvoiceHub | Invoice Templates & PDF Generator",
    description:
      "Sign in to save invoice templates, manage billing, access API keys, and generate invoice layouts with AI.",
    path: "/auth",
    robots: "noindex,follow",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "InvoiceHub Login",
      description:
        "Sign in to save invoice templates, manage billing, access API keys, and generate invoice layouts with AI.",
    },
  });

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const configError = useMemo(() => getSupabaseClientConfigError(), []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!supabase) {
      setError(configError ?? "Supabase is not configured.");
      return;
    }

    if (mode === "signup" && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          throw signInError;
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });
        if (signUpError) {
          throw signUpError;
        }
        setMessage("Signup successful. Check your email to confirm your account.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden gradient-hero px-4 py-8 text-white md:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-5%] top-[18%] h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/15"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur-md md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              <Sparkles size={13} />
              InvoiceHub Access
            </div>
            <h1 className="mt-5 font-display text-4xl leading-tight text-white md:text-5xl">
              Sign in and manage your invoice workspace in one place.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/72">
              Save templates, manage billing, unlock AI tools, and keep your invoice flow organized without leaving the app.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Templates", value: "Save and reuse layouts" },
                { label: "Billing", value: "Manage account access" },
                { label: "AI Studio", value: "Generate faster drafts" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/55">{item.label}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-6 text-foreground shadow-card md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-gold shadow-gold">
                <FileText size={18} className="text-foreground" />
              </div>
              <div>
                <div className="text-xl font-bold leading-none">
                  PDF <span className="text-gold">Generator</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Sign in to manage templates, billing, and AI-generated layouts
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 rounded-2xl bg-secondary p-1.5">
              <button
                type="button"
                className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                  mode === "login"
                    ? "bg-navy text-white shadow-sm"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                  mode === "signup"
                    ? "bg-navy text-white shadow-sm"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setMode("signup")}
              >
                Signup
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Founder"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="instructor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={busy || Boolean(configError)}
                className="w-full rounded-2xl gradient-gold py-3.5 text-sm font-bold text-foreground shadow-gold transition-opacity hover:opacity-95 disabled:opacity-60"
              >
                {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-950">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="font-semibold">Every new account starts on Free Tier.</div>
                  <div className="mt-1 leading-6 text-emerald-900/75">
                    You get 100 invoices per month, all templates, and basic PDF generation immediately after signup.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Save invoice templates to your account",
                "Upgrade later with Stripe Checkout",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check size={12} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {configError && <p className="mt-4 text-xs text-red-700">{configError}</p>}
            {error && <p className="mt-4 text-xs text-red-700">{error}</p>}
            {message && <p className="mt-4 text-xs text-green-700">{message}</p>}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
