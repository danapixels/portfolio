import { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import Dock from "./components/Dock";
import type { DockItemData } from "./components/Dock";
import { stampIcons } from "./components/stampIcons";
import "./index.css";
import { motion } from "framer-motion";
import ToggleSwitch from "./components/ToggleSwitch";
import TypewriterText from "./components/TypewriterText";
import About from "./About";
import Project from "./Project";
import StampingArea from "./components/StampingArea";
import NavLinks from "./components/NavLinks";

// Add keyframes for the drop-in animation
const styles = `
  @keyframes dropIn {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-drop-in {
    animation: dropIn 0.8s ease-out forwards;
  }

  @keyframes typing {
    from { 
      width: 0;
      padding-right: 0;
    }
    to { 
      width: 100%;
      padding-right: 2px;
    }
  }

  @keyframes blink {
    50% { border-color: transparent }
  }

  .work-text, .play-text {
    display: inline-block;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    width: 0;
    animation: 
      typing 2s steps(40, end) forwards,
      blink .75s step-end infinite;
  }

  .work-text::after, .play-text::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: white;
    animation: blink .75s step-end infinite;
  }
`;

type StampType = "gold" | "silver" | "bronze" | "diamond";

type Stamp = {
  id: string;
  type: StampType;
  x: string;
  y: string;
  rotation: number;
  user: string;
};

export default function App() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [userId, setUserId] = useState("");
  const [userStampCount, setUserStampCount] = useState(10);
  const [selectedStamp, setSelectedStamp] = useState<StampType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWorkHours, setIsWorkHours] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

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
        console.log('Fetched stamps:', data); // Debug log
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
      console.log('Cannot place stamp:', { selectedStamp, userStampCount }); // Debug log
      return;
    }

    const stampArea = document.getElementById("stamping-area");
    if (!stampArea) {
      console.log('Stamp area not found'); // Debug log
      return;
    }
    
    // Get the click coordinates relative to the stamping area
    const rect = stampArea.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if the click is within the stamping area bounds
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      console.log('Click outside stamping area bounds'); // Debug log
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

    console.log('Attempting to place stamp:', newStamp); // Debug log

    try {
      // Send to server first
      const response = await fetch("http://localhost:3001/api/stamps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStamp),
      });

      const data = await response.json();
      console.log('Server response:', data); // Debug log

      if (!response.ok) {
        if (data.error === 'Stamp limit reached') {
          alert('You have reached your stamp limit!');
          return;
        }
        throw new Error(data.error || 'Failed to save stamp');
      }

      // Immediately fetch updated stamps from server
      const stampsResponse = await fetch("http://localhost:3001/api/stamps");
      if (stampsResponse.ok) {
        const updatedStamps: Stamp[] = await stampsResponse.json();
        console.log('Updated stamps from server:', updatedStamps); // Debug log
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
      // Clear user's stamps using POST request
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
      console.log('Updating local state with stamps:', otherUsersStamps);
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
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route path="/" element={
          <>
            <style>{styles}</style>
            <div 
              className="min-h-screen text-white flex flex-col items-center px-4 relative overflow-hidden"
              style={{
                backgroundColor: "#111111",
                backgroundImage: "linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            >
              {/* Add StampingArea component */}
              <StampingArea />

              {/* Header */}
              <header className="w-full z-50 pointer-events-none">
                <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
                  <div className="flex items-center pointer-events-auto">
                    <a href="/" className="block">
                      <img 
                        src="/logo.png" 
                        alt="Dana Logo" 
                        className="h-8 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </a>
                  </div>
                  <nav className="pointer-events-auto">
                    <NavLinks />
                  </nav>
                </div>
              </header>

              {/* Main content container */}
              <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-center z-10 px-4 min-h-[calc(100vh-200px)] relative">
                {/* Content containers */}
                <div
                  className="bg-[#0d0d0d] rounded-2xl shadow-2xl flex-1 flex flex-col items-center w-full lg:w-[400px] animate-drop-in relative"
                  style={{ backdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.05)" }}
                >
                  <div className="w-full flex flex-col items-center">
                    <img 
                      src="/border.png" 
                      alt="Top border" 
                      className="w-auto h-auto mb-8 mt-8"
                    />
                    <div className="w-full px-6 sm:px-10">
                      <section className="w-full flex flex-col items-center space-y-6">
                        <div className="text-center space-y-6">
                          <div className="flex flex-col space-y-4 mb-6">
                            <motion.div
                              className="text-xl font-light"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
                            >
                              <TypewriterText text={isDarkMode ? "Frontend Developer & UI/UX Enthusiast" : "Creative Engineer & Data Visualization Specialist"} />
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="flex justify-center"
                            >
                              <ToggleSwitch
                                isOn={isDarkMode}
                                handleToggle={() => setIsDarkMode(!isDarkMode)}
                              />
                            </motion.div>
                          </div>
                          <motion.div
                            className="bg-[#111111] p-6 rounded-lg border border-white/5 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                          >
                            <p className="text-white text-lg leading-relaxed">
                              I created an interactive stamp board for everyone visitng my portfolio. Feel free to stamp wherever you want! But you only get 10 stamps. The trash can helps you clear all your stamps if you want.
                            </p>
                          </motion.div>
                        </div>
                      </section>
                    </div>
                    <img 
                      src="/border.png" 
                      alt="Bottom border" 
                      className="w-auto h-auto mt-8 mb-8"
                      style={{ transform: 'rotate(180deg)' }}
                    />
                  </div>
                </div>

                {/* Projects Section */}
                <div className="w-full lg:w-[400px] space-y-4 animate-drop-in relative z-10">
                  <div className="bg-[#0d0d0d] rounded-2xl shadow-2xl p-6 backdrop-blur-md border border-white/5">
                    <div className="space-y-4">
                      <Link 
                        to="/project" 
                        className="block p-4 bg-[#111111] rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5 text-left"
                      >
                        <div className="flex gap-4 items-start">
                          <img 
                            src="https://via.placeholder.com/80" 
                            alt="Project One" 
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-semibold mb-2 text-white">Project One</h3>
                            <p className="text-white/80 text-left">A brief description of your first project. What technologies did you use? What problems did it solve?</p>
                          </div>
                        </div>
                      </Link>
                      
                      <a 
                        href="https://github.com/yourusername/project2" 
                        className="block p-4 bg-[#111111] rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5 text-left"
                      >
                        <div className="flex gap-4 items-start">
                          <img 
                            src="https://via.placeholder.com/80" 
                            alt="Project Two" 
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-semibold mb-2 text-white">Project Two</h3>
                            <p className="text-white/80 text-left">Description of your second project. Highlight the key features and your role in development.</p>
                          </div>
                        </div>
                      </a>
                      
                      <a 
                        href="https://github.com/yourusername/project3" 
                        className="block p-4 bg-[#111111] rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5 text-left"
                      >
                        <div className="flex gap-4 items-start">
                          <img 
                            src="https://via.placeholder.com/80" 
                            alt="Project Three" 
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-semibold mb-2 text-white">Project Three</h3>
                            <p className="text-white/80 text-left">Details about your third project. What makes it unique? What challenges did you overcome?</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
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

              <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-white font-semibold pointer-events-none z-50" style={{ fontFamily: "'Pixelify Sans', sans-serif", fontSize: '16px', backgroundColor: 'rgba(17, 17, 17, 0.5)' }}>
                {userStampCount} stamps left
              </div>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}