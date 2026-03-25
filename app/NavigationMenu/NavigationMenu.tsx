"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationMenuComponent() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="text-xl leading-none">🧘</span>
          <span className="text-base font-semibold tracking-tight">
            Flex<span className="text-primary font-bold">AI</span>
          </span>
        </Link>

        {/* Nav links + CTA */}
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/"
            className={`relative hidden sm:block text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
            {pathname === "/" && (
              <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/workouts"
            className={`relative text-sm font-medium transition-colors ${
              pathname.startsWith("/workouts")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Practices
            {pathname.startsWith("/workouts") && (
              <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/pricing"
            className={`relative text-sm font-medium transition-colors ${
              pathname === "/pricing"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pricing
            {pathname === "/pricing" && (
              <span className="absolute -bottom-[18px] left-0 right-0 h-[2px] rounded-full bg-primary" />
            )}
          </Link>

          <Link
            href="/workouts/new"
            className="shrink-0 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
          >
            + New Plan
          </Link>
        </nav>

      </div>
    </header>
  );
}
