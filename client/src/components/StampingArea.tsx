import { useState, useCallback, useEffect } from "react";
import Dock from "./Dock";
import type { DockItemData } from "./Dock";
import { stampIcons } from "./stampIcons";
import type { StampType } from "./types";

type Stamp = {
  id: string;
  type: StampType;
  x: string;
  y: string;
  rotation: number;
  user: string;
};

interface StampingAreaProps {
  className?: string;
}

export default function StampingArea({ className = "" }: StampingAreaProps) {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [userId, setUserId] = useState("");
  const [userStampCount, setUserStampCount] = useState(10);
  const [selectedStamp, setSelectedStamp] = useState<StampType | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId") || crypto.randomUUID();
    localStorage.setItem("userId", id);
    setUserId(id);

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
        setUserStampCount(10 - userCount);
      } catch (error) {
        console.error('Error fetching stamps:', error);
      }
    };

    // Initial fetch
    fetchStamps();

    // Set up polling to fetch new stamps every 2 seconds
    const interval = setInterval(fetchStamps, 2000);

    return () => clearInterval(interval);
  }, []);

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
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

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
        setUserStampCount(10);
        return;
      }

      // Immediately fetch updated stamps from server
      const stampsResponse = await fetch("http://localhost:3001/api/stamps");
      if (stampsResponse.ok) {
        const updatedStamps: Stamp[] = await stampsResponse.json();
        setStamps(updatedStamps);
        const userCount = updatedStamps.filter((s) => s.user === userId).length;
        setUserStampCount(10 - userCount);
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
      setUserStampCount(10);
    } catch (error) {
      console.error("Failed to clear stamps:", error);
      alert('Failed to clear stamps. Please try again.');
    }
  }, [stamps, userId]);

  const dockItems = [
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
          backgroundColor: "#111111",
          backgroundImage: "linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            style={{
              position: "absolute",
              left: stamp.x,
              top: stamp.y,
              transform: `translate(-50%, -50%) rotate(${stamp.rotation}deg)`,
              cursor: "pointer",
              zIndex: 31,
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
              transition: "transform 0.2s ease-out",
              pointerEvents: "auto"
            }}
            className="hover:scale-110"
            onClick={(e) => e.stopPropagation()}
            title={stamp.user === userId ? "Your stamp" : "Other user's stamp"}
          >
            {stampIcons[stamp.type]}
          </div>
        ))}
      </div>

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

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-white font-semibold pointer-events-none z-40" style={{ fontFamily: "'Pixelify Sans', sans-serif", fontSize: '16px', backgroundColor: 'rgba(17, 17, 17, 0.5)' }}>
        {userStampCount} stamps left
      </div>
    </>
  );
} 