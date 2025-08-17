import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ToggleSwitch from "./components/ToggleSwitch";
import { Link } from "react-router-dom";
import StampingArea from "./components/StampingArea";
import NavLinks from "./components/NavLinks";
import type { UserIdentity } from "./components/types";


// animation for page drop-in
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
  const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity | null>(null);

  // load saved identity from localStorage
  useEffect(() => {
    const savedIdentity = localStorage.getItem("userIdentity") as UserIdentity | null;
    if (savedIdentity) {
      setSelectedIdentity(savedIdentity);
    }

    // listen for changes to localStorage from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userIdentity') {
        const newIdentity = e.newValue as UserIdentity | null;
        setSelectedIdentity(newIdentity);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleIdentitySelect = (identity: UserIdentity | null) => {
    setSelectedIdentity(identity);
    if (identity) {
      localStorage.setItem("userIdentity", identity);
    } else {
      localStorage.removeItem("userIdentity");
    }
  };
  // content for dark mode
  const darkModeContent = {
    title: "i am a senior product designer.",
    description1: "6 years @ IBM iX.\nimproving data visibility with Google \ncreating concepts from the ambiguous.",
    skills: [
      "pushing boundaries",
      "team-focused", 
      "always learning",
      "user-driven",
      "complex systems",
    ],
    contact: [
      "Email: your.email@example.com",
      "GitHub: github.com/yourusername", 
      "LinkedIn: linkedin.com/in/yourusername"
    ]
  };

  // content for light mode
  const lightModeContent = {
    title: "i am chronically online.",
    description1: "Pro-open-source. \n Making silly websites. \n Watching YT videos.",
    skills: [
      "indie games",
      "making anything",
      "reading",
      "blogging",
      "talking to my cats",
    ],
    contact: [
      "Email: your.email@example.com",
      "GitHub: github.com/yourusername",
      "LinkedIn: linkedin.com/in/yourusername"
    ]
  };

  // current content based on dark or light mode
  const currentContent = isDarkMode ? darkModeContent : lightModeContent;

  // return the about page
  return (
    <>
      <style>{styles}</style>
      <div 
        className="min-h-screen text-white flex flex-col items-center px-4 relative overflow-hidden font-sans"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "linear-gradient(#0f0f0f 1px, transparent 1px), linear-gradient(90deg, #0f0f0f 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {/* stamping area*/}
        <div className="hidden md:block">
          <StampingArea selectedIdentity={selectedIdentity} onIdentitySelect={handleIdentitySelect} />
        </div>

        {/* header */}
        <header className="w-full z-50">
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

        {/* main content container */}
        <div className="max-w-screen-xl mx-auto flex items-center justify-center z-10 px-4 min-h-[calc(100vh-200px)] pb-32 pointer-events-none">
          <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-4 w-full max-w-6xl">
            <div
              className="bg-[#0a0a0a] rounded-2xl flex flex-col items-center w-full lg:w-[520px] max-w-xl animate-drop-in relative pointer-events-auto"
            >
              <div className="w-full flex flex-col items-center pointer-events-auto">
                <img 
                  src="/border.png" 
                  alt="Top border" 
                  className="w-auto h-auto mb-4 mt-4 pointer-events-none"
                />
                <div className="w-full px-3 sm:px-6 pointer-events-auto">
                  <section className="w-full flex flex-col items-center space-y-3 pointer-events-auto">
                    <div className="text-center space-y-6 pointer-events-auto">
                      <div className="flex flex-col space-y-4 mb-6 pointer-events-auto">
                        <motion.div
                          className="text-xl font-light font-digi pointer-events-auto"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <div className="pointer-events-auto">{currentContent.title}</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="flex justify-center pointer-events-auto"
                        >
                          <ToggleSwitch
                            isOn={isDarkMode}
                            handleToggle={() => setIsDarkMode(!isDarkMode)}
                            className="pointer-events-auto"
                          />
                        </motion.div>
                      </div>
                      <motion.div
                        className="p-6 rounded-lg text-center space-y-2 pointer-events-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <div className="flex justify-center mb-6 pointer-events-auto">
                          <img 
                            src={isDarkMode ? "/mainport.png" : "/portrait.png"}
                            alt="Portfolio Image"
                            className="rounded-lg pointer-events-none"
                          />
                        </div>
                        <p className="text-white text-sm leading-relaxed font-digi whitespace-pre-line pointer-events-auto">
                          {currentContent.description1}
                        </p>
                      </motion.div>
                    </div>
                  </section>
                </div>
                <img 
                  src="/border.png" 
                  alt="Bottom border" 
                  className="w-auto h-auto mt-4 mb-4 pointer-events-none"
                  style={{ transform: 'rotate(180deg)' }}
                />
              </div>
            </div>
            
            {/* 2 containers outside of main container */}
            <div className="space-y-4 flex-shrink-0 w-full lg:w-auto pointer-events-auto">
              <div className="bg-[#0a0a0a] p-4 rounded-2xl w-full lg:w-50 animate-drop-in font-sans pointer-events-auto">
                <div className="flex items-center mb-2 pointer-events-auto">
                  <img src="/skills.png" alt="Skills" className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold font-digi text-left pointer-events-auto">{isDarkMode ? "design values" : "hobbies"}</h3>
                </div>
                <ul className="text-white space-y-2 flex flex-col min-h-[120px] font-sans pointer-events-auto">
                  {currentContent.skills.map((skill, index) => (
                    <li key={index} className="text-sm flex items-start pointer-events-auto">
                      <img src="/sparkle.png" alt="sparkle" className="mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-left pointer-events-auto">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0a0a0a] p-4 rounded-2xl flex flex-col min-h-[120px] w-full lg:w-50 animate-drop-in font-sans pointer-events-auto">
                <div className="flex items-center mb-2 pointer-events-auto">
                  <img src="/emailicon.png" alt="Contact" className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold font-digi text-left pointer-events-auto">contact</h3>
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-center font-sans pointer-events-auto">
                  <a 
                    href="https://www.linkedin.com/in/dananyc/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity pointer-events-auto"
                  >
                    <img src="/linkedin.png" alt="LinkedIn" className="w-8 h-8" />
                    <span className="text-sm pointer-events-auto">/danaespine</span>
                  </a>
                  <a 
                    href="https://github.com/danapixels" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity pointer-events-auto"
                  >
                    <img src="/github.png" alt="GitHub" className="w-8 h-8" />
                    <span className="text-sm pointer-events-auto">/danapixels</span>
                  </a>
                  <a 
                    href="mailto:hi@dana.nyc"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity pointer-events-auto"
                  >
                    <img src="/email.png" alt="Email" className="w-8 h-8" />
                    <span className="text-sm pointer-events-auto">hi@dana.nyc</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 