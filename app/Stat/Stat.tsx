export function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border p-3 text-center bg-muted/30">
      <p className="text-xs uppercase text-muted-foreground">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
