"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { WorkoutPlanRecord } from "@/lib/types";
import type { Exercise } from "@/app/workouts/new/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVideoIdFromUrl } from "@/lib/youtube";
import { CalendarDays, Hash, ArrowLeft } from "lucide-react";

function YouTubePlayer({
  videoUrl,
  title,
}: {
  videoUrl: string;
  title: string;
}) {
  const videoId = getVideoIdFromUrl(videoUrl);
  if (videoId) {
    return (
      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`${title} tutorial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-6 text-sm font-medium text-primary hover:bg-muted transition-colors"
    >
      <span className="text-lg">▶</span> Watch tutorial on YouTube
    </a>
  );
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlanRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const created = useMemo(() => {
    const d = workout?.created_at ? new Date(workout.created_at) : null;
    return d
      ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "";
  }, [workout?.created_at]);

  const initials = useMemo(() => {
    const u = workout?.username || "User";
    const parts = u.split(" ");
    return (parts[0]?.[0] || "U").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  }, [workout?.username]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/workouts/${params.id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load practice");
        if (isMounted) setWorkout(json.data);
      } catch (err) {
        if (isMounted)
          setError(err instanceof Error ? err.message : "Failed to load practice");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading practice…</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-4 p-6">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive text-base">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-destructive">
            {error || "Practice not found"}
          </CardContent>
        </Card>
        <Button variant="outline" onClick={() => router.push("/workouts")}>
          Back to My Practices
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">

        {/* AI intro card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl bg-gradient-to-b from-primary via-accent/80 to-secondary" />
          <div className="flex items-start gap-3 pl-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-sm font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">
                  {workout.username} — {workout.workout_goal}
                </span>
                {created && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" /> {created}
                  </span>
                )}
                {workout.age && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" /> Age {workout.age}
                  </span>
                )}
              </div>
              {workout.intro_text && (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {workout.intro_text}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Exercises */}
        <section>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">
            Your Movements 🧘
          </h2>

          {Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(workout.exercises as Exercise[]).map((exercise, index) => (
                <div
                  key={`${exercise.name}-${index}`}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3">
                    <h3 className="text-sm font-semibold leading-tight">
                      {index + 1}. {exercise.name}
                    </h3>
                    <div className="flex shrink-0 gap-1.5">
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                        {exercise.sets}×
                      </span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {exercise.reps}
                      </span>
                    </div>
                  </div>
                  {/* Embedded video */}
                  <div className="p-3">
                    <YouTubePlayer videoUrl={exercise.videoUrl} title={exercise.name} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-border/60">
              <CardContent className="p-6">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {workout.plan_text}
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Back */}
        <div className="flex justify-start pt-2">
          <Link href="/workouts">
            <Button variant="ghost" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to My Practices
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
