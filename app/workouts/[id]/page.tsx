"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWorkoutPlanById } from "@/lib/workout";
import type { WorkoutPlanRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { getYouTubeThumbnail } from "@/lib/youtube";
import Link from "next/link";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlanRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const id = params.id as string;
        const data = await fetchWorkoutPlanById(id);
        if (isMounted) {
          setWorkout(data);
        }
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600">Loading workout...</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4 max-w-lg">
          <p className="font-semibold">Error</p>
          <p>{error || "Workout not found"}</p>
        </div>
        <Button onClick={() => router.push("/workouts")}>
          Back to Workouts
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
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

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <h1 className="text-4xl font-bold mb-2">{workout.username}</h1>
            <p className="text-xl opacity-90 mb-1">
              Goal: {workout.workout_goal}
            </p>
            <p className="text-sm opacity-75">
              Age: {workout.age} years
              {workout.created_at && (
                <span className="ml-4">
                  Created: {new Date(workout.created_at).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {workout.intro_text && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Your Personalized Plan 📋
            </h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {workout.intro_text}
            </p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Your Exercises 💪
          </h2>

          {Array.isArray(workout.exercises) && workout.exercises.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                    <h3 className="text-2xl font-bold text-white">
                      {index + 1}. {exercise.name}
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Sets
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {exercise.sets}
                        </p>
                      </div>
                      <div className="flex-1 bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 font-medium mb-1">
                          Reps
                        </p>
                        <p className="text-3xl font-bold text-purple-600">
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
                          className="w-full h-80 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://via.placeholder.com/640x360/FF0000/FFFFFF?text=YouTube+Tutorial";
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                          <div className="transform group-hover:scale-110 transition-transform">
                            <svg
                              className="w-24 h-24 text-white drop-shadow-lg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <p className="text-white font-semibold">
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
                {workout.plan_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
