// stampIcons.tsx
import React from "react";
import type { StampType } from "./types";

// all 4 stamps on the dock
export const stampIcons: Record<StampType, React.ReactNode> = {
  gold: <img src="/star.png" alt="Star Stamp" />,
  silver: <img src="/heart.png" alt="Heart Stamp" />,
  bronze: <img src="/smile.png" alt="Smile Stamp" />,
  diamond: <img src="/cat.png" alt="Cat Stamp" />,
};
