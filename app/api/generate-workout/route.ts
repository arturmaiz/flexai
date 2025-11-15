import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, age, workoutGoal } = body;

    if (!username || !age || !workoutGoal) {
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

    console.log("Generating workout plan for:", { username, age, workoutGoal });

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
              content: `You are a professional fitness trainer and workout planner.

IMPORTANT RULES:
- Keep responses SHORT and TO THE POINT - no long explanations
- Add relevant emojis (💪, 🏋️, 🔥, ⚡, 🎯, etc.) but use them sparingly (2-3 per section max)
- For EVERY exercise, include a YouTube search link in this exact format: [Exercise Name](https://www.youtube.com/results?search_query=how+to+do+[exercise+name]+proper+form)
- Use bullet points and clear formatting
- Be encouraging but concise

PERSONALIZATION MESSAGE:
Always start with: "Hey ${username}! 👋 The more you use this app, the better I'll understand your fitness journey and create plans tailored specifically for you! 🎯"

EXERCISE FORMAT:
For each exercise, use this EXACT format:
EXERCISE: [Exercise Name]
SETS: [number]
REPS: [number or range]
VIDEO: [Use REAL YouTube video URL format like: https://www.youtube.com/watch?v=VIDEOID or just provide a common exercise video search that exists]
---`,
            },
            {
              role: "user",
              content: `Create a personalized workout plan for ${username}, age ${age}, goal: ${workoutGoal}.

IMPORTANT: Use this EXACT format for each exercise:

EXERCISE: Push-ups
SETS: 3
REPS: 10-15
VIDEO: https://www.youtube.com/watch?v=IODxDxX7oi4
---

EXERCISE: Squats
SETS: 4
REPS: 12
VIDEO: https://www.youtube.com/watch?v=YaXPRqUwItQ
---

Include 4-6 exercises total. Keep intro message SHORT (2-3 lines max).
You can use real YouTube video IDs or search URLs like: https://www.youtube.com/results?search_query=how+to+do+exercise+name+proper+form`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      console.error("Groq API error:", error);

      let errorMessage = "Failed to generate workout plan";
      if (error.error?.message) {
        errorMessage = error.error.message;
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const workoutPlan = groqData.choices?.[0]?.message?.content;

    if (!workoutPlan) {
      return NextResponse.json(
        { error: "No workout plan generated" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Workout plan created successfully",
        data: {
          username,
          age,
          workoutGoal,
          workoutPlan,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
