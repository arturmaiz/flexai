"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Dumbbell,
  Link as LucideLinkIcon,
  Sparkles,
} from "lucide-react";
import { NavigationMenuComponent } from "./NavigationMenu/NavigationMenu";
import { Stat } from "./Stat/Stat";
import { Footer } from "./Footer/Footer";
import Link from "next/link";

const exercises = [
  {
    name: "Pull Ups",
    sets: "4×6–8",
    focus: "Upper Body",
    emoji: "🔥",
  },
  {
    name: "Leg Press",
    sets: "3×10–12",
    focus: "Legs",
    emoji: "🏋️",
  },
  {
    name: "Bycycle Sprint",
    sets: "3×10–12",
    focus: "Cardio",
    emoji: "🚴",
  },
  {
    name: "Rowing Machine",
    sets: "3×12–15",
    focus: "Back & Shoulders",
    emoji: "🚣‍♀️",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid min-h-[calc(100vh-72px)] items-center gap-10 py-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start gap-6"
            >
              <Badge className="w-fit" variant="secondary">
                <Sparkles className="mr-2 h-4 w-4" /> AI Workout Builder
              </Badge>
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
                Build smarter workouts in seconds with
                <span className="text-primary">F💪exAI</span>
              </h1>
              <p className="text-balance text-lg text-muted-foreground md:text-xl">
                Tell us your goals. We’ll generate a personalized plan, adapt it
                as you progress, and keep you motivated—no guesswork, no
                spreadsheets.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">✅ No credit card</div>
                <div className="flex items-center gap-1">✅ Cancel anytime</div>
                <div className="flex items-center gap-1">
                  ✅ iOS + Android PWA
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent blur-2xl" />
              <Card className="rounded-3xl shadow-lg border-primary/20 hover:shadow-primary/10 transition-all">
                <CardHeader className="flex flex-col gap-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xl font-semibold">
                      <Dumbbell className="h-5 w-5 text-primary" /> Your next
                      session
                    </span>
                    <Badge variant="secondary">✅ Ready</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Generated based on your goals and experience.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <Stat title="Goal" value="Hypertrophy" />
                    <Stat title="Duration" value="45–60m" />
                    <Stat title="Split" value="Push" />
                  </div>

                  {exercises.map((exercise) => (
                    <div
                      key={exercise.name}
                      className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {exercise.emoji}
                        </div>
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exercise.focus}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">
                        {exercise.sets}
                      </span>
                    </div>
                  ))}

                  <Link href="/workouts">
                    <Button className="w-full mt-2 gap-2" size="lg">
                      Start Workout <ArrowRight className="h-4 w-4" />
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
