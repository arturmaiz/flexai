export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <span>🧘</span> FlexAI
          </p>
          <p className="text-xs text-muted-foreground">
            AI-powered Pilates &amp; Yoga — personalized for you
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FlexAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
