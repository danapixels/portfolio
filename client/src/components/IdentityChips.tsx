import type { UserIdentity } from "./types";

interface IdentityChipsProps {
  selectedIdentity: UserIdentity | null;
  onIdentitySelect: (identity: UserIdentity | null) => void;
}

const identityOptions: UserIdentity[] = [
  "PM", "Engineer", "Leadership", "Recruiter", "Cat", "Designer"
];

const getIconForIdentity = (identity: UserIdentity) => {
  switch (identity) {
    case "PM": return "/PM.png";
    case "Engineer": return "/engineer.png";
    case "Manager": return "/manager.png";
    case "Leadership": return "/leadership.png";
    case "Recruiter": return "/recruiter.png";
    case "Friend": return "/friend.png";
    case "Cat": return "/caticon.png";
    case "Designer": return "/designer.png";
    case "Other": return "/other.png";
    default: return "";
  }
};

export default function IdentityChips({ selectedIdentity, onIdentitySelect }: IdentityChipsProps) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {identityOptions.map((identity) => (
          <button
            key={identity}
            onClick={() => onIdentitySelect(selectedIdentity === identity ? null : identity)}
            className={`px-1.5 py-0 rounded-full font-medium transition-all duration-200 flex items-center space-x-1 ${
              selectedIdentity === identity
                ? "bg-[#0d0d0d] text-white border border-white"
                : "bg-[#0d0d0d] text-white hover:bg-[#1a1a1a]"
            }`}
            style={{ fontFamily: 'digi, monospace', fontSize: '16px' }}
          >
            <img 
              src={getIconForIdentity(identity)}
              alt={identity}
              className="w-4 h-4"
            />
            <span>{identity.toLowerCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 