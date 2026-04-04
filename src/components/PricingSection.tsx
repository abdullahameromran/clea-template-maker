import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Check,
  Crown,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ApiAccessPanel from "@/components/ApiAccessPanel";
import { pricingPlans, pricingPlansByCode, type PricingPlan } from "@/data/pricingPlans";
import {
  fetchCurrentUserPlan,
  fetchCurrentUserUsage,
  type CurrentPlanSnapshot,
  type UserUsageSnapshot,
} from "@/lib/supabaseBilling";
import {
  createStripeCheckoutSession,
  createStripePortalSession,
} from "@/lib/stripeBillingClient";

interface PricingSectionProps {
  user: User | null;
  fullPage?: boolean;
}

function formatPeriodEnd(date: string | null): string {
  if (!date) {
    return "No renewal date yet";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "No renewal date yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function renderStaticLink(plan: PricingPlan, isLoggedIn: boolean) {
  if (plan.ctaHref.startsWith("/")) {
    return (
      <Link
        to={plan.ctaHref}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        {isLoggedIn ? "Manage Account" : plan.ctaLabel}
        <ArrowRight size={15} />
      </Link>
    );
  }

  return (
    <a
      href={plan.ctaHref}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
        plan.popular
          ? "gradient-gold text-foreground shadow-gold hover:opacity-95"
          : "border border-border bg-card text-foreground hover:bg-secondary"
      }`}
    >
      {plan.ctaLabel}
      <ArrowRight size={15} />
    </a>
  );
}

const PricingSection = ({ user, fullPage = false }: PricingSectionProps) => {
  const [currentPlan, setCurrentPlan] = useState<CurrentPlanSnapshot | null>(null);
  const [usage, setUsage] = useState<UserUsageSnapshot | null>(null);
  const [busyAction, setBusyAction] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setCurrentPlan(null);
      setUsage(null);
      return;
    }

    let mounted = true;

    Promise.all([fetchCurrentUserPlan(user.id), fetchCurrentUserUsage(user.id)])
      .then(([planSnapshot, usageSnapshot]) => {
        if (!mounted) {
          return;
        }
        setCurrentPlan(planSnapshot);
        setUsage(usageSnapshot);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setCurrentPlan({
          code: "free",
          name: pricingPlansByCode.free.name,
          status: "free",
          billingCycle: "monthly",
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          monthlyLabel: pricingPlansByCode.free.monthlyLabel,
        });
        setUsage(null);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const effectivePlan = useMemo(
    () =>
      currentPlan ?? {
        code: "free" as const,
        name: pricingPlansByCode.free.name,
        status: "free" as const,
        billingCycle: "monthly",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        monthlyLabel: pricingPlansByCode.free.monthlyLabel,
      },
    [currentPlan]
  );

  const invoiceCap = pricingPlansByCode[effectivePlan.code].invoicesPerMonth;
  const usageLabel =
    invoiceCap == null
      ? "Unlimited monthly invoices"
      : `${usage?.invoicesGenerated ?? 0} / ${invoiceCap.toLocaleString()} invoices this month`;

  const requestRate =
    pricingPlansByCode[effectivePlan.code].requestsPerSecond == null
      ? "Unlimited throughput"
      : `${pricingPlansByCode[effectivePlan.code].requestsPerSecond} req/sec`;
  const checkoutSuccessPath = fullPage ? "/pricing?checkout=success#plan-comparison" : "/pricing?checkout=success";
  const checkoutCancelPath = fullPage ? "/pricing?checkout=cancelled#plan-comparison" : "/pricing?checkout=cancelled";
  const portalReturnPath = fullPage ? "/pricing#plan-comparison" : "/pricing";

  const handleCheckout = async (planCode: "pro" | "business") => {
    if (!user) {
      window.location.assign("/auth");
      return;
    }

    setBusyAction(planCode);
    try {
      const checkoutUrl = await createStripeCheckoutSession({
        planCode,
        billingCycle: "monthly",
        successPath: checkoutSuccessPath,
        cancelPath: checkoutCancelPath,
      });
      window.location.assign(checkoutUrl);
    } catch (error: unknown) {
      toast({
        title: "Checkout unavailable",
        description: error instanceof Error ? error.message : "Could not start Stripe Checkout.",
        variant: "destructive",
      });
    } finally {
      setBusyAction("");
    }
  };

  const handleManageBilling = async () => {
    setBusyAction("portal");
    try {
      const portalUrl = await createStripePortalSession(portalReturnPath);
      window.location.assign(portalUrl);
    } catch (error: unknown) {
      toast({
        title: "Billing portal unavailable",
        description: error instanceof Error ? error.message : "Could not open the Stripe billing portal.",
        variant: "destructive",
      });
    } finally {
      setBusyAction("");
    }
  };

  const renderPlanAction = (plan: PricingPlan, isCurrentPlan: boolean) => {
    if (isCurrentPlan && plan.code !== "free") {
      return (
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center justify-center rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white">
            Current Plan
          </div>
          <button
            type="button"
            onClick={handleManageBilling}
            disabled={busyAction === "portal"}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {busyAction === "portal" ? "Opening..." : "Manage Billing"}
            <ArrowRight size={15} />
          </button>
        </div>
      );
    }

    if (isCurrentPlan) {
      return (
        <div className="inline-flex items-center justify-center rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white">
          Current Plan
        </div>
      );
    }

    if (plan.code === "pro" || plan.code === "business") {
      const isBusy = busyAction === plan.code;
      return (
        <button
          type="button"
          onClick={() => handleCheckout(plan.code)}
          disabled={isBusy}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-60 ${
            plan.popular
              ? "gradient-gold text-foreground shadow-gold hover:opacity-95"
              : "border border-border bg-card text-foreground hover:bg-secondary"
          }`}
        >
          {isBusy ? "Redirecting..." : plan.ctaLabel}
          <ArrowRight size={15} />
        </button>
      );
    }

    return renderStaticLink(plan, Boolean(user));
  };

  const plansGrid = (
    <div
      id={fullPage ? "plan-comparison" : undefined}
      className={`grid gap-6 ${fullPage ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 xl:grid-cols-4"}`}
    >
      {pricingPlans.map((plan) => {
        const isCurrentPlan = user ? effectivePlan.code === plan.code : false;

        return (
          <article
            key={plan.code}
            className={`relative overflow-hidden rounded-3xl border bg-card ${plan.borderClass} ${
              !fullPage && plan.popular ? "xl:-translate-y-3" : ""
            }`}
            style={{ boxShadow: plan.popular ? "var(--shadow-xl)" : "var(--shadow-md)" }}
          >
            <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${plan.accentClass}`} />
            <div className="relative p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                    {plan.badge}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.summary}</p>
                </div>
                {plan.popular && (
                  <div className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                )}
              </div>

              <div className="mt-6 text-4xl font-bold text-foreground">{plan.monthlyLabel}</div>
              <div className="mt-2 text-sm text-muted-foreground">{plan.audience}</div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-secondary/70 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Invoices</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {plan.invoicesPerMonth == null ? "Unlimited" : plan.invoicesPerMonth.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-2xl bg-secondary/70 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Requests</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {plan.requestsPerSecond == null ? "Unlimited" : `${plan.requestsPerSecond}/sec`}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {plan.included.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <div className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={13} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
                {plan.excluded.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <X size={13} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">{renderPlanAction(plan, isCurrentPlan)}</div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section id="pricing" className="relative overflow-hidden py-20 px-6 bg-card border-y border-border">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <Crown size={14} className="text-primary" />
            <span className="text-foreground/80">Plans & Pricing</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {fullPage ? (
              <>
                Pricing Built for Growth,
                <br />
                from First Invoice to Enterprise Scale
              </>
            ) : (
              <>
                Simple Billing on the Page,
                <br />
                Full Plans on a Dedicated Link
              </>
            )}
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            {fullPage
              ? "Share this page directly from your terms, legal docs, or onboarding flow whenever someone needs the full plan comparison."
              : "Keep the homepage clean, check your current usage here, and open the full pricing page only when you want to compare plans or upgrade."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Sparkles size={18} className="text-primary" />, title: "Free onboarding", value: "100 invoices/mo", copy: "Easy adoption with zero-friction signup." },
            { icon: <Gauge size={18} className="text-primary" />, title: "Paid throughput", value: "Up to 10 req/sec", copy: "Fast enough for agencies, SaaS, and workflows." },
            { icon: <Layers3 size={18} className="text-primary" />, title: "Automation ready", value: "Zapier, n8n, Bubble", copy: "Business and Enterprise unlock the heavy-duty flows." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-background/80 p-5 backdrop-blur-sm"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                {item.icon}
              </div>
              <div className="text-sm text-muted-foreground">{item.title}</div>
              <div className="text-2xl font-bold text-foreground mt-1">{item.value}</div>
              <div className="text-sm text-muted-foreground mt-2">{item.copy}</div>
            </div>
          ))}
        </div>

        <div
          className="mb-8 rounded-3xl border border-border bg-gradient-to-r from-[hsl(220_70%_20%)] via-[hsl(220_60%_24%)] to-[hsl(230_60%_30%)] p-6 text-white"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                <ShieldCheck size={14} />
                {user ? "Current Plan" : "Billing Overview"}
              </div>
              <div className="mt-3 text-3xl font-bold">
                {user ? effectivePlan.name : "Start Free"}
                <span className="ml-3 text-base font-medium text-white/70">
                  {user ? effectivePlan.monthlyLabel : pricingPlansByCode.free.monthlyLabel}
                </span>
              </div>
              <div className="mt-2 text-sm text-white/75">
                {user
                  ? `Status: ${effectivePlan.status.replace("_", " ")}${
                      effectivePlan.cancelAtPeriodEnd ? " | Cancels at period end" : ""
                    } | Renewal: ${formatPeriodEnd(effectivePlan.currentPeriodEnd)}`
                  : "Free includes templates, API access, and basic PDF generation to get users started quickly."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 lg:min-w-[360px]">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">Usage</div>
                <div className="mt-2 text-lg font-semibold">{usageLabel}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">Throughput</div>
                <div className="mt-2 text-lg font-semibold">{requestRate}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-gold px-5 py-3 text-sm font-semibold text-foreground shadow-gold transition-opacity hover:opacity-95"
            >
              {user && effectivePlan.code !== "enterprise" ? "Upgrade Plan" : "View Plans"}
              <ArrowRight size={15} />
            </Link>
            {user && effectivePlan.code !== "free" && (
              <button
                type="button"
                onClick={handleManageBilling}
                disabled={busyAction === "portal"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15 disabled:opacity-60"
              >
                {busyAction === "portal" ? "Opening..." : "Manage Billing"}
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {fullPage && plansGrid}

        <ApiAccessPanel user={user} currentPlan={effectivePlan} />
      </div>
    </section>
  );
};

export default PricingSection;
