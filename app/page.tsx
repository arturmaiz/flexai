"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { Stat } from "./Stat/Stat";
import Link from "next/link";

const practices = [
  {
    name: "Downward Dog",
    sets: "3 × 30s",
    focus: "Full Body Stretch",
    emoji: "🐾",
  },
  {
    name: "Warrior II",
    sets: "3 × 45s",
    focus: "Strength & Balance",
    emoji: "⚔️",
  },
  {
    name: "Pilates Roll-Up",
    sets: "3 × 12",
    focus: "Core Strength",
    emoji: "🌀",
  },
  {
    name: "Child's Pose",
    sets: "2 × 60s",
    focus: "Recovery & Calm",
    emoji: "🌿",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.92_0.05_280/0.18),transparent_60%)]" />
        <div className="container mx-auto px-4">
          <div className="grid min-h-[calc(100vh-72px)] items-center gap-10 py-12 md:grid-cols-2">

            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start gap-6"
            >
              <Badge className="w-fit gap-1.5" variant="secondary">
                <Sparkles className="h-3.5 w-3.5" /> AI Pilates &amp; Yoga
              </Badge>

              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl leading-tight">
                Move mindfully.{" "}
                <span className="text-primary">Train smarter.</span>
              </h1>

              <p className="text-balance text-lg text-muted-foreground md:text-xl leading-relaxed">
                Describe your goals and FlexAI crafts a personalized Pilates or
                Yoga plan — with video tutorials, adaptive progression, and zero
                guesswork.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">✅ Pilates</span>
                <span className="flex items-center gap-1">✅ Yoga</span>
                <span className="flex items-center gap-1">✅ Strength</span>
                <span className="flex items-center gap-1">✅ Video tutorials</span>
              </div>

              <Link href="/workouts/new">
                <Button size="lg" className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  Build my plan <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Right — preview card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 via-accent/15 to-secondary/20 blur-2xl" />
              <Card className="rounded-3xl border-border/60 shadow-xl">
                <CardHeader className="flex flex-col gap-2 pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      🧘 Today&apos;s session
                    </span>
                    <Badge variant="secondary">✅ Ready</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tailored to your goals and current level.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <Stat title="Style" value="Vinyasa" />
                    <Stat title="Duration" value="40 min" />
                    <Stat title="Level" value="All levels" />
                  </div>

                  {practices.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between rounded-xl border border-border/60 p-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-base">
                          {p.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.focus}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">{p.sets}</span>
                    </div>
                  ))}

                  <Link href="/workouts">
                    <Button className="mt-2 w-full gap-2" size="lg">
                      Start Practice <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
