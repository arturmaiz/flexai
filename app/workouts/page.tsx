"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { WorkoutPlanRecord } from "@/lib/types";
import { getSupabase } from "@/lib/supabase";
import { WORKOUT_PLANS_TABLE } from "@/lib/constants";
import {
  Wand2,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  CalendarDays,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<WorkoutPlanRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const supabase = getSupabase();
        const { data, error: sbError } = await supabase
          .from(WORKOUT_PLANS_TABLE)
          .select("*")
          .order("created_at", { ascending: false });
        if (sbError) throw new Error(sbError.message);
        if (isMounted) setPlans((data as WorkoutPlanRecord[]) ?? []);
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load practices";
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  return (
    <div className="min-h-[calc(100vh-72px)] px-4 py-10 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              My Practices
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-crafted Pilates &amp; Yoga plans, adapted as you grow.
            </p>
          </div>
          <Link href="/workouts/new">
            <GenerateAIButton />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Could not load practices</p>
              <p className="mt-0.5 text-sm text-destructive/70">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setRetryKey((k) => k + 1)}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && plans.length === 0 && <EmptyState />}

        {/* List */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <WorkoutCard key={p.id} plan={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GenerateAIButton() {
  return (
    <Button
      size="lg"
      className="group relative gap-2 overflow-hidden rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 hover:shadow-lg"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
      <Sparkles className="h-4 w-4" />
      Generate with AI
      <Wand2 className="h-4 w-4" />
    </Button>
  );
}

function WorkoutCard({ plan }: { plan: WorkoutPlanRecord }) {
  const created = useMemo(
    () =>
      plan.created_at
        ? new Date(plan.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
    [plan.created_at]
  );

  const initials =
    (plan.username?.[0] ?? "U").toUpperCase() +
    (plan.username?.split(" ")?.[1]?.[0]?.toUpperCase() ?? "");

  return (
    <Link
      href={`/workouts/${plan.id}`}
      className="group relative block rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      {/* subtle gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Top row */}
      <div className="relative mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-sm font-bold text-primary-foreground shadow-sm">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{plan.username}</p>
            <p className="mt-0.5 text-xs text-primary/80 font-medium">
              {plan.workout_goal ?? "Personalized plan"}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-secondary-foreground/20 bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          <BadgeCheck className="h-3.5 w-3.5" />
          AI Plan
        </span>
      </div>

      {/* Date */}
      {created && (
        <div className="relative mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {created}
        </div>
      )}

      {/* Intro */}
      <p className="relative mb-4 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
        {plan.intro_text ?? "Your plan adapts based on your sessions — volume, intensity, and movement selection."}
      </p>

      {/* Footer */}
      <div className="relative mt-auto flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-sm text-muted-foreground">
          {Array.isArray(plan.exercises) && `🧘 ${plan.exercises.length} movements`}
        </span>
        <span className="inline-flex items-center text-sm font-medium text-primary">
          View <ChevronRight className="ml-0.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-border/60 bg-card p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-3xl">
        🧘
      </div>
      <h2 className="text-2xl font-bold">No Practices Yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Generate your first AI Pilates or Yoga plan and we&apos;ll adapt it as you progress.
      </p>
      <div className="mt-6">
        <Link href="/workouts/new">
          <GenerateAIButton />
        </Link>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-muted" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-2.5 w-16 rounded bg-muted" />
        </div>
      </div>
      <div className="mb-2 h-2.5 w-20 rounded bg-muted" />
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
        <div className="h-3 w-4/6 rounded bg-muted" />
      </div>
      <div className="mt-4 h-px w-full bg-muted" />
      <div className="mt-3 h-3 w-1/3 rounded bg-muted" />
    </div>
  );
}
