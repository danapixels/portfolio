// Stamp types available
export type StampType = "gold" | "silver" | "bronze" | "diamond";

// User identity types
export type UserIdentity = "PM" | "Engineer" | "Manager" | "Leadership" | "Recruiter" | "Friend" | "Cat" | "Designer" | "Other";

// A single stamp placed on the screen
export type Stamp = {
  x: number;
  y: number;
  id: string;
  user: string;
  type: StampType;
  userIdentity?: UserIdentity; // Optional user identity for hover labels
};

// Optional: Type for click sparks (used in visual effects)
export type Spark = {
  id: number;
  x: number;
  y: number;
};
