import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import { motion } from "framer-motion";
import ToggleSwitch from "./components/ToggleSwitch";
import TypewriterText from "./components/TypewriterText";
import About from "./About";
import CoreData from "./projects/CoreData";
import StampingArea from "./components/StampingArea";
import NavLinks from "./components/NavLinks";
import IdentityChips from "./components/IdentityChips";
import type { UserIdentity } from "./components/types";
import Firebase from "./projects/Firebase";

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



export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWorkHours, setIsWorkHours] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity | null>(null);
  const [hasAnimatedTexts, setHasAnimatedTexts] = useState<{ dark: boolean; light: boolean }>({ dark: false, light: false });

  // Load saved identity from localStorage
  useEffect(() => {
    const savedIdentity = localStorage.getItem("userIdentity") as UserIdentity | null;
    if (savedIdentity) {
      setSelectedIdentity(savedIdentity);
    }
  }, []);

  const handleIdentitySelect = (identity: UserIdentity | null) => {
    setSelectedIdentity(identity);
    if (identity) {
      localStorage.setItem("userIdentity", identity);
    } else {
      localStorage.removeItem("userIdentity");
    }
  };

  const darkModeText = "I'm Dana Espine (: A Senior Product Designer at IBM iX. My UX niche is engineering, data, AI, and advocating for designers.";
  const lightModeText = "UI/UX open-source advocate, afker, owner of 2 cats, pixel art lover, non-verbal interaction enthusiast, and indie game supporter.";

  const currentKey = isDarkMode ? 'dark' : 'light';
  const currentText = isDarkMode ? darkModeText : lightModeText;

  const handleTextAnimationComplete = () => {
    setHasAnimatedTexts(prev => ({ ...prev, [currentKey]: true }));
  };


  const projects = isDarkMode ? [
    {
      title: "Google Core Data",
      description: "designing a way for Googlers to better understand their data",
      image: "/google.png",
      link: "/project"
    },
    {
      title: "Google Firebase",
      description: "creating a better way for developers to monitor their apps",
      image: "/firebase.png",
      link: "/firebase"
    },
    {
      title: "Chevron",
      description: "helping employees reduce and understand risk",
      image: "/chevron.png",
      link: "https://github.com/yourusername/project3"
    }
  ] : [
    {
      title: "iamafk",
      description: "a place for your cursor to rest with your friends",
      image: "/iamafk.png",
      link: "/project"
    },
    {
      title: "Digi garden",
      description: "a place for my thoughts and writing",
      image: "/digi.png",
      link: "https://github.com/yourusername/project4"
    },
    {
      title: "Digi font",
      description: "my open-source lowercase pixel font",
      image: "/font.png",
      link: "https://github.com/yourusername/project5"
    }
  ];

  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<CoreData />} />
        <Route path="/firebase" element={<Firebase />} />
        <Route path="/" element={
          <>
            <style>{styles}</style>
            <div 
              className="min-h-screen text-white flex flex-col items-center px-4 relative overflow-hidden"
              style={{
                backgroundColor: "#0a0a0a",
                backgroundImage: "linear-gradient(#0f0f0f 1px, transparent 1px), linear-gradient(90deg, #0f0f0f 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            >
              {/* Add StampingArea component */}
              <StampingArea selectedIdentity={selectedIdentity} />

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
              <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-center z-10 px-4 min-h-[calc(100vh-200px)] relative pb-32 pointer-events-none">
                {/* Content containers */}
                <div
                  className="bg-[#0d0d0d] rounded-2xl shadow-2xl flex-1 flex flex-col items-center w-full lg:w-[400px] animate-drop-in relative pointer-events-auto"
                  style={{ backdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.05)" }}
                >
                  <div className="w-full flex flex-col items-center pointer-events-auto">
                    <img 
                      src="/border.png" 
                      alt="Top border" 
                      className="w-auto h-auto mb-6 mt-6 pointer-events-none"
                    />
                    <div className="w-full px-2 sm:px-4 pointer-events-auto">
                      <section className="w-full flex flex-col items-center space-y-6 pointer-events-auto">
                        <div className="text-center space-y-6 pointer-events-auto">
                          <div className="flex flex-col space-y-4 mb-6 pointer-events-auto">
                            <motion.div
                              className="text-xl font-light pointer-events-auto"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
                            >
                              <div className="font-digi pointer-events-auto">
                                <TypewriterText 
                                  text={currentText} 
                                  onComplete={handleTextAnimationComplete}
                                  isAnimated={!hasAnimatedTexts[currentKey]}
                                />
                              </div>
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
                              />
                            </motion.div>
                          </div>
                        </div>
                      </section>
                    </div>
                    <img 
                      src="/border.png" 
                      alt="Bottom border" 
                      className="w-auto h-auto mt-6 mb-6 pointer-events-none"
                      style={{ transform: 'rotate(180deg)' }}
                    />
                  </div>
                </div>

                {/* Projects Section */}
                <div className="w-full lg:w-[400px] space-y-4 animate-drop-in relative z-10 pointer-events-auto">
                  <div className="bg-[#0d0d0d] rounded-2xl shadow-2xl p-6 backdrop-blur-md border border-white/5 pointer-events-auto">
                    <div className="space-y-4 pointer-events-auto">
                      {projects.map((project, index) => (
                        project.link.startsWith('/') ? (
                          <Link 
                            key={index}
                            to={project.link}
                            className="block p-4 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left pointer-events-auto"
                          >
                            <div className="flex gap-4 items-center pointer-events-auto">
                              <img 
                                src={project.image}
                                alt={project.title}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 pointer-events-none"
                              />
                              <div className="flex-1 text-left pointer-events-auto">
                                <h3 className="text-base mb-2 text-white font-sans pointer-events-auto" style={{ fontWeight: 400 }}>{project.title}</h3>
                                <p className="text-white/80 text-left text-sm pointer-events-auto">{project.description}</p>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <a 
                            key={index}
                            href={project.link}
                            className="block p-4 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left pointer-events-auto"
                          >
                            <div className="flex gap-4 items-center pointer-events-auto">
                              <img 
                                src={project.image}
                                alt={project.title}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 pointer-events-none"
                              />
                              <div className="flex-1 text-left pointer-events-auto">
                                <h3 className="text-base mb-2 text-white font-sans pointer-events-auto" style={{ fontWeight: 400 }}>{project.title}</h3>
                                <p className="text-white/80 text-left text-sm pointer-events-auto">{project.description}</p>
                              </div>
                            </div>
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}