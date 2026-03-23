import { NextResponse } from "next/server";
import { fetchWorkoutPlans, saveWorkoutPlan } from "@/lib/workout";

export async function GET() {
  try {
    const plans = await fetchWorkoutPlans();
    return NextResponse.json({ data: plans });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load practices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = await saveWorkoutPlan(body);
    return NextResponse.json({ data: { id } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
