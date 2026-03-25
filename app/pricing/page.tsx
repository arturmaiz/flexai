"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { FREE_PLAN_LIMIT } from "@/lib/stripe";
import { Suspense } from "react";

const PRO_FEATURES = [
  "Unlimited AI-generated practice plans",
  "Advanced personalization (injuries, fitness level)",
  "YouTube video guides for every movement",
  "Save & revisit all your plans",
  "Priority AI generation speed",
  "Cancel anytime",
];

const FREE_FEATURES = [
  `Up to ${FREE_PLAN_LIMIT} practice plans`,
  "AI-generated Pilates & Yoga plans",
  "YouTube video guides",
  "Basic personalization",
];

function PricingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const success = searchParams.get("success") === "1";
  const canceled = searchParams.get("canceled") === "1";
  const sessionId = searchParams.get("session_id");

  // After successful checkout, verify and persist pro status
  useEffect(() => {
    const storedSessionId = localStorage.getItem("flexai_pro_session");
    if (storedSessionId) setIsPro(true);

    if (success && sessionId) {
      fetch(`/api/stripe/pro-status?session_id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.pro) {
            localStorage.setItem("flexai_pro_session", sessionId);
            setIsPro(true);
          }
        })
        .catch(() => {});
    }
  }, [success, sessionId]);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background px-4 py-16">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you're ready to go unlimited.
          </p>
        </div>

        {/* Success / canceled banners */}
        {success && isPro && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950/30">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">You're now Pro!</p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Unlimited practices unlocked. Start generating now.
              </p>
            </div>
            <Link href="/workouts/new" className="ml-auto">
              <Button size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Generate
              </Button>
            </Link>
          </div>
        )}
        {canceled && (
          <div className="mb-8 rounded-2xl border border-border/60 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            Payment canceled — you can upgrade anytime.
          </div>
        )}

        {/* Plans grid */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Free plan */}
          <div className="flex flex-col rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Free</p>
              <p className="mt-2 text-4xl font-bold">$0</p>
              <p className="mt-1 text-sm text-muted-foreground">Forever free</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/workouts/new">
              <Button variant="outline" className="w-full rounded-xl" size="lg">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-card p-7 shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow">
                MOST POPULAR
              </span>
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Pro</p>
              <div className="mt-2 flex items-baseline gap-1">
                <p className="text-4xl font-bold">$9.99</p>
                <p className="text-muted-foreground">/month</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Billed monthly, cancel anytime</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            {isPro ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-sm font-semibold text-primary">
                <CheckCircle2 className="h-4 w-4" /> You're on Pro
              </div>
            ) : (
              <Button
                className="w-full gap-2 rounded-xl"
                size="lg"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Redirecting…
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" /> Upgrade to Pro
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Trust / FAQ */}
        <div className="mt-14 grid gap-6 text-center md:grid-cols-3">
          {[
            { icon: "🔒", title: "Secure payments", desc: "Powered by Stripe. Your card details are never stored on our servers." },
            { icon: "🌍", title: "Works in Israel", desc: "Pay in USD with any international credit card, including Israeli cards." },
            { icon: "↩️", title: "Cancel anytime", desc: "No long-term commitment. Cancel your subscription in one click." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border/50 bg-muted/20 p-6">
              <div className="mb-2 text-2xl">{icon}</div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}
