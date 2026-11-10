export function ProgressBar({ value, className = "", tone = "brand" }: { value: number; className?: string; tone?: "brand" | "success" | "light" }) {
  const fill =
    tone === "success" ? "bg-success" : tone === "light" ? "bg-white" : "bg-gradient-to-r from-brand-400 to-brand-600";
  const track = tone === "light" ? "bg-white/25" : "bg-brand-50";
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full ${track} ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
  light = false,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  light?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const id = `ring-${size}-${light ? "l" : "d"}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light ? "#FFFFFF" : "#9474FB"} />
          <stop offset="1" stopColor={light ? "#D7CCFF" : "#4F2BC2"} />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? "rgba(255,255,255,0.22)" : "#EBE5FF"} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="50%"
        y={label ? "47%" : "50%"}
        dominantBaseline="middle"
        textAnchor="middle"
        style={{ fontSize: size * 0.22, fontWeight: 800, fill: light ? "#fff" : "#17133A", fontFamily: "var(--font-display)" }}
      >
        {value}%
      </text>
      {label && (
        <text
          x="50%"
          y="66%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ fontSize: size * 0.085, fontWeight: 600, letterSpacing: "0.08em", fill: light ? "rgba(255,255,255,0.75)" : "#5B5F7B" }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
