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

const NavLinks = () => (
  <nav className="flex space-x-6">
    <Link
      to="/about"
      className="text-white hover:text-white/80 transition-colors"
      style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
    >
      About
    </Link>
  </nav>
);

export default function App() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [userId, setUserId] = useState("");
  const [userStampCount, setUserStampCount] = useState(10);
  const [selectedStamp, setSelectedStamp] = useState<StampType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWorkHours, setIsWorkHours] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId") || crypto.randomUUID();
    localStorage.setItem("userId", id);
    setUserId(id);

    fetch("http://localhost:3001/api/stamps")
      .then((res) => res.json())
      .then((data: Stamp[]) => {
        setStamps(data);
        const userCount = data.filter((s) => s.user === id).length;
        setUserStampCount(10 - userCount);
      })
      .catch(console.error);
  }, []);

  const handlePlaceStamp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStamp || userStampCount <= 0) return;

    const stampArea = document.getElementById("stamping-area");
    if (!stampArea) return;
    
    const rect = stampArea.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const rotation = Math.random() * 30 - 15;

    const newStamp: Stamp = {
      id: crypto.randomUUID(),
      type: selectedStamp,
      x: `${x}%`,
      y: `${y}%`,
      rotation,
      user: userId,
    };

    setStamps((prev) => [...prev, newStamp]);
    setUserStampCount((prev) => prev - 1);
  };

  const clearStamps = useCallback(() => {
    if (!userId) return;

    const otherUsersStamps = stamps.filter(stamp => stamp.user !== userId);
    const myStampsCount = stamps.filter(stamp => stamp.user === userId).length;
    
    setStamps(otherUsersStamps);
    setUserStampCount(10);

    fetch(`http://localhost:3001/api/stamps/user/${userId}`, { method: "DELETE" })
      .catch((error) => {
        console.error("Failed to clear user stamps on server:", error);
      });
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
              {/* Header */}
              <header className="w-full z-50">
                <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <a href="/" className="block">
                      <img 
                        src="/logo.png" 
                        alt="Dana Logo" 
                        className="h-8 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </a>
                  </div>
                  <nav>
                    <NavLinks />
                  </nav>
                </div>
              </header>

              {/* Main content container */}
              <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-center z-20 px-4 min-h-[calc(100vh-200px)]">
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
                <div className="w-full lg:w-[400px] space-y-4 animate-drop-in">
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
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <Dock 
                  items={dockItems}
                  selectedStamp={selectedStamp}
                  panelHeight={68}
                  baseItemSize={50}
                  magnification={70}
                />
              </div>

              {/* Stamp Board */}
              <div 
                id="stamping-area"
                onClick={handlePlaceStamp}
                className="fixed inset-0 z-10"
                style={{ cursor: selectedStamp ? "crosshair" : "default" }}
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
                      zIndex: 20,
                      filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                      transition: "transform 0.2s ease-out",
                    }}
                    className="hover:scale-110"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {stampIcons[stamp.type]}
                  </div>
                ))}
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