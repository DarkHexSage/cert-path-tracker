export default function Stamp({
  earned,
  size = 40,
}: {
  earned: boolean;
  size?: number;
}) {
  // Pointy-top hexagon path on a 100x100 viewBox.
  const hex = "M50 4 L91 27 L91 73 L50 96 L9 73 L9 27 Z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={earned ? "animate-stamp-in" : ""}
      aria-hidden="true"
    >
      <path
        d={hex}
        fill={earned ? "#E0A82E" : "none"}
        stroke={earned ? "#E0A82E" : "#3a434e"}
        strokeWidth="5"
      />
      {earned ? (
        <path
          d="M34 51 L45 63 L68 38"
          fill="none"
          stroke="#0E1116"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d={hex}
          fill="none"
          stroke="#232A33"
          strokeWidth="2"
          transform="scale(0.6) translate(33 33)"
        />
      )}
    </svg>
  );
}
