"use client";

import { useState } from "react";
import Stamp from "./Stamp";

export default function BadgeMedia({
  id,
  earned,
  src,
  size = 36,
}: {
  id: string;
  earned: boolean;
  src?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const source = src ?? `/badges/${id}.png`;

  // No image available — fall back to the hexagon stamp.
  if (failed) {
    return <Stamp earned={earned} size={size} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`shrink-0 transition-all duration-300 ${
        earned ? "animate-stamp-in" : "opacity-40 grayscale"
      }`}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
