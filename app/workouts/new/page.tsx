"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useState } from "react";
import { formSchema } from "./schema/formSchema";
import { Exercise } from "./types";
import { getVideoIdFromUrl } from "@/lib/youtube";
import { parseWorkoutPlanText } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { saveWorkoutPlan } from "@/lib/workout";
import { useRouter } from "next/navigation";
import { Sparkles, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

const NewWorkoutPage = () => {
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [introText, setIntroText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      age: 0,
      workoutGoal: "",
    },
  });

  const generatePlanMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate plan");
      return data.data.workoutPlan as string;
    },
    onSuccess: (plan: string) => {
      setWorkoutPlan(plan);
      const parsed = parseWorkoutPlanText(plan);
      setIntroText(parsed.introText);
      setExercises(parsed.exercises);
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to connect to server");
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setError(null);
      setWorkoutPlan(null);
      setExercises([]);
      setIntroText("");
      generatePlanMutation.mutate(values);
    },
    [generatePlanMutation]
  );

  const savePlanMutation = useMutation({
    mutationFn: async () => {
      if (!workoutPlan) throw new Error("No plan to save");
      const { username, age, workoutGoal } = form.getValues();
      return saveWorkoutPlan({
        username,
        age,
        workout_goal: workoutGoal,
        intro_text: introText,
        plan_text: workoutPlan,
        exercises,
      });
    },
    onSuccess: () => router.push("/workouts"),
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    },
  });

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background px-4 py-10 md:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Build Your Plan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilates, Yoga, or any fitness goal — AI builds it for you.
            </p>
          </div>
          <Link href="/workouts">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Age"
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") field.onChange(0);
                          else if (/^\d+$/.test(v)) field.onChange(parseInt(v, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workoutGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Goal — e.g. yoga flexibility, pilates core, weight loss, build strength"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={generatePlanMutation.isPending}
              >
                {generatePlanMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Empty prompt */}
        {!workoutPlan && !generatePlanMutation.isPending && !error && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Fill in the form above to generate your personalized Pilates or Yoga plan.
          </p>
        )}

        {/* Results */}
        {workoutPlan && !generatePlanMutation.isPending && (
          <div className="mt-8 space-y-6">
            {/* Intro */}
            {introText && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {introText}
                </p>
              </div>
            )}

            {/* Exercise cards */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Your Movements 🧘</h2>
              {exercises.length > 0 ? (
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
                    >
                      {/* Card header */}
                      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-3.5">
                        <h3 className="font-semibold">
                          {index + 1}. {exercise.name}
                        </h3>
                        <div className="flex gap-2">
                          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {exercise.sets} sets
                          </span>
                          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                            {exercise.reps} reps
                          </span>
                        </div>
                      </div>
                      {/* Embedded video */}
                      <div className="p-4">
                        <YouTubePlayer videoUrl={exercise.videoUrl} title={exercise.name} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border/60 bg-muted/30 p-6">
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {workoutPlan}
                  </p>
                </div>
              )}
            </div>

            {/* Save */}
            <div className="border-t border-border/50 pt-5">
              <Button
                className="w-full gap-2"
                size="lg"
                disabled={savePlanMutation.isPending}
                onClick={() => savePlanMutation.mutate()}
              >
                {savePlanMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Practice Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewWorkoutPage;
