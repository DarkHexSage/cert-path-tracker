// Hexagon badge placeholder, used when a course has no badge image.
export default function Stamp({ earned, size = 40 }: { earned: boolean; size?: number }) {
  const hex = "M50 4 L91 27 L91 73 L50 96 L9 73 L9 27 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={earned ? "animate-pop-in" : ""}>
      <defs>
        <linearGradient id="stamp-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FCD34D" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <path d={hex} fill={earned ? "url(#stamp-g)" : "#EEF0F6"} stroke={earned ? "#B45309" : "#CDD1E0"} strokeWidth="4" />
      {earned ? (
        <path d="M33 51 L45 63 L69 38" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M50 30 l6 13 14 2 -10 10 2 14 -12 -7 -12 7 2 -14 -10 -10 14 -2z" fill="#CDD1E0" />
      )}
    </svg>
  );
}
