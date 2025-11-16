export function Footer() {
  return (
    <footer className="border-t py-1">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} F💪exAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
