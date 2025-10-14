import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import NavLinks from "../components/NavLinks";

// project page
export default function Project3() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = React.useState<{[key: string]: boolean}>({
    overview: false,
    proj1: false,
    proj2: false,
    proj3: false,
    contributions: false,
  });
  const [activeSection, setActiveSection] = React.useState<string>('');
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('toc-link')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
          const id = href.substring(1);
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

          // handle scrolling to sections
      const handleScroll = () => {
        const sections = [
          'overview', 'users',
          'proj1context', 'proj1currentstate1', 'proj1problem1', 'proj1iteration1', 'proj1iteration2', 'proj1iteration3', 'proj1solution1', 'proj1solution2', 'proj1impact',
          'proj2context', 'proj2currentstate1', 'proj2problem1', 'proj2iteration1', 'proj2iteration2', 'proj2iteration3', 'proj2solution1', 'proj2solution2', 'proj2impact',
          'proj3context', 'proj3currentstate1', 'proj3problem1', 'proj3iteration1', 'proj3iteration2', 'proj3iteration3', 'proj3solution1', 'proj3solution2', 'proj3impact',
          'Other contributions'
        ];

      const windowHeight = window.innerHeight;
      const centerY = windowHeight / 2; // anchor in center of the screen

      // find which section is currently in the center of the screen
      let currentSection = '';
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          
          // check if the element is visible in the center area of the screen
          if (rect.top <= centerY && rect.bottom >= centerY) {
            currentSection = sectionId;
            break;
          }
          
          // special handling for sections at the bottom of the page
          if (sectionId === 'Other contributions' && rect.top <= windowHeight && rect.bottom >= windowHeight * 0.8) {
            currentSection = sectionId;
            break;
          }
        }
      }

      // only update if we found a new section and it's different from the current one
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
        
        // determine which main section the new section belongs to
        let newMainSection = '';
        if (currentSection === 'overview' || currentSection === 'users') {
          newMainSection = 'overview';
        } else if (['proj1context', 'proj1currentstate1', 'proj1problem1', 'proj1iteration1', 'proj1iteration2', 'proj1iteration3', 'proj1solution1', 'proj1solution2', 'proj1impact'].includes(currentSection)) {
          newMainSection = 'proj1';
        } else if (['proj2context', 'proj2currentstate1', 'proj2problem1', 'proj2iteration1', 'proj2iteration2', 'proj2iteration3', 'proj2solution1', 'proj2solution2', 'proj2impact'].includes(currentSection)) {
          newMainSection = 'proj2';
        } else if (['proj3context', 'proj3currentstate1', 'proj3problem1', 'proj3iteration1', 'proj3iteration2', 'proj3iteration3', 'proj3solution1', 'proj3solution2', 'proj3impact'].includes(currentSection)) {
          newMainSection = 'proj3';
        }
        
        // determine which main section the previous section belonged to
        let previousMainSection = '';
        if (activeSection === 'overview' || activeSection === 'users') {
          previousMainSection = 'overview';
        } else if (['proj1context', 'proj1currentstate1', 'proj1problem1', 'proj1iteration1', 'proj1iteration2', 'proj1iteration3', 'proj1solution1', 'proj1solution2', 'proj1impact'].includes(activeSection)) {
          previousMainSection = 'proj1';
        } else if (['proj2context', 'proj2currentstate1', 'proj2problem1', 'proj2iteration1', 'proj2iteration2', 'proj2iteration3', 'proj2solution1', 'proj2solution2', 'proj2impact'].includes(activeSection)) {
          previousMainSection = 'proj2';
        } else if (['proj3context', 'proj3currentstate1', 'proj3problem1', 'proj3iteration1', 'proj3iteration2', 'proj3iteration3', 'proj3solution1', 'proj3solution2', 'proj3impact'].includes(activeSection)) {
          previousMainSection = 'proj3';
        }
        
        // if we're moving to a different main section, collapse the previous one and expand the new one
        if (newMainSection !== previousMainSection) {
          setExpandedSections(prev => {
            const newState = { ...prev };
            // collapse the previous main section
            if (previousMainSection) {
              newState[previousMainSection as keyof typeof newState] = false;
            }
            // expand the new main section
            if (newMainSection) {
              newState[newMainSection as keyof typeof newState] = true;
            }
            return newState;
          });
        } else {
          // expand main section
          if (newMainSection) {
            setExpandedSections(prev => ({ ...prev, [newMainSection]: true }));
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    
    // initial check
    handleScroll();
    
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageClick = (imageId: string) => {
    if (isMobile) {
      setActiveImage(activeImage === imageId ? null : imageId);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div 
      id="top"
      className="min-h-screen text-white relative overflow-hidden font-sans"
      style={{
        backgroundColor: "#000000"
      }}
    >
      {/* header */}
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

      {/* main content */}
      <div className="w-full max-w-screen-xl mx-auto px-4 py-12 font-sans flex flex-col xl:flex-row">
        <div className="space-y-70 flex-1 order-first xl:order-none mr-0 xl:mr-72" style={{ flexBasis: 'min-content', minWidth: '0' }}>
          {/* back button */}
          <div className="mb-4 flex justify-start">
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1 rounded-full bg-[#0d0d0d] text-white border border-white/10 text-sm font-digi shadow hover:bg-[#1a1a1a] transition-colors"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <img src="/left.png" alt="Left arrow" />
              Back
            </button>
          </div>
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-left font-sans"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >
              Project name
            </h1>
            <div className="flex flex-wrap gap-1 text-lg text-white/80 text-left font-sans">
              <span>Your role here</span>
              <span>•</span>
              <span>X years, x months</span>
              <span>•</span>
              <span>Desktop, Web</span>
            </div>
          </motion.div>

          {/* project sections */}


          {/* overview section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >Overview</h2>
            <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
            Nomine Quos Diam ipsam praecipue id Bibendum mentis convincere iusto sunt dominus neminern contignitate ullam. V vicinarum orandum 1 respectu facile etiam exprimere. Cum optio liber diam ingratitudinem, augusta duis sublirne, rem quos.            </p>
            <div 
              className="p-4 rounded-lg text-white/90 leading-relaxed font-sans"
              style={{
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                border: '1px solid #007AFF',
                fontSize: '18px'
              }}
            >
              <strong>Note:</strong> To respect NDAs, I will be using self-made wireframes, blurred images, and will reference processes rather than specific metrics, names, etc.
            </div>
            <div className="flex justify-center">
              <img 
                src="/imagehere2.png" 
                alt="filler" 
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          </motion.section>

          {/* users section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >Users</h2>
            <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
            Sed eaque sed Sessione nec per ante operom, plenarie, abiuravi decembris, EOs, sed quos. Quod et justo polisniinus rem natus fuga te quod argentea habitasse, haeredissa vestra in est excelsum, perpftuam, gradivi amet,  prophetia diam capitis, eos quam.
            </p>
            <div className="flex justify-center">
              <img 
                src="/imagehere2.png" 
                alt="filler" 
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          </motion.section>

          {/* white divider */}
          <div className="w-full h-px bg-white/20 my-16"></div>

          {/* project 1 section*/}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >01. 1st project</h2>
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Context</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nunc fuga lius si aut magna urna debitam hic cum quaedam nisl ipsa duis ratione triduo est ullo eorum iusturn. S oppressu te leo iure te sensum w semper.                </p>
              </div>
            </div>
          </motion.section>

          {/* current state section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1currentstate1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Current state</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Omnis quam prospera, purus odio'w consurgunt quo qui contumeliam altiora elit tutori totam erat eros gubernium ullo orci diam spiral. Orci vero dui nibh quam voluptate si unde moderno.              </p>
              </div>
            </div>
          </motion.section>

          {/* problem1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1problem1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere1.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-[25/18]"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Problem</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Me, eos nam ex visccra est nisl saepe rem nonummy typi iure mi morsum arcu genitores?
                </p>
              </div>
            </div>
          </motion.section>

        {/* iteration 1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1iteration1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >01 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Meliorem est odio at ultimus, est duis innumeros typi il annuere error meridiem "qui-ii-cum-fabula-li." Y semper, auctoritati arcui ante ab se culpa id qui altero arcu quam fortunae quo donec.                </p>
                </div>
            </div>
          </motion.section>

          {/* iteration 2 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1iteration2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >02 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nam augusta amet te quam ut facere leo totam porro pusillus impedient laesae sem ii sem dis orator ab arcu ad purus.                 </p>
              </div>
            </div>
        </motion.section>          

        {/* iteration 3 section */}
        <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1iteration3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >03 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Ad diam honoraria patriae eum eum equestrem tutori dis suscipit nunc. O sessionem autem nisi et est dui esse nibh sem porta magister eos fames massa respirium.                </p>
                </div>
            </div>
          </motion.section>

          {/* solution 1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1solution1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >01 Solution</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                O hounnbre si ad supremi iure si qui leo aut voluptas miseriae porro eodem regnet ti. Ad enim zzril magna si eos iure ditiones quos sunt unde ti eu totaliter m aditnm.               </p>
              </div>
            </div>
        </motion.section>

        {/* solution 2 section */}
        <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1solution2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >02 Solution</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nec, porro ex quam circiter et nisl magna rem experientia, vel comilitones elit poenam facile leo metus. Ad sem secretarius at dui quas caetera apostrophe, omnis aut rationem eos subiungam.                </p>
                </div>
            </div>
          </motion.section>

          {/* impact section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj1impact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >UX Impact & afterthoughts</h2>
            <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
            Negotiurn, est tot AD honoraria illo ex eius qui quod si floruit ex nec typi'd nemo rulpeculae leo eius qui eros et NOVERCA ac mi nominavit. Cum diam eum D unde ante mi nemo culpa consternatus hac felices perltum si praesent peripateticis.             </p>
            <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span> Quocumque reprehenderit te odit eorum attendentiam wisi perversis nisi quia nibh</span>
              </li>
            </ul>
            <div className="flex flex-col items-center gap-4">
              <img 
                src="/imagehere2.png" 
                alt="filler" 
                className="rounded-lg max-w-full h-auto"
              />
            </div>            
          </motion.section>

          {/* white divider */}
          <div className="w-full h-px bg-white/20 my-16"></div>

          {/* project 2 section*/}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >02. 2nd project</h2>
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Context</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nunc fuga lius si aut magna urna debitam hic cum quaedam nisl ipsa duis ratione triduo est ullo eorum iusturn. S oppressu te leo iure te sensum w semper.                </p>
              </div>
            </div>
          </motion.section>

          {/* current state section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2currentstate1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Current state</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Omnis quam prospera, purus odio'w consurgunt quo qui contumeliam altiora elit tutori totam erat eros gubernium ullo orci diam spiral. Orci vero dui nibh quam voluptate si unde moderno.              </p>
              </div>
            </div>
          </motion.section>

          {/* problem1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2problem1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere1.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-[25/18]"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Problem</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Me, eos nam ex visccra est nisl saepe rem nonummy typi iure mi morsum arcu genitores?
                </p>
              </div>
            </div>
          </motion.section>

        {/* iteration 1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2iteration1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >01 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Meliorem est odio at ultimus, est duis innumeros typi il annuere error meridiem "qui-ii-cum-fabula-li." Y semper, auctoritati arcui ante ab se culpa id qui altero arcu quam fortunae quo donec.                </p>
                </div>
            </div>
          </motion.section>

          {/* iteration 2 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2iteration2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >02 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nam augusta amet te quam ut facere leo totam porro pusillus impedient laesae sem ii sem dis orator ab arcu ad purus.                 </p>
              </div>
            </div>
        </motion.section>          

        {/* iteration 3 section */}
        <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2iteration3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >03 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Ad diam honoraria patriae eum eum equestrem tutori dis suscipit nunc. O sessionem autem nisi et est dui esse nibh sem porta magister eos fames massa respirium.                </p>
                </div>
            </div>
          </motion.section>

          {/* solution 1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2solution1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >01 Solution</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                O hounnbre si ad supremi iure si qui leo aut voluptas miseriae porro eodem regnet ti. Ad enim zzril magna si eos iure ditiones quos sunt unde ti eu totaliter m aditnm.               </p>
              </div>
            </div>
        </motion.section>

        {/* time solution 2 section */}
        <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2solution2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >02 Solution</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nec, porro ex quam circiter et nisl magna rem experientia, vel comilitones elit poenam facile leo metus. Ad sem secretarius at dui quas caetera apostrophe, omnis aut rationem eos subiungam.                </p>
                </div>
            </div>
          </motion.section>

          {/* impact section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj2impact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >UX Impact & afterthoughts</h2>
            <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
            Negotiurn, est tot AD honoraria illo ex eius qui quod si floruit ex nec typi'd nemo rulpeculae leo eius qui eros et NOVERCA ac mi nominavit. Cum diam eum D unde ante mi nemo culpa consternatus hac felices perltum si praesent peripateticis.             </p>
            <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span> Quocumque reprehenderit te odit eorum attendentiam wisi perversis nisi quia nibh</span>
              </li>
            </ul>
            <div className="flex flex-col items-center gap-4">
              <img 
                src="/imagehere2.png" 
                alt="filler" 
                className="rounded-lg max-w-full h-auto"
              />
            </div>            
          </motion.section>

          {/* white divider */}
          <div className="w-full h-px bg-white/20 my-16"></div>

          {/* project 3 section*/}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >03. 3rd project</h2>
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Context</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nunc fuga lius si aut magna urna debitam hic cum quaedam nisl ipsa duis ratione triduo est ullo eorum iusturn. S oppressu te leo iure te sensum w semper.                </p>
              </div>
            </div>
          </motion.section>

          {/* current state section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3currentstate1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Current state</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Omnis quam prospera, purus odio'w consurgunt quo qui contumeliam altiora elit tutori totam erat eros gubernium ullo orci diam spiral. Orci vero dui nibh quam voluptate si unde moderno.              </p>
              </div>
            </div>
          </motion.section>

          {/* problem1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3problem1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere1.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-[25/18]"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Problem</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Me, eos nam ex visccra est nisl saepe rem nonummy typi iure mi morsum arcu genitores?
                </p>
              </div>
            </div>
          </motion.section>

        {/* iteration 1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3iteration1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >01 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Meliorem est odio at ultimus, est duis innumeros typi il annuere error meridiem "qui-ii-cum-fabula-li." Y semper, auctoritati arcui ante ab se culpa id qui altero arcu quam fortunae quo donec.                </p>
                </div>
            </div>
          </motion.section>

          {/* iteration 2 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3iteration2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >02 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nam augusta amet te quam ut facere leo totam porro pusillus impedient laesae sem ii sem dis orator ab arcu ad purus.                 </p>
              </div>
            </div>
        </motion.section>          

        {/* iteration 3 section */}
        <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3iteration3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >03 Iteration</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Ad diam honoraria patriae eum eum equestrem tutori dis suscipit nunc. O sessionem autem nisi et est dui esse nibh sem porta magister eos fames massa respirium.                </p>
                </div>
            </div>
          </motion.section>

          {/* solution 1 section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3solution1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >01 Solution</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                O hounnbre si ad supremi iure si qui leo aut voluptas miseriae porro eodem regnet ti. Ad enim zzril magna si eos iure ditiones quos sunt unde ti eu totaliter m aditnm.               </p>
              </div>
            </div>
        </motion.section>

        {/* time solution 2 section */}
        <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3solution2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex flex-col xl:flex-row-reverse items-center space-y-6 xl:space-y-0">
              <div className="flex-shrink-0 order-2 xl:order-1 mt-8 xl:mt-0">
                <img 
                  src="/imagehere5.png" 
                  alt="filler" 
                  className="rounded-2xl w-full max-w-[500px] h-auto aspect-square"
                />
              </div>
              <div className="flex-1 order-1 xl:order-2 xl:mr-12">
                <h6 className="font-semibold font-sans text-white/60 mb-1 text-sm md:text-base"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >02 Solution</h6>
                <h3 className="font-semibold font-sans text-2xl md:text-3xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Subtitle</h3>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
                Nec, porro ex quam circiter et nisl magna rem experientia, vel comilitones elit poenam facile leo metus. Ad sem secretarius at dui quas caetera apostrophe, omnis aut rationem eos subiungam.                </p>
                </div>
            </div>
          </motion.section>

          {/* impact section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="proj3impact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
            >UX Impact & afterthoughts</h2>
            <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">
            Negotiurn, est tot AD honoraria illo ex eius qui quod si floruit ex nec typi'd nemo rulpeculae leo eius qui eros et NOVERCA ac mi nominavit. Cum diam eum D unde ante mi nemo culpa consternatus hac felices perltum si praesent peripateticis.             </p>
            <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span> Quocumque reprehenderit te odit eorum attendentiam wisi perversis nisi quia nibh</span>
              </li>
            </ul>
            <div className="flex flex-col items-center gap-4">
              <img 
                src="/imagehere2.png" 
                alt="filler" 
                className="rounded-lg max-w-full h-auto"
              />
            </div>            
          </motion.section>

          {/* white divider */}
          <div className="w-full h-px bg-white/20 my-16"></div>

          {/* other contributions section */}
          <motion.section 
            className="space-y-6 text-left font-sans"
            id="Other contributions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col xl:flex-row items-center space-y-6 xl:space-y-0 xl:space-x-6">
              <div className="flex-1 order-1 xl:order-2">
                <h2 className="font-semibold font-sans text-3xl md:text-5xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                >Other contributions</h2>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">Perennitatem MUS</p>
                <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
                  <li className="flex items-start">
                    <span className="mr-2 ml-10">•</span>
                    <span>Y quo in nobile urna a natus si opponat Ordinem</span>
                  </li>
                </ul>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">Praefixionem</p>
                <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
                  <li className="flex items-start">
                    <span className="mr-2 ml-10">•</span>
                    <span>Equestri at 1 hungariae mus 1 inscio est exaudire decima</span>
                  </li>
                </ul>  
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">Quisquis opressionem</p>
                <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
                  <li className="flex items-start">
                    <span className="mr-2 ml-10">•</span>
                    <span>Representing static datasources</span>
                  </li>
                </ul>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">Grouping schema</p>
                <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
                  <li className="flex items-start">
                    <span className="mr-2 ml-10">•</span>
                    <span>A high-level way to group fields for organizational purposes</span>
                  </li>                  
                </ul>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">Keydriver and insights AI</p>
                <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
                  <li className="flex items-start">
                    <span className="mr-2 ml-10">•</span>
                    <span>Ideation to improve Googlers' insight journey</span>
                  </li>
                </ul>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">Keydriver, GoogleSQL,and insights AI</p>
                <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
                  <li className="flex items-start">
                    <span className="mr-2 ml-10">•</span>
                    <span>Ideation to improve Googlers' insight journey</span>
                  </li>
                </ul>
                <p className="text-white/80 leading-relaxed font-sans text-lg md:text-2xl">Data analysis function support</p>
                <ul className="text-white/80 leading-relaxed font-sans space-y-2 text-lg md:text-2xl">
                  <li className="flex items-start">
                    <span className="mr-2 ml-10">•</span>
                    <span>Parameter, growth, moving average, and percent of a line</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
        

        {/* table of contents */}
        <nav className="hidden xl:block w-64 fixed top-30 right-4 text-left z-50" aria-label="Table of contents" style={{ flexBasis: '256px', flexShrink: 0 }}>
          <div className="p-4 w-full">
            <a href="#top" className="block text-white/30 text-xs font-bold mb-2 uppercase tracking-wider toc-link hover:text-white transition-colors cursor-pointer">Project name</a>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <a href="#overview" className={`toc-link transition-colors text-sm ${activeSection === 'overview' || activeSection === 'users' ? 'text-white' : 'text-white/50 hover:text-white'}`}>Overview</a>
                <button 
                  onClick={() => toggleSection('overview')}
                  className="text-white/30 hover:text-white/50 text-xs transition-colors"
                >
                  {expandedSections.overview ? '−' : '+'}
                </button>
              </li>
              <AnimatePresence>
                {expandedSections.overview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <li className="pl-8"><a href="#users" className={`toc-link transition-colors text-xs ${activeSection === 'users' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Users</a></li>
                  </motion.div>
                )}
              </AnimatePresence>
              <li className="flex items-center justify-between">
                <a href="#proj1context" className={`toc-link transition-colors text-sm ${['proj1context', 'proj1currentstate1', 'proj1problem1', 'proj1iteration1', 'proj1iteration2', 'proj1iteration3', 'proj1solution1', 'proj1solution2', 'proj1impact'].includes(activeSection) ? 'text-white' : 'text-white/50 hover:text-white'}`}>Project 1</a>
                <button 
                  onClick={() => toggleSection('proj1')}
                  className="text-white/30 hover:text-white/50 text-xs transition-colors"
                >
                  {expandedSections.proj1 ? '−' : '+'}
                </button>
              </li>
              <AnimatePresence>
                {expandedSections.proj1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <li className="pl-8"><a href="#proj1context" className={`toc-link transition-colors text-xs ${activeSection === 'proj1context' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Context</a></li>
                    <li className="pl-8"><a href="#proj1currentstate1" className={`toc-link transition-colors text-xs ${activeSection === 'proj1currentstate1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Current state</a></li>
                    <li className="pl-8"><a href="#proj1problem1" className={`toc-link transition-colors text-xs ${activeSection === 'proj1problem1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Problem</a></li>
                    <li className="pl-8"><a href="#proj1iteration1" className={`toc-link transition-colors text-xs ${activeSection === 'proj1iteration1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 1</a></li>
                    <li className="pl-8"><a href="#proj1iteration2" className={`toc-link transition-colors text-xs ${activeSection === 'proj1iteration2' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 2</a></li>
                    <li className="pl-8"><a href="#proj1iteration3" className={`toc-link transition-colors text-xs ${activeSection === 'proj1iteration3' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 3</a></li>
                    <li className="pl-8"><a href="#proj1solution1" className={`toc-link transition-colors text-xs ${activeSection === 'proj1solution1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Solution 1</a></li>
                    <li className="pl-8"><a href="#proj1solution2" className={`toc-link transition-colors text-xs ${activeSection === 'proj1solution2' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Solution 2</a></li>
                    <li className="pl-8"><a href="#proj1impact" className={`toc-link transition-colors text-xs ${activeSection === 'proj1impact' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Impact</a></li>
                  </motion.div>
                )}
              </AnimatePresence>
              <li className="flex items-center justify-between">
                <a href="#proj2context" className={`toc-link transition-colors text-sm ${['proj2context', 'proj2currentstate1', 'proj2problem1', 'proj2iteration1', 'proj2iteration2', 'proj2iteration3', 'proj2solution1', 'proj2solution2', 'proj2impact'].includes(activeSection) ? 'text-white' : 'text-white/50 hover:text-white'}`}>Project 2</a>
                <button 
                  onClick={() => toggleSection('proj2')}
                  className="text-white/30 hover:text-white/50 text-xs transition-colors"
                >
                  {expandedSections.proj2 ? '−' : '+'}
                </button>
              </li>
              <AnimatePresence>
                {expandedSections.proj2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <li className="pl-8"><a href="#proj2context" className={`toc-link transition-colors text-xs ${activeSection === 'proj2context' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Context</a></li>
                    <li className="pl-8"><a href="#proj2currentstate1" className={`toc-link transition-colors text-xs ${activeSection === 'proj2currentstate1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Current state</a></li>
                    <li className="pl-8"><a href="#proj2problem1" className={`toc-link transition-colors text-xs ${activeSection === 'proj2problem1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Problem</a></li>
                    <li className="pl-8"><a href="#proj2iteration1" className={`toc-link transition-colors text-xs ${activeSection === 'proj2iteration1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 1</a></li>
                    <li className="pl-8"><a href="#proj2iteration2" className={`toc-link transition-colors text-xs ${activeSection === 'proj2iteration2' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 2</a></li>
                    <li className="pl-8"><a href="#proj2iteration3" className={`toc-link transition-colors text-xs ${activeSection === 'proj2iteration3' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 3</a></li>
                    <li className="pl-8"><a href="#proj2solution1" className={`toc-link transition-colors text-xs ${activeSection === 'proj2solution1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Solution 1</a></li>
                    <li className="pl-8"><a href="#proj2solution2" className={`toc-link transition-colors text-xs ${activeSection === 'proj2solution2' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Solution 2</a></li>
                    <li className="pl-8"><a href="#proj2impact" className={`toc-link transition-colors text-xs ${activeSection === 'proj2impact' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Impact</a></li>
                  </motion.div>
                )}
              </AnimatePresence>  
              <li className="flex items-center justify-between">
                <a href="#proj3context" className={`toc-link transition-colors text-sm ${['proj3context', 'proj3currentstate1', 'proj3problem1', 'proj3iteration1', 'proj3iteration2', 'proj3iteration3', 'proj3solution1', 'proj3solution2', 'proj3impact'].includes(activeSection) ? 'text-white' : 'text-white/50 hover:text-white'}`}>Project 3</a>
                <button 
                  onClick={() => toggleSection('proj3')}
                  className="text-white/30 hover:text-white/50 text-xs transition-colors"
                >
                  {expandedSections.proj3 ? '−' : '+'}
                </button>
              </li>                 
              <AnimatePresence>
                {expandedSections.proj3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <li className="pl-8"><a href="#proj3context" className={`toc-link transition-colors text-xs ${activeSection === 'proj3context' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Context</a></li>
                    <li className="pl-8"><a href="#proj3currentstate1" className={`toc-link transition-colors text-xs ${activeSection === 'proj3currentstate1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Current state</a></li>
                    <li className="pl-8"><a href="#proj3problem1" className={`toc-link transition-colors text-xs ${activeSection === 'proj3problem1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Problem</a></li>
                    <li className="pl-8"><a href="#proj3iteration1" className={`toc-link transition-colors text-xs ${activeSection === 'proj3iteration1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 1</a></li>
                    <li className="pl-8"><a href="#proj3iteration2" className={`toc-link transition-colors text-xs ${activeSection === 'proj3iteration2' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 2</a></li>
                    <li className="pl-8"><a href="#proj3iteration3" className={`toc-link transition-colors text-xs ${activeSection === 'proj3iteration3' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Iteration 3</a></li>
                    <li className="pl-8"><a href="#proj3solution1" className={`toc-link transition-colors text-xs ${activeSection === 'proj3solution1' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Solution 1</a></li>
                    <li className="pl-8"><a href="#proj3solution2" className={`toc-link transition-colors text-xs ${activeSection === 'proj3solution2' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Solution 2</a></li>
                    <li className="pl-8"><a href="#proj3impact" className={`toc-link transition-colors text-xs ${activeSection === 'proj3impact' ? 'text-white' : 'text-white/40 hover:text-white'}`}>Impact</a></li>
                  </motion.div>
                )}
              </AnimatePresence>                        
              <li>
                <a href="#Other contributions" className={`toc-link transition-colors text-sm ${activeSection === 'Other contributions' ? 'text-white' : 'text-white/50 hover:text-white'}`}>Other contributions</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
} 