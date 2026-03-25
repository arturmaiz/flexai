import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// Verify a Stripe checkout session and return whether the user has an active subscription
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ pro: false });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const sub = session.subscription as { status?: string } | null;
    const isPro =
      session.payment_status === "paid" ||
      (sub != null && (sub.status === "active" || sub.status === "trialing"));

    return NextResponse.json({ pro: isPro });
  } catch {
    return NextResponse.json({ pro: false });
  }
}
