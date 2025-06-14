// stampIcons.tsx
import React from "react";
import type { StampType } from "./types";

export const stampIcons: Record<StampType, React.ReactNode> = {
  gold: <img src="/star.png" alt="Star Stamp" className="w-8 h-8" />,
  silver: <img src="/heart.png" alt="Heart Stamp" className="w-8 h-8" />,
  bronze: <img src="/smile.png" alt="Smile Stamp" className="w-8 h-8" />,
  diamond: <img src="/cat.png" alt="Cat Stamp" className="w-8 h-8" />,
};
