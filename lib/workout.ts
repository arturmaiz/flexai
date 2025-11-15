import { supabase } from "./supabase";
import { WorkoutPlanRecord } from "./types";
import { WORKOUT_PLANS_TABLE } from "./constants";

export async function saveWorkoutPlan(
  record: Omit<WorkoutPlanRecord, "id" | "created_at">
): Promise<string> {
  const { data, error } = await supabase
    .from(WORKOUT_PLANS_TABLE)
    .insert(record)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data.id as string;
}

export async function fetchWorkoutPlans(): Promise<WorkoutPlanRecord[]> {
  const { data, error } = await supabase
    .from(WORKOUT_PLANS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as WorkoutPlanRecord[];
}

export async function fetchWorkoutPlanById(
  id: string
): Promise<WorkoutPlanRecord> {
  const { data, error } = await supabase
    .from(WORKOUT_PLANS_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as WorkoutPlanRecord;
}
