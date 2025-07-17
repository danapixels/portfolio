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
      "Design mentorship"
    ],
    contact: [
      "Email: your.email@example.com",
      "GitHub: github.com/yourusername", 
      "LinkedIn: linkedin.com/in/yourusername"
    ]
  };

  const lightModeContent = {
    title: "i am a chronically online creator.",
    description1: "I'm a creative engineer focused on building meaningful experiences through code and design. My passion lies in data visualization and creating interfaces that make complex information accessible.",
    description2: "Beyond coding, I enjoy contributing to open-source communities, mentoring new developers, and exploring the intersection of art and technology.",
    skills: [
      "Data Visualization",
      "Creative Coding",
      "Open Source",
      "Technical Writing"
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
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-[#0d0d0d] p-4 rounded-lg border border-white/5">
                          <h3 className="text-lg font-semibold mb-2 font-digi">skills</h3>
                          <ul className="text-white/80 space-y-2 text-center flex flex-col justify-center min-h-[120px]">
                            {currentContent.skills.map((skill, index) => (
                              <li key={index} className="flex items-center justify-center text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                <img src="/sparkle.png" alt="sparkle" className="mr-2 flex-shrink-0" />
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-[#0d0d0d] p-4 rounded-lg border border-white/5">
                          <h3 className="text-lg font-semibold mb-2 font-digi">contact</h3>
                          <ul className="text-white/80 space-y-2">
                            {currentContent.contact.map((contact, index) => (
                              <li key={index} className="text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>{contact}</li>
                            ))}
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