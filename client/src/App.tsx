import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import { motion } from "framer-motion";
import ToggleSwitch from "./components/ToggleSwitch";
import About from "./About";
import CoreData from "./projects/CoreData";
import StampingArea from "./components/StampingArea";
import NavLinks from "./components/NavLinks";
import IdentityChips from "./components/IdentityChips";
import type { UserIdentity } from "./components/types";
import Firebase from "./projects/Firebase";
import Chevron from "./projects/Chevron";
import Password from "./Password";
import AuthGuard from "./components/AuthGuard";


// page animation
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


  // load saved role identity from localStorage
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

  // handle role identity select
  const handleIdentitySelect = (identity: UserIdentity | null) => {
    setSelectedIdentity(identity);
    if (identity) {
      localStorage.setItem("userIdentity", identity);
    } else {
      localStorage.removeItem("userIdentity");
    }
  };



  // projects swap based on toggle switch
  const projects = isDarkMode ? [
    {
      title: "Google Core Data",
      description: "designing a way for Googlers to better understand their data",
      image: "/google.png",
      link: "/coredata"
    },
    {
      title: "Google Firebase",
      description: "created better ways for developers to monitor their apps",
      image: "/firebase.png",
      link: "/firebase"
    },
    {
      title: "Chevron",
      description: "helped employees reduce and understand risk",
      image: "/chevron.png",
      link: "/chevron"
    }
  ] : [
    {
      title: "iamafk",
      description: "a place for your cursor to rest with your friends",
      image: "/iamafk.png",
      link: "https://iamafk.dev"
    },
    {
      title: "Digi garden",
      description: "a place for my thoughts and writing",
      image: "/digi.png",
      link: "https://digi.dana.nyc"
    },
    {
      title: "Digi font",
      description: "my open-source lowercase pixel font",
      image: "/font.png",
      link: "https://github.com/danapixels/digi-ttf"
    }
  ];

  return (
    <Router>
      <Routes>
        {/* Password route - no protection needed */}
        <Route path="/password" element={<Password />} />
        
        {/* Protected routes */}
        <Route path="/about" element={
          <AuthGuard>
            <About />
          </AuthGuard>
        } />
        <Route path="/coredata" element={
          <AuthGuard>
            <CoreData />
          </AuthGuard>
        } />
        <Route path="/chevron" element={
          <AuthGuard>
            <Chevron />
          </AuthGuard>
        } />
        <Route path="/firebase" element={
          <AuthGuard>
            <Firebase />
          </AuthGuard>
        } />
        <Route path="/" element={
          <AuthGuard>
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
              {/* stamping area */}
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

              {/* main container */}
              <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-center z-10 px-4 min-h-[calc(100vh-200px)] relative pb-32 pointer-events-none">
                <div
                  className="bg-[#0a0a0a] rounded-2xl flex-1 flex flex-col items-center w-full lg:w-[320px] animate-drop-in relative pointer-events-auto"
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
                              style={{}}
                            >
                              {isDarkMode ? (
                                <div className="font-digi pointer-events-auto text-center space-y-1">
                                  <div>I'm Dana Espine (:</div>
                                  <div>Senior Product Designer @ IBM iX.</div>
                                  <div>Focus: engineering, data, and AI.</div>
                                </div>
                              ) : (
                                <div className="font-digi pointer-events-auto text-center space-y-1">
                                  <div>ui/ux open-source advocate.</div>
                                  <div>Owner of 2 cats.</div>
                                  <div>Indie game supporter.</div>
                                </div>
                              )}
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
                                className="cursor-pointer"
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

                {/* projects */}
                <div className="w-full lg:w-[400px] space-y-4 animate-drop-in relative z-10 pointer-events-auto">
                  <div className="bg-[#0a0a0a] rounded-1xl p-6 pointer-events-auto">
                    <div className="space-y-4 pointer-events-auto">
                      {projects.map((project, index) => (
                        project.link.startsWith('/') ? (
                          <Link 
                            key={index}
                            to={project.link}
                            className="block p-4 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left pointer-events-auto cursor-pointer"
                          >
                            <div className="flex gap-4 items-center pointer-events-auto">
                              <img 
                                src={project.image}
                                alt={project.title}
                                className="hidden md:block w-20 h-20 rounded-lg object-cover flex-shrink-0 pointer-events-none"
                              />
                              <div className="flex-1 text-left pointer-events-auto">
                                <h3 className="text-base mb-2 text-white pointer-events-auto" style={{ fontWeight: 400, fontFamily: "'Fira Code', monospace" }}>{project.title}</h3>
                                <p className="text-white/80 text-left text-sm pointer-events-auto font-inter">{project.description}</p>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <a 
                            key={index}
                            href={project.link}
                            className="block p-4 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left pointer-events-auto cursor-pointer"
                          >
                            <div className="flex gap-4 items-center pointer-events-auto">
                              <img 
                                src={project.image}
                                alt={project.title}
                                className="hidden md:block w-20 h-20 rounded-lg object-cover flex-shrink-0 pointer-events-none"
                              />
                              <div className="flex-1 text-left pointer-events-auto">
                                <h3 className="text-base mb-2 text-white pointer-events-auto" style={{ fontWeight: 400, fontFamily: "'Fira Code', monospace" }}>{project.title}</h3>
                                <p className="text-white/80 text-left text-sm pointer-events-auto font-inter">{project.description}</p>
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
          </AuthGuard>
        } />
      </Routes>
    </Router>
  );
}