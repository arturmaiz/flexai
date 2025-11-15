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
import { getYouTubeThumbnail } from "@/lib/youtube";
import { parseWorkoutPlanText } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { saveWorkoutPlan } from "@/lib/workout";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate workout plan");
      }
      return data.data.workoutPlan as string;
    },
    onSuccess: (plan: string) => {
      setWorkoutPlan(plan);
      const parsed = parseWorkoutPlanText(plan);
      setIntroText(parsed.introText);
      setExercises(parsed.exercises);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to connect to server";
      setError(message);
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
      if (!workoutPlan) throw new Error("No workout plan to save");
      const { username, age, workoutGoal } = form.getValues();
      const id = await saveWorkoutPlan({
        username,
        age,
        workout_goal: workoutGoal,
        intro_text: introText,
        plan_text: workoutPlan,
        exercises,
      });
      return id;
    },
    onSuccess: (_id: string) => {
      router.push("/workouts");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to save workout plan";
      setError(message);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Create Your Personalized Workout Plan
          </h1>
          <div className="flex gap-3">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                My Workouts
              </Button>
            </Link>
          </div>
        </div>

        <div className="gap-8 max-w-3xl m-8 mx-auto">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Your Full Name"
                        />
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
                          placeholder="Your Age"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(0);
                            } else if (/^\d+$/.test(value)) {
                              field.onChange(parseInt(value, 10));
                            }
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
                          type="text"
                          placeholder="Your Workout Goal (e.g., lose weight, build muscle, improve endurance)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={generatePlanMutation.isPending}
                >
                  {generatePlanMutation.isPending
                    ? "Generating Your Plan..."
                    : "Generate Workout Plan"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="m-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {generatePlanMutation.isPending && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-600 text-lg">
                  🏋️ Creating your personalized workout plan...
                </p>
              </div>
            )}

            {workoutPlan && !generatePlanMutation.isPending && (
              <div className="space-y-4">
                {introText && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {introText}
                    </p>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Your Exercises 💪
                </h2>

                {exercises.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                      >
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                          <h3 className="text-xl font-bold text-white">
                            {index + 1}. {exercise.name}
                          </h3>
                        </div>

                        <div className="p-4">
                          <div className="flex gap-4 mb-4">
                            <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-gray-600 font-medium">
                                Sets
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {exercise.sets}
                              </p>
                            </div>
                            <div className="flex-1 bg-purple-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-gray-600 font-medium">
                                Reps
                              </p>
                              <p className="text-2xl font-bold text-purple-600">
                                {exercise.reps}
                              </p>
                            </div>
                          </div>

                          <a
                            href={exercise.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                          >
                            <div className="relative">
                              <img
                                src={getYouTubeThumbnail(
                                  exercise.videoUrl,
                                  exercise.name
                                )}
                                alt={`${exercise.name} tutorial`}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://via.placeholder.com/640x360/FF0000/FFFFFF?text=YouTube+Tutorial";
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                <div className="transform group-hover:scale-110 transition-transform">
                                  <svg
                                    className="w-20 h-20 text-white drop-shadow-lg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                <p className="text-white font-semibold text-sm">
                                  🎥 Watch Tutorial on YouTube
                                </p>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {workoutPlan}
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t mt-6">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                    disabled={savePlanMutation.isPending}
                    onClick={() => savePlanMutation.mutate()}
                  >
                    {savePlanMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                          />
                        </svg>
                        <span>Save Workout Plan</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {!workoutPlan && !generatePlanMutation.isPending && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <p className="text-lg m-8">
                  Fill out the form to generate your personalized workout plan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWorkoutPage;
