"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Save,
  ArrowLeft,
  User,
  Target,
  Hash,
  AlertCircle,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
      fitnessLevel: "beginner" as const,
      injuries: "",
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
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          age,
          workout_goal: workoutGoal,
          intro_text: introText,
          plan_text: workoutPlan,
          exercises,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save plan");
      return json.data.id as string;
    },
    onSuccess: () => router.push("/workouts"),
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    },
  });

  return (
    <div className="min-h-[calc(100vh-56px)] bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/workouts"
            className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Practices
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Build Your Plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us about yourself and your goals — AI does the rest.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">

          {/* Card header strip */}
          <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your Profile
            </p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* Name */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="e.g. Sarah Johnson"
                            className="pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Age</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g. 28"
                            className="pl-9"
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v === "") field.onChange(0);
                              else if (/^\d+$/.test(v)) field.onChange(parseInt(v, 10));
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Goal */}
                <FormField
                  control={form.control}
                  name="workoutGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Fitness goal</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Target className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="e.g. yoga flexibility, pilates core, weight loss"
                            className="pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fitness level */}
                <FormField
                  control={form.control}
                  name="fitnessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Fitness level</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Activity className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Injuries */}
                <FormField
                  control={form.control}
                  name="injuries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Injuries or limitations{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ShieldAlert className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            {...field}
                            placeholder="e.g. lower back pain, bad knees, shoulder injury…"
                            className="pl-9 min-h-[80px] resize-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-1">
                  <Button
                    type="submit"
                    className="w-full gap-2 rounded-xl"
                    size="lg"
                    disabled={generatePlanMutation.isPending}
                  >
                    {generatePlanMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        Crafting your plan…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Generate My Plan
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </Form>
          </div>
        </div>

        {/* Feature hints */}
        {!workoutPlan && !generatePlanMutation.isPending && !error && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: "🧘", label: "Pilates & Yoga" },
              { icon: "🎬", label: "Video guides" },
              { icon: "⚡", label: "AI-tailored" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-muted/20 py-4 text-center"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
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
                className="w-full gap-2 rounded-xl"
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
