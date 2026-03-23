"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchWorkoutPlanById } from "@/lib/workout";
import type { WorkoutPlanRecord } from "@/lib/types";
import type { Exercise } from "@/app/workouts/new/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { Dumbbell, CalendarDays, Hash, Play } from "lucide-react";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlanRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const created = useMemo(() => {
    const d = workout?.created_at ? new Date(workout.created_at) : null;
    return d
      ? d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
  }, [workout?.created_at]);

  const initials = useMemo(() => {
    const u = workout?.username || "User";
    const parts = u.split(" ");
    return (
      (parts[0]?.[0] || "U").toUpperCase() + (parts[1]?.[0] || "").toUpperCase()
    );
  }, [workout?.username]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const id = params.id as string;
        const data = await fetchWorkoutPlanById(id);
        if (isMounted) setWorkout(data);
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load workout";
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        <p className="mt-4 text-muted-foreground">Loading workout…</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="mb-6 w-full max-w-lg border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {error || "Workout not found"}
          </CardContent>
        </Card>
        <Button onClick={() => router.push("/workouts")}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  const AiMessage = ({ title, text }: { title: string; text?: string }) => (
    <div className="relative rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
      <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-emerald-500" />
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
          AI
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">{title}</span>
            {created && (
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                <CalendarDays className="mr-1 h-3.5 w-3.5" /> {created}
              </span>
            )}
            {workout?.age && (
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                <Hash className="mr-1 h-3.5 w-3.5" /> Age {workout.age}
              </span>
            )}
          </div>
          {text && (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const ExerciseCard = ({
    exercise,
    index,
  }: {
    exercise: Exercise;
    index: number;
  }) => (
    <li>
      <div className="group relative rounded-2xl bg-white p-[1px] shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-[linear-gradient(135deg,rgba(99,102,241,.25),rgba(217,70,239,.18),rgba(16,185,129,.22))] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div className="relative rounded-[14px] border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold md:text-lg">
              {index + 1}. {exercise.name}
            </h3>
            <div className="flex gap-2">
              <Badge variant="secondary" className="rounded-full">
                {exercise.sets} sets
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {exercise.reps} reps
              </Badge>
            </div>
          </div>

          <Link
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl ring-1 ring-inset ring-muted/40 transition duration-200 group-hover:ring-foreground/40"
          >
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <img
                src={getYouTubeThumbnail(exercise.videoUrl, exercise.name)}
                alt={`${exercise.name} tutorial`}
                className="absolute top-0 left-0 h-full w-full object-cover will-change-transform transition-transform duration-200 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/640x360/111827/FFFFFF?text=Tutorial";
                }}
              />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center gap-2 p-3 text-sm text-white/95">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/40">
                  <Play className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium drop-shadow">Watch tutorial</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </li>
  );

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <AiMessage
          title={`${workout.username} wants to ${workout.workout_goal}`}
          text={workout.intro_text || undefined}
        />

        <section>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight md:text-3xl">
            Your Exercises 💪
          </h2>

          {Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workout.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={`${exercise.name}-${index}`}
                  exercise={exercise}
                  index={index}
                />
              ))}
            </ul>
          ) : (
            <Card className="border-muted/40">
              <CardContent className="p-6">
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {workout.plan_text}
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/workouts">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
