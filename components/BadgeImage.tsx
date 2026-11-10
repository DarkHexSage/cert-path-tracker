"use client";

import { useState } from "react";
import Stamp from "./Stamp";

export default function BadgeImage({
  src,
  earned = true,
  size = 96,
  className = "",
}: {
  src: string | null | undefined;
  earned?: boolean;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <Stamp earned={earned} size={size} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`shrink-0 object-contain transition-all duration-300 ${earned ? "" : "opacity-45 grayscale"} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
