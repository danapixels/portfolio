// stamp types
export type StampType = "gold" | "silver" | "bronze" | "diamond";

// user identity types
export type UserIdentity = "PM" | "Engineer" | "Manager" | "Leadership" | "Recruiter" | "Friend" | "Cat" | "Designer" | "Other";

// a stamp on the screen
export type Stamp = {
  x: number;
  y: number;
  id: string;
  user: string;
  type: StampType;
  userIdentity?: UserIdentity; // identity image of the user who stamped
};