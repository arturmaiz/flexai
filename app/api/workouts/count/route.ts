import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { WORKOUT_PLANS_TABLE } from "@/lib/constants";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from(WORKOUT_PLANS_TABLE)
      .select("*", { count: "exact", head: true });

    if (error) throw new Error(error.message);
    return NextResponse.json({ count: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to count plans";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
