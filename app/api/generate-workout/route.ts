import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, age, workoutGoal, fitnessLevel, injuries } = body;

    if (!username || !age || !workoutGoal || !fitnessLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a professional Pilates and Yoga instructor who also specialises in general fitness training.

IMPORTANT RULES:
- Keep responses SHORT and TO THE POINT
- Add 1-2 relevant emojis per section (🧘, 🌿, 💪, 🔥, ⚡, 🎯)
- For EVERY exercise provide a REAL YouTube video URL with a known video ID
- Use bullet points and clear formatting
- Be encouraging but concise
- ALWAYS adapt difficulty to the trainer's fitness level (beginner / intermediate / advanced)
- ALWAYS avoid exercises that could worsen reported injuries or limitations; suggest safe modifications when relevant

PERSONALIZATION MESSAGE:
Always start with: "Hey ${username}! 👋 The more you use FlexAI, the better I'll understand your journey and create plans tailored specifically for you! 🎯"

EXERCISE FORMAT — use this EXACT format for every exercise:
EXERCISE: [Exercise Name]
SETS: [number]
REPS: [number or duration, e.g. 12 or 30s]
VIDEO: [Real YouTube URL, e.g. https://www.youtube.com/watch?v=VIDEOID]
---`,
            },
            {
              role: "user",
              content: `Create a personalized Pilates, Yoga, or fitness plan for ${username}, age ${age}.

Fitness level: ${fitnessLevel}
Goal: ${workoutGoal}${injuries ? `\nInjuries / limitations: ${injuries} — avoid exercises that aggravate these areas and suggest safe alternatives where needed.` : ""}

Use this EXACT format for each exercise (include real YouTube video IDs):

EXERCISE: Downward Dog
SETS: 3
REPS: 30s
VIDEO: https://www.youtube.com/watch?v=j97SSGsnCAQ
---

EXERCISE: Pilates Roll-Up
SETS: 3
REPS: 10
VIDEO: https://www.youtube.com/watch?v=gGFRj9OMBOA
---

EXERCISE: Warrior II
SETS: 3
REPS: 45s
VIDEO: https://www.youtube.com/watch?v=7kgZnJE4WEI
---

Include 4-6 exercises. Keep the intro SHORT (2-3 lines max). Choose exercises appropriate for the goal: if yoga → yoga poses, if pilates → pilates moves, if strength → gym exercises, if mixed → blend them.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      const errorMessage = errorData.error?.message || "Failed to generate plan";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const workoutPlan = groqData.choices?.[0]?.message?.content;

    if (!workoutPlan) {
      return NextResponse.json({ error: "No plan generated" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Plan created successfully",
        data: { username, age, workoutGoal, workoutPlan },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
