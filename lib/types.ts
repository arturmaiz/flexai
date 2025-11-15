import { Exercise } from "@/app/workouts/new/types";

export interface WorkoutPlanRecord {
  id?: string;
  username: string;
  age: number;
  workout_goal: string;
  intro_text: string;
  plan_text: string;
  exercises: Exercise[];
  created_at?: string;
}
