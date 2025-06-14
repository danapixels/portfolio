// Stamp types available
export type StampType = "gold" | "silver" | "bronze" | "diamond";

// A single stamp placed on the screen
export type Stamp = {
  x: number;
  y: number;
  id: string;
  user: string;
  type: StampType;
};

// Optional: Type for click sparks (used in visual effects)
export type Spark = {
  id: number;
  x: number;
  y: number;
};
