"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchWorkoutPlans } from "@/lib/workout";
import type { WorkoutPlanRecord } from "@/lib/types";
import {
  Wand2,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  CalendarDays,
  Dumbbell,
} from "lucide-react";

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<WorkoutPlanRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchWorkoutPlans();
        if (isMounted) setPlans(data);
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load workouts";
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-72px)] p-6 md:p-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-10 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Your Workouts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-tailored plans that learn you—volume, intensity, and movements.
            </p>
          </div>

          <Link href="/workouts/new">
            <GenerateAIButton />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && plans.length === 0 && <EmptyState />}

        {/* List */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <WorkoutCard key={p.id} plan={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===========================
   Components
   =========================== */

function GenerateAIButton() {
  return (
    <Button
      size="lg"
      className="group relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
    >
      {/* shine */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-100" />
      <Sparkles className="mr-2 h-5 w-5 animate-[float_2.4s_ease-in-out_infinite]" />
      Generate with AI
      <Wand2 className="ml-2 h-5 w-5" />
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
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
      className="group relative block rounded-2xl border border-transparent bg-white p-[1px] shadow-sm transition-all hover:shadow-xl"
    >
      {/* gradient border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-emerald-500/30 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative rounded-[14px] border border-gray-200 bg-white p-5">
        {/* Top row: avatar + goal badge + verified AI */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/80 to-purple-600/80 text-sm font-bold text-white shadow-sm">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                {plan.username}
              </p>
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600">
                <Dumbbell className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {plan.workout_goal ?? "Personalized plan"}
                </span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            AI Generated
          </span>
        </div>

        {/* Date */}
        {created && (
          <div className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {created}
          </div>
        )}

        {/* Intro */}
        <p className="mb-4 line-clamp-3 whitespace-pre-wrap text-sm text-gray-700">
          {plan.intro_text ??
            "Your plan adapts based on your sessions—volume, intensity, and movement selection."}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <div className="text-sm text-gray-600">
            {Array.isArray(plan.exercises) && (
              <span>💪 {plan.exercises.length} exercises</span>
            )}
          </div>
          <span className="inline-flex items-center text-sm font-medium text-indigo-600">
            View{" "}
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
        <Wand2 className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-bold">No Workouts Yet</h2>
      <p className="mt-2 text-muted-foreground">
        Generate your first AI-tailored plan and we’ll adapt it as you progress.
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>
      <div className="mb-2 h-3 w-32 rounded bg-gray-200" />
      <div className="mb-2 h-12 w-full rounded bg-gray-200" />
      <div className="mt-4 h-4 w-1/2 rounded bg-gray-200" />
    </div>
  );
}
