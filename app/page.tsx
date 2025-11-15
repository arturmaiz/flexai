import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-end gap-3">
          <Link href="/">
            <Button variant="outline" className="font-semibold">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Button>
          </Link>
          <Link href="/workouts">
            <Button variant="outline" className="font-semibold">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              My Workouts
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <h1 className="text-4xl font-bold">F💪exAI</h1>
        <p className="text-lg">
          Create and manage your workout routines with AI assistance in seconds.
        </p>
        <p className="text-sm text-muted-foreground">
          No more spending hours searching for the perfect workout plan.
        </p>
        <Button asChild>
          <Link href="/workouts">
            <ArrowRightIcon className="w-4 h-4" />
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}
