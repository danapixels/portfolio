// stamp types
export type StampType = "gold" | "silver" | "bronze" | "diamond";

// user identity types
export type UserIdentity = "PM" | "Engineer" | "Manager" | "Leadership" | "Recruiter" | "Friend" | "Cat" | "Designer" | "Other";

// a stamp on the screen
export type Stamp = {
  x: string; // percentage value like "50%"
  y: string; // percentage value like "50%"
  id: string;
  user: string;
  type: StampType;
  userIdentity?: UserIdentity; // identity image of the user who stamped
  timestamp: string; // when the stamp was placed (MM.DD.YYYY format)
  hour?: number; // hour when the stamp was placed (0-23)
  rotation: number; // rotation angle in degrees
};