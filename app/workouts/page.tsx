"use client";

import { useEffect, useState } from "react";
import { fetchWorkoutPlans } from "@/lib/workout";
import type { WorkoutPlanRecord } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WorkoutsPage() {
  const [plans, setPlans] = useState<WorkoutPlanRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchWorkoutPlans();
        if (isMounted) {
          setPlans(data);
        }
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-7xl">
        <div className="flex justify-end gap-3 mb-6">
          <Link href="/">
            <Button variant="outline" className="font-semibold">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Button>
          </Link>
          <Link href="/workouts">
            <Button variant="outline" className="font-semibold">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              My Workouts
            </Button>
          </Link>
        </div>

        <div className="m-8">
          <h1 className="text-3xl font-bold mb-4">Your Workouts</h1>
          <Link href="/workouts/new">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Generate New Workout
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Loading workouts...</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
            {error}
          </div>
        )}
        {!loading && !error && plans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">💪</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Workouts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start your fitness journey by creating your first workout plan!
            </p>
            <Link href="/workouts/new">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Workout
              </Button>
            </Link>
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Link
                key={plan.id}
                href={`/workouts/${plan.id}`}
                className="bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-400 transition-all p-6 flex flex-col cursor-pointer transform hover:scale-105"
              >
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {plan.username}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium">
                    🎯 {plan.workout_goal}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {plan.created_at
                      ? new Date(plan.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
                <p className="text-gray-700 line-clamp-3 whitespace-pre-wrap mb-3 flex-grow">
                  {plan.intro_text}
                </p>
                <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-medium">
                    {Array.isArray(plan.exercises) && (
                      <span>💪 {plan.exercises.length} exercises</span>
                    )}
                  </div>
                  <div className="text-blue-600 font-medium text-sm flex items-center">
                    View
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
