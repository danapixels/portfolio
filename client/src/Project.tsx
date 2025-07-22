import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import NavLinks from "./components/NavLinks";

export default function Project() {
  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden font-sans"
      style={{
        backgroundColor: "#111111"
      }}
    >
      {/* Header */}
      <header className="w-full z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="block">
              <img 
                src="/logo.png" 
                alt="Dana Logo" 
                className="h-8 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>
          <nav>
            <NavLinks />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full max-w-screen-xl mx-auto px-4 py-12 font-sans">
        {/* Project Header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-left font-sans">
            Project Title
          </h1>
          <div className="flex flex-wrap gap-4 text-lg text-white/80 text-left font-sans">
            <span>Role: Design Lead</span>
            <span>•</span>
            <span>Timeline: 6 months</span>
            <span>•</span>
            <span>Platform: Mobile, Web</span>
          </div>
        </motion.div>

        {/* Project Sections */}
        <div className="space-y-24">
          {/* Overview Section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold font-sans">Overview</h2>
            <p className="text-lg text-white/80 leading-relaxed font-sans">
              A brief description of the project and its goals. What problem were you trying to solve? 
              What was your role in the project? What were the key challenges and outcomes?
            </p>
          </motion.section>

          {/* Background Section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold font-sans">Background</h2>
            <p className="text-lg text-white/80 leading-relaxed font-sans">
              Provide context about the project. What was the situation before? What were the market conditions 
              or user needs that led to this project?
            </p>
          </motion.section>

          {/* Problem Section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold font-sans">Problem</h2>
            <p className="text-lg text-white/80 leading-relaxed font-sans">
              Describe the specific problems or challenges that needed to be addressed. What were the pain points 
              for users or the business?
            </p>
          </motion.section>

          {/* Solution Section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold font-sans">Solution</h2>
            <div className="space-y-12 font-sans">
              <div className="space-y-4 font-sans">
                <h3 className="text-xl font-semibold font-sans">01. First Solution Point</h3>
                <p className="text-lg text-white/80 leading-relaxed font-sans">
                  Describe the first key solution or feature. What was the approach? How did it address the problem?
                </p>
              </div>
              <div className="space-y-4 font-sans">
                <h3 className="text-xl font-semibold font-sans">02. Second Solution Point</h3>
                <p className="text-lg text-white/80 leading-relaxed font-sans">
                  Describe the second key solution or feature. What was the approach? How did it address the problem?
                </p>
              </div>
            </div>
          </motion.section>

          {/* Results Section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold font-sans">Results</h2>
            <p className="text-lg text-white/80 leading-relaxed font-sans">
              What were the outcomes of the project? Include any metrics, user feedback, or business impact. 
              What did you learn from the project?
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
} 