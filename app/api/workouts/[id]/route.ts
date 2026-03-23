import { NextResponse } from "next/server";
import { fetchWorkoutPlanById } from "@/lib/workout";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = await fetchWorkoutPlanById(id);
    return NextResponse.json({ data: plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load practice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
