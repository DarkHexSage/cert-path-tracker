// Visual identity per category: used for generated course covers when no image is uploaded.
// Unknown categories get a deterministic fallback, so admins can invent new ones freely.

export interface CategoryStyle {
  from: string;
  to: string;
  accent: string;
}

const STYLES: Record<string, CategoryStyle> = {
  Networking: { from: "#38BDF8", to: "#4F46E5", accent: "#E0F2FE" },
  Cybersecurity: { from: "#FB7185", to: "#A21CAF", accent: "#FFE4E6" },
  "Linux & OS": { from: "#FBBF24", to: "#EA580C", accent: "#FEF3C7" },
  Cloud: { from: "#22D3EE", to: "#2563EB", accent: "#CFFAFE" },
  "AI & Data": { from: "#A78BFA", to: "#6D28D9", accent: "#EDE9FE" },
  "Professional Skills": { from: "#34D399", to: "#0F766E", accent: "#D1FAE5" },
  Career: { from: "#F472B6", to: "#7350F2", accent: "#FCE7F3" },
  Programming: { from: "#FACC15", to: "#65A30D", accent: "#FEF9C3" },
  DevOps: { from: "#60A5FA", to: "#0E7490", accent: "#DBEAFE" },
};

const FALLBACKS: CategoryStyle[] = [
  { from: "#818CF8", to: "#4338CA", accent: "#E0E7FF" },
  { from: "#F59E0B", to: "#B45309", accent: "#FEF3C7" },
  { from: "#2DD4BF", to: "#0F766E", accent: "#CCFBF1" },
  { from: "#F87171", to: "#B91C1C", accent: "#FEE2E2" },
];

export function categoryStyle(category: string): CategoryStyle {
  if (STYLES[category]) return STYLES[category];
  let h = 0;
  for (const ch of category) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FALLBACKS[h % FALLBACKS.length];
}

export const SUGGESTED_CATEGORIES = Object.keys(STYLES);

export const SUGGESTED_PROVIDERS = [
  "Cisco Networking Academy",
  "Linux Foundation",
  "IBM SkillsBuild",
  "AWS Skill Builder",
  "Microsoft Learn",
  "Google Cloud Skills Boost",
  "freeCodeCamp",
  "Coursera",
  "TryHackMe",
  "Path Academy",
];
