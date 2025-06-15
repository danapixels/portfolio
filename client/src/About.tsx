import { motion } from "framer-motion";
import { useState } from "react";
import ToggleSwitch from "./components/ToggleSwitch";
import TypewriterText from "./components/TypewriterText";
import { Link } from "react-router-dom";
import StampingArea from "./components/StampingArea";
import NavLinks from "./components/NavLinks";

// Reuse the same styles from App.tsx
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

export default function About() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
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
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center z-20 px-4 min-h-[calc(100vh-200px)]">
          <div
            className="bg-[#0d0d0d] rounded-2xl shadow-2xl flex-1 flex flex-col items-center w-full max-w-2xl animate-drop-in relative"
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
                      className="bg-[#111111] p-6 rounded-lg border border-white/5 text-center space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>About Me</h2>
                      <p className="text-white text-lg leading-relaxed">
                        I'm a passionate developer with a keen eye for design and a love for creating intuitive user experiences. 
                        With expertise in frontend development and data visualization, I strive to build applications that are both 
                        beautiful and functional.
                      </p>
                      <p className="text-white text-lg leading-relaxed">
                        When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
                        or sharing my knowledge through technical writing and mentoring.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-[#0d0d0d] p-4 rounded-lg border border-white/5">
                          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>Skills</h3>
                          <ul className="text-white/80 space-y-2">
                            <li>React & TypeScript</li>
                            <li>Data Visualization</li>
                            <li>UI/UX Design</li>
                            <li>Responsive Web Design</li>
                          </ul>
                        </div>
                        <div className="bg-[#0d0d0d] p-4 rounded-lg border border-white/5">
                          <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>Contact</h3>
                          <ul className="text-white/80 space-y-2">
                            <li>Email: your.email@example.com</li>
                            <li>GitHub: github.com/yourusername</li>
                            <li>LinkedIn: linkedin.com/in/yourusername</li>
                          </ul>
                        </div>
                      </div>
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
        </div>
      </div>
    </>
  );
} 