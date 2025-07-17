import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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



export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWorkHours, setIsWorkHours] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasAnimatedTexts, setHasAnimatedTexts] = useState<{ dark: boolean; light: boolean }>({ dark: false, light: false });

  const darkModeText = "I'm Dana Espine (: A Senior Product Designer at IBM iX. My niche is engineering, data, AI, and advocating for designers.";
  const lightModeText = "UI/UX open source advocate, afker, owner of 2 cats, pixel art lover, non-verbal interaction enthusiast, and indie game supporter.";

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
      link: "https://github.com/yourusername/project2"
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
                              <div className="font-digi">
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
                            <p className="text-white text-sm leading-relaxed">
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
                      {projects.map((project, index) => (
                        project.link.startsWith('/') ? (
                          <Link 
                            key={index}
                            to={project.link}
                            className="block p-4 bg-[#111111] rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5 text-left"
                          >
                            <div className="flex gap-4 items-center">
                              <img 
                                src={project.image}
                                alt={project.title}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 text-left">
                                <h3 className="text-base mb-2 text-white font-roboto" style={{ fontWeight: 400, fontFamily: 'Roboto, sans-serif' }}>{project.title}</h3>
                                <p className="text-white/80 text-left text-sm">{project.description}</p>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <a 
                            key={index}
                            href={project.link}
                            className="block p-4 bg-[#111111] rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5 text-left"
                          >
                            <div className="flex gap-4 items-center">
                              <img 
                                src={project.image}
                                alt={project.title}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 text-left">
                                <h3 className="text-base mb-2 text-white font-roboto" style={{ fontWeight: 400, fontFamily: 'Roboto, sans-serif' }}>{project.title}</h3>
                                <p className="text-white/80 text-left text-sm">{project.description}</p>
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