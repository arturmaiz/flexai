"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationMenuComponent() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-primary">🧘</span>
          <span>
            Flex<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/workouts"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/workouts")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            My Practices
          </Link>
          <Link
            href="/workouts/new"
            className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
          >
            + New Plan
          </Link>
        </nav>
      </div>
    </header>
  );
}
