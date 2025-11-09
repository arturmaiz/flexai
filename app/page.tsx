import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">F💪exAI</h1>
      <p className="text-lg">
        Create and manage your workout routines with AI assistance in seconds.
      </p>
      <p className="text-sm text-muted-foreground">
        No more spending hours searching for the perfect workout plan.
      </p>
      <Button asChild>
        <Link href="/workout/new">
          <ArrowRightIcon className="w-4 h-4" />
          Get Started
        </Link>
      </Button>
    </div>
  );
}
