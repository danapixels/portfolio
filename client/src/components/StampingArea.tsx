import { useState, useCallback, useEffect } from "react";
import Dock from "./Dock";
import type { DockItemData } from "./Dock";
import { stampIcons } from "./stampIcons";
import type { StampType, UserIdentity } from "./types";
import IdentityChips from "./IdentityChips";

// get the icon for the identity (not all in use yet)
const getIconForIdentity = (identity: UserIdentity) => {
  switch (identity) {
    case "PM": return "/PM.png";
    case "Engineer": return "/engineer.png";
    case "Manager": return "/manager.png";
    case "Leadership": return "/leadership.png";
    case "Recruiter": return "/recruiter.png";
    case "Friend": return "/friend.png";
    case "Cat": return "/caticon.png";
    case "Designer": return "/friend.png";
    case "Other": return "/other.png";
    default: return "";
  }
};

// stamp type
type Stamp = {
  id: string;
  type: StampType;
  x: string;
  y: string;
  rotation: number;
  user: string;
  userIdentity?: UserIdentity;
  timestamp: string; // when the stamp was placed
};

// props for the stamping area
interface StampingAreaProps {
  className?: string;
  selectedIdentity?: UserIdentity | null;
  onIdentitySelect?: (identity: UserIdentity | null) => void;
}

// stamping area component that shows the stamps and the identity chips
export default function StampingArea({ className = "", selectedIdentity: _selectedIdentity = null, onIdentitySelect }: StampingAreaProps) {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [userId, setUserId] = useState("");
  const [userStampCount, setUserStampCount] = useState(100);
  const [selectedStamp, setSelectedStamp] = useState<StampType | null>('gold');
  const [currentTime, setCurrentTime] = useState("");
  const [showChips, setShowChips] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity | null>(_selectedIdentity);
  const [isDockHovered, setIsDockHovered] = useState(false);
  const [hasPromptBeenDismissed, setHasPromptBeenDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasPromptBeenDismissed') === 'true';
    }
    return false;
  });

  // update local state when prop changes
  useEffect(() => {
    setSelectedIdentity(_selectedIdentity);
  }, [_selectedIdentity]);

  const handleIdentityChange = (identity: UserIdentity | null) => {
    setSelectedIdentity(identity);
    if (onIdentitySelect) {
      onIdentitySelect(identity);
    }
  };

  // set the user id and update the timestamp
  useEffect(() => {
    const id = localStorage.getItem("userId") || crypto.randomUUID();
    localStorage.setItem("userId", id);
    setUserId(id);

    // update timestamp
    const updateTime = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const year = now.getFullYear();
      const timeString = `${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}.${year}`;
      setCurrentTime(timeString);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 86400000); // Update once per day

    // stamp limit 100 to reduce abuse of stamps
    const fetchStamps = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/stamps`, {
        credentials: 'include', // important for authentication
      });
        if (!response.ok) {
          throw new Error('Failed to fetch stamps');
        }
        const data: Stamp[] = await response.json();
        setStamps(data);
        // only count stamps for the current user
        const userCount = data.filter((s) => s.user === id).length;
        setUserStampCount(100 - userCount);
      } catch (error) {
        console.error('Error fetching stamps:', error);
      }
    };

    fetchStamps();

    // fetch new stamps every 2 seconds
    const interval = setInterval(fetchStamps, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  // set the cursor to custom cursor
  useEffect(() => {
    document.body.style.cursor = `url('/cursor.png'), auto`;
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  // check if the current time is AM for the sun/moon icon
  const isAM = () => {
    const now = new Date();
    return now.getHours() < 12;
  };

  // get the title for the stamp
  const getStampTitle = (stamp: Stamp) => {
    let title = stamp.userIdentity ? stamp.userIdentity : (stamp.user === userId ? "" : "Other user's stamp");
    
    // timestamp for all stamps
    title += `\n${currentTime}`;
    
    return title;
  };

  // clamp the value to the min and max (so it doesn't go out of bounds or on the nav bar)
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

  // handle the placement of the stamp
  const handlePlaceStamp = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStamp || userStampCount <= 0) {
      console.log('Cannot place stamp:', { selectedStamp, userStampCount });
      return;
    }

    const stampArea = document.getElementById("stamping-area");
    if (!stampArea) {
      console.log('Stamp area not found');
      return;
    }
    
    // get the click coordinates relative to the stamping area
    const rect = stampArea.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

          // clamp the coordinates so the stamp is always fully visible (increase top margin to avoid nav)
      x = clamp(x, 3, 95);
      y = clamp(y, 15, 95);

    // check if the click is within the stamping area bounds
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      console.log('Click outside stamping area bounds');
      return;
    }
    
    const rotation = Math.random() * 30 - 15;

    const newStamp: Stamp = {
      id: crypto.randomUUID(),
      type: selectedStamp,
      x: `${x}%`,
      y: `${y}%`,
      rotation,
      user: userId,
      userIdentity: selectedIdentity || undefined,
      timestamp: new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }).replace(/\//g, '.'),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/stamps`, {
        method: "POST",
        credentials: 'include', // important for authentication
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStamp),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Stamp limit reached') {
          // stamp limit reached
          console.log('You have reached your stamp limit!');
          return;
        }
        throw new Error(data.error || 'Failed to save stamp');
      }

      // global limit reached, refresh stamps
      if (data.message === 'Stamp limit reached, all stamps cleared') {
        setStamps([]);
        setUserStampCount(100);
        return;
      }

      // get updated stamps from server
      const stampsResponse = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/stamps`, {
        credentials: 'include', // important for authentication
      });
      if (stampsResponse.ok) {
        const updatedStamps: Stamp[] = await stampsResponse.json();
        setStamps(updatedStamps);
        const userCount = updatedStamps.filter((s) => s.user === userId).length;
        setUserStampCount(100 - userCount);
      }
    } catch (error) {
      console.error("Failed to save stamp:", error);
      alert('Failed to place stamp. Please try again.');
    }
  };

  // clear the stamps
  const clearStamps = useCallback(async () => {
    if (!userId) {
      console.log('No userId available');
      return;
    }

    try {
      console.log('Attempting to clear stamps for user:', userId);
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/stamps/clear`, {
        method: "POST",
        credentials: 'include', // important for authentication
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });

      console.log('Server response status:', response.status);
      const data = await response.json().catch(e => ({ error: 'No JSON response' }));
      console.log('Server response data:', data);

      if (!response.ok) {
        throw new Error(`Failed to clear stamps: ${data.error || response.statusText}`);
      }

      // update local state to remove user's stamps
      const otherUsersStamps = stamps.filter(stamp => stamp.user !== userId);
      setStamps(otherUsersStamps);
      setUserStampCount(100);
    } catch (error) {
      console.error("Failed to clear stamps:", error);
      alert('Failed to clear stamps. Please try again.');
    }
  }, [stamps, userId]);

  // dock items
  const dockItems = [
    // role selector icon - shows selected role or default skills icon
    {
      icon: selectedIdentity ? (
        <img src={getIconForIdentity(selectedIdentity)} alt={selectedIdentity} className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
      ) : (
        <img src="/skills.png" alt="Choose role" className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
      ),
      label: selectedIdentity ? `Role: ${selectedIdentity}` : "Choose role",
      onClick: () => setShowChips((prev) => !prev),
      type: "pencil",
      style: { padding: 0, borderRadius: 0 }
    },
    ...(Object.keys(stampIcons) as StampType[]).map((type) => ({
      icon: (
        <div style={{ borderRadius: "50%", padding: 4 }} title={`${type} Stamp`}>
          {stampIcons[type]}
        </div>
      ),
      label: type === "gold" ? "Star" : 
             type === "silver" ? "Heart" : 
             type === "bronze" ? "Smile" : 
             "Cat",
      onClick: () => setSelectedStamp((current) => (current === type ? null : type)),
      selected: selectedStamp === type,
      type,
    })),
    {
      icon: <img src="/trashcan.png" alt="Clear stamps" className="w-6 h-6" style={{ width: '24px', height: '24px' }} />,
      label: "Clear my stamps",
      onClick: () => {
        clearStamps();
      },
      type: "trash",
      style: { padding: 0, borderRadius: 0 }
    },
  ];

  return (
    <>
      {/* grid bg */}
      <div 
        id="stamping-area"
        onClick={handlePlaceStamp}
        className={`fixed inset-0 z-0 ${className}`}
        style={{ 
          cursor: selectedStamp ? "url('/stamping.png'), auto" : "url('/cursor.png'), auto",
          pointerEvents: selectedStamp ? "auto" : "none",
        }}
      >
        {stamps.map((stamp) => (
          <div key={stamp.id}>
            {/* rotated stamp */}
            <div
              style={{
                position: "absolute",
                left: stamp.x,
                top: stamp.y,
                transform: `translate(-50%, -50%) rotate(${stamp.rotation}deg)`,
                zIndex: 31,
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                transition: "transform 0.05s ease-out",
                pointerEvents: "none"
              }}
              className=""
            >
              {stampIcons[stamp.type]}
            </div>
            {/* non-rotated label */}
            <div
              style={{
                position: "absolute",
                left: stamp.x,
                top: `calc(${stamp.y} + 45px)`,
                transform: "translate(-50%, -50%)",
                zIndex: 31,
                pointerEvents: "none"
              }}
            >
              <div
                className="px-1 pb-0.5 rounded text-white text-xs font-digi shadow-lg"
                style={{
                  backgroundColor: "#0d0d0d",
                  fontFamily: 'inherit',
                  whiteSpace: "nowrap",
                  opacity: 1,
                  paddingTop: "2px"
                }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    {stamp.userIdentity && (
                      <img 
                        src={getIconForIdentity(stamp.userIdentity)}
                        alt={stamp.userIdentity}
                        className="w-4 h-4"
                      />
                    )}
                    <img 
                      src={isAM() ? "/sun.png" : "/moon.png"} 
                      alt={isAM() ? "Sun" : "Moon"} 
                      className="w-4 h-4" 
                    />
                  </div>
                  <span className="text-white/60 font-digi text-xs" style={{ fontFamily: 'inherit', fontSize: '8px' }}>
                    {stamp.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* identity chips above the dock */}
      {showChips && (
        <>
          {/* overlay to close chips when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowChips(false)}
            style={{ background: 'transparent' }}
          />
          <div className="fixed left-1/2 bottom-24 transform -translate-x-1/2 z-50">
            <IdentityChips selectedIdentity={selectedIdentity} onIdentitySelect={(identity) => { handleIdentityChange(identity); setShowChips(false); }} />
          </div>
        </>
      )}

      {/* role selection prompt */}
      {!selectedIdentity && !hasPromptBeenDismissed && (
        <div className="fixed left-1/2 bottom-16 transform -translate-x-1/2 z-60 pointer-events-auto hidden sm:flex">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-lg">
            <img src="/down.png" alt="Down arrow" />
            <span className="text-white text-sm digi-font" style={{ fontSize: '16x' }}>
              add to my stampfolio :D
            </span>
          </div>
        </div>
      )}

      {/* dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none hidden md:block">
        <div 
          className="pointer-events-auto"
          onMouseEnter={() => {
            setIsDockHovered(true);
            if (!hasPromptBeenDismissed) {
              setHasPromptBeenDismissed(true);
              localStorage.setItem('hasPromptBeenDismissed', 'true');
            }
          }}
          onMouseLeave={() => setIsDockHovered(false)}
        >
          <Dock 
            items={dockItems}
            selectedStamp={selectedStamp}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>

    </>
  );
} 