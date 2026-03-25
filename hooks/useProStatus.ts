"use client";

import { useEffect, useState } from "react";
import { FREE_PLAN_LIMIT } from "@/lib/stripe";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [planCount, setPlanCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem("flexai_pro_session");
    if (sessionId) setIsPro(true);

    fetch("/api/workouts/count")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.count === "number") setPlanCount(data.count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const canCreatePlan = isPro || planCount === null || planCount < FREE_PLAN_LIMIT;
  const plansRemaining = isPro ? Infinity : Math.max(0, FREE_PLAN_LIMIT - (planCount ?? 0));

  return { isPro, planCount, canCreatePlan, plansRemaining, loading };
}
