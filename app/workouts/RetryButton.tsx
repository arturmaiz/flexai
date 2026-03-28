"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RetryButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="shrink-0 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="h-3.5 w-3.5" /> Retry
    </Button>
  );
}
