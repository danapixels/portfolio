import { useState, useCallback, useEffect } from "react";
import Dock from "./Dock";
import type { DockItemData } from "./Dock";
import { stampIcons } from "./stampIcons";
import type { StampType, UserIdentity } from "./types";
import IdentityChips from "./IdentityChips";

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

type Stamp = {
  id: string;
  type: StampType;
  x: string;
  y: string;
  rotation: number;
  user: string;
  userIdentity?: UserIdentity;
};

interface StampingAreaProps {
  className?: string;
  selectedIdentity?: UserIdentity | null;
}

export default function StampingArea({ className = "", selectedIdentity: _selectedIdentity = null }: StampingAreaProps) {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [userId, setUserId] = useState("");
  const [userStampCount, setUserStampCount] = useState(100);
  const [selectedStamp, setSelectedStamp] = useState<StampType | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [showChips, setShowChips] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity | null>(_selectedIdentity);

  useEffect(() => {
    const id = localStorage.getItem("userId") || crypto.randomUUID();
    localStorage.setItem("userId", id);
    setUserId(id);

    // Update timestamp
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

    // Function to fetch stamps
    const fetchStamps = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/stamps");
        if (!response.ok) {
          throw new Error('Failed to fetch stamps');
        }
        const data: Stamp[] = await response.json();
        setStamps(data);
        // Only count stamps for the current user
        const userCount = data.filter((s) => s.user === id).length;
        setUserStampCount(100 - userCount);
      } catch (error) {
        console.error('Error fetching stamps:', error);
      }
    };

    // Initial fetch
    fetchStamps();

    // Set up polling to fetch new stamps every 2 seconds
    const interval = setInterval(fetchStamps, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const isAM = () => {
    const now = new Date();
    return now.getHours() < 12;
  };

  const getStampTitle = (stamp: Stamp) => {
    let title = stamp.userIdentity ? stamp.userIdentity : (stamp.user === userId ? "" : "Other user's stamp");
    
    // Add timestamp for ALL stamps
    title += `\n${currentTime}`;
    
    return title;
  };

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

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
    
    // Get the click coordinates relative to the stamping area
    const rect = stampArea.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp the coordinates so the stamp is always fully visible
    x = clamp(x, 3, 97);
    y = clamp(y, 3, 97);

    // Check if the click is within the stamping area bounds
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
    };

    try {
      const response = await fetch("http://localhost:3001/api/stamps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStamp),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Stamp limit reached') {
          alert('You have reached your stamp limit!');
          return;
        }
        throw new Error(data.error || 'Failed to save stamp');
      }

      // If we get a message about the global limit being reached, refresh stamps
      if (data.message === 'Stamp limit reached, all stamps cleared') {
        setStamps([]);
        setUserStampCount(100);
        return;
      }

      // Immediately fetch updated stamps from server
      const stampsResponse = await fetch("http://localhost:3001/api/stamps");
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

  const clearStamps = useCallback(async () => {
    if (!userId) {
      console.log('No userId available');
      return;
    }

    try {
      console.log('Attempting to clear stamps for user:', userId);
      const response = await fetch('http://localhost:3001/api/stamps/clear', {
        method: "POST",
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

      // Update local state to remove user's stamps
      const otherUsersStamps = stamps.filter(stamp => stamp.user !== userId);
      setStamps(otherUsersStamps);
      setUserStampCount(100);
    } catch (error) {
      console.error("Failed to clear stamps:", error);
      alert('Failed to clear stamps. Please try again.');
    }
  }, [stamps, userId]);

  const dockItems = [
    // Pencil icon for role chips
    {
      icon: <img src="/skills.png" alt="Edit role" className="w-6 h-6" style={{ width: '24px', height: '24px' }} />,
      label: "Choose role",
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
      {/* Grid Background - This will be our stamping area */}
      <div 
        id="stamping-area"
        onClick={handlePlaceStamp}
        className={`fixed inset-0 z-0 ${className}`}
        style={{ 
          cursor: selectedStamp ? "crosshair" : "default",
          pointerEvents: selectedStamp ? "auto" : "none",
          // backgroundColor: "#111111",
          // backgroundImage: "linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)",
          // backgroundSize: "32px 32px",
        }}
      >
        {stamps.map((stamp) => (
          <div key={stamp.id}>
            {/* Rotated stamp */}
            <div
              style={{
                position: "absolute",
                left: stamp.x,
                top: stamp.y,
                transform: `translate(-50%, -50%) rotate(${stamp.rotation}deg)`,
                zIndex: 31,
                filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                transition: "transform 0.05s ease-out",
                pointerEvents: "auto"
              }}
              className=""
              onClick={(e) => e.stopPropagation()}
            >
              {stampIcons[stamp.type]}
            </div>
            {/* Non-rotated label */}
            <div
              style={{
                position: "absolute",
                left: stamp.x,
                top: `calc(${stamp.y} + 40px)`,
                transform: "translate(-50%, -50%)",
                zIndex: 31,
                pointerEvents: "none"
              }}
            >
              <div
                className="px-1 pb-0.5 rounded text-white text-xs font-digi shadow-lg"
                style={{
                  backgroundColor: "#0d0d0d",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontFamily: "'Pixelify Sans', sans-serif",
                  whiteSpace: "nowrap",
                  opacity: 0.5,
                  paddingTop: "2px"
                }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    {stamp.userIdentity ? (
                      <img 
                        src={getIconForIdentity(stamp.userIdentity)}
                        alt={stamp.userIdentity}
                        className="w-4 h-4"
                      />
                    ) : (
                      <span>{stamp.user === userId ? "" : "Other user's stamp"}</span>
                    )}
                    <img 
                      src={isAM() ? "/sun.png" : "/moon.png"} 
                      alt={isAM() ? "Sun" : "Moon"} 
                      className="w-4 h-4" 
                    />
                  </div>
                  <span className="text-white/60 font-digi text-xs" style={{ fontFamily: "'Pixelify Sans', sans-serif", fontSize: '8px' }}>
                    {currentTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chips above the dock */}
      {showChips && (
        <>
          {/* Overlay to close chips when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowChips(false)}
            style={{ background: 'transparent' }}
          />
          <div className="fixed left-1/2 bottom-24 transform -translate-x-1/2 z-50">
            <IdentityChips selectedIdentity={selectedIdentity} onIdentitySelect={(identity) => { setSelectedIdentity(identity); setShowChips(false); }} />
          </div>
        </>
      )}

      {/* Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={dockItems}
            selectedStamp={selectedStamp}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      </div>

      {/* Removed x stamps left display */}
    </>
  );
} 