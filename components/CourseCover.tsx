"use client";

import { useState } from "react";
import { categoryStyle } from "@/lib/categories";
import BadgeImage from "./BadgeImage";

/**
 * Course picture. Uses the uploaded cover when there is one; otherwise draws a
 * colourful category cover with the course badge floating in the middle.
 */
export default function CourseCover({
  cover,
  badge,
  category,
  title,
  className = "",
  badgeSize = 96,
  children,
}: {
  cover: string | null;
  badge: string | null;
  category: string;
  title: string;
  className?: string;
  badgeSize?: number;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const s = categoryStyle(category);
  const useImage = cover && !failed;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={title}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
          aria-hidden="true"
        >
          <span className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/15" />
          <span className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-black/10" />
          <span className="absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-white/50" />
          <span className="absolute bottom-[22%] right-[14%] h-2 w-2 rounded-full bg-white/60" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
            <defs>
              <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="drop-shadow-[0_14px_20px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
              <BadgeImage src={badge} size={badgeSize} />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
