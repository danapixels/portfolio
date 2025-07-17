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

  const darkModeContent = {
    title: "i am a senior product designer.",
    description1: "I am a product designer based in Queens, New York. I have the privilege to work alongside the brightest minds at IBM and with the various designers within my client teams. Working with various industries has pushed my growth exponentially through product team collaboration and differing ways of working. I've learned to become adaptable and gladly meet the moment for each of my teams.",
    description2: "I specialize in engineering tools, AI, and data analysis tools. These 3 building blocks that have built me up as a designer, also directly correlate to my values of bridging the gap between UX and engineering, pushing the boundaries, and data transparency.",
    skills: [
      "High fidelity prototyping",
      "UX thought leadership", 
      "Wireframing",
      "Design thinking facilitation",
      "Design mentorship",
      "Creating concepts from ambiguous ideas"
    ],
    contact: [
      "Email: your.email@example.com",
      "GitHub: github.com/yourusername", 
      "LinkedIn: linkedin.com/in/yourusername"
    ]
  };

  const lightModeContent = {
    title: "i am a chronically online creator.",
    description1: "My passion is execution of my ideas and seeing them come to life. I love creating experiences inside and outside of work. I am a big advocate for UX/UI to understand the engineering lifecycle and the importance of open-source AND free software. Bringing UX/UI to open-source means faster iterations, different perspectives, and bringing light to voices who otherwise might not have been heard.",
    description2: "To push the boundaries of our potential as designers, it's important to understand the process of engineering but also how we can best communicate our thoughts and ideas in a way everyone can understand. The best way to provide the best UX for our users is if everyone can speak the same \"working language,\" right?",
    skills: [
      "Indie games (Binding of Isaac)",
      "Making stuff",
      "Reading (Sci-fi and Fantasy)",
      "Writing",
      "Watching movies (Truman Show)",
      "Teaching"
    ],
    contact: [
      "Email: your.email@example.com",
      "GitHub: github.com/yourusername",
      "LinkedIn: linkedin.com/in/yourusername"
    ]
  };

  const currentContent = isDarkMode ? darkModeContent : lightModeContent;

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
        <div className="max-w-screen-xl mx-auto flex items-center justify-center z-20 px-4 min-h-[calc(100vh-200px)]">
          <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-4 w-full max-w-6xl">
            <div
              className="bg-[#0d0d0d] rounded-2xl shadow-2xl flex flex-col items-center w-full max-w-xl animate-drop-in relative"
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
                          className="text-xl font-light font-digi"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <TypewriterText text={currentContent.title} />
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
                        <h2 className="text-2xl font-semibold font-digi">about me</h2>
                        <div className="flex justify-center mb-6">
                          <img 
                            src={isDarkMode ? "/mainport.png" : "/portrait.png"}
                            alt="Portfolio Image"
                            className="rounded-lg"
                          />
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                          {currentContent.description1}
                        </p>
                        <p className="text-white text-sm leading-relaxed">
                          {currentContent.description2}
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
            
            {/* Side containers positioned outside main content */}
            <div className="space-y-4 flex-shrink-0 w-full lg:w-auto">
              <div className="bg-[#0d0d0d] p-4 rounded-lg border border-white/5 w-full lg:w-50 animate-drop-in">
                <h3 className="text-lg font-semibold mb-2 font-digi text-left">{isDarkMode ? "skills" : "hobbies"}</h3>
                <ul className="text-white/80 space-y-2 flex flex-col min-h-[120px]">
                  {currentContent.skills.map((skill, index) => (
                    <li key={index} className="text-sm flex items-start" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <img src="/sparkle.png" alt="sparkle" className="mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-left">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0d0d0d] p-4 rounded-lg border border-white/5 flex flex-col min-h-[120px] w-full lg:w-50 animate-drop-in">
                <h3 className="text-lg font-semibold mb-2 font-digi text-left">contact</h3>
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <a 
                    href="https://www.linkedin.com/in/danaespine/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <img src="/linkedin.png" alt="LinkedIn" className="w-8 h-8" />
                    <span className="text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>/danaespine</span>
                  </a>
                  <a 
                    href="https://github.com/danapixels" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <img src="/github.png" alt="GitHub" className="w-8 h-8" />
                    <span className="text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>/danapixels</span>
                  </a>
                  <a 
                    href="mailto:hi@dana.nyc"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <img src="/email.png" alt="Email" className="w-8 h-8" />
                    <span className="text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>hi@dana.nyc</span>
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