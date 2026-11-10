export default function StatTile({
  icon,
  label,
  value,
  hint,
  tone = "brand",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "brand" | "green" | "amber" | "sky";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span>
      <div className="min-w-0">
        <div className="font-display text-2xl font-extrabold tabular-nums text-ink">{value}</div>
        <div className="text-sm font-medium text-body">{label}</div>
        {hint && <div className="text-xs text-body/70">{hint}</div>}
      </div>
    </div>
  );
}
