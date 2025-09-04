import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  authenticate, 
  setAuthenticated, 
  checkRateLimit, 
  recordFailedAttempt, 
  getRemainingWaitTime 
} from './utils/auth';
import IdentityChips from './components/IdentityChips';
import type { UserIdentity } from './components/types';

export default function Password() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [logoFrame, setLogoFrame] = useState(0);
  const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef<HTMLImageElement>(null);

  // get the intended destination from location state or default to home
  const intendedPath = location.state?.from || '/';

  useEffect(() => {
    // check rate limiting on component mount
    if (!checkRateLimit()) {
      setIsRateLimited(true);
      updateRemainingTime();
    }
  }, []);

  useEffect(() => {
  }, []);

  useEffect(() => {
    let interval: number;
    
    if (isRateLimited) {
      interval = setInterval(() => {
        const timeLeft = getRemainingWaitTime();
        if (timeLeft <= 0) {
          setIsRateLimited(false);
          setError('');
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRateLimited]);

  const updateRemainingTime = () => {
    const timeLeft = getRemainingWaitTime();
    setRemainingTime(timeLeft);
  };

  const handleIdentitySelect = (identity: UserIdentity | null) => {
    setSelectedIdentity(identity);
    // wait for successful authentication
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRateLimited) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // check rate limiting
      if (!checkRateLimit()) {
        setIsRateLimited(true);
        updateRemainingTime();
        setError('Too many failed attempts. Please wait before trying again.');
        setIsLoading(false);
        return;
      }
      
      // authenticate with server
      const authResult = await authenticate(password);
      
      if (authResult.success) {
        // authentication successful - now save the selected identity
        if (selectedIdentity) {
          localStorage.setItem('userIdentity', selectedIdentity);
          // dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('identityChanged', { 
            detail: { identity: selectedIdentity } 
          }));
        }
        
        setAuthenticated(true); // for backward compatibility
        setIsSuccess(true);
        // let the GIF play
      } else {
        // failed attempt
        recordFailedAttempt();
        setPassword('');
        setError(authResult.error || 'Incorrect password.');
        
        // lock animation
        if (logoRef.current) {
          // force reload the GIF to start from beginning
          logoRef.current.src = "/locked.png";
          // small delay to ensure PNG loads, then start GIF
          setTimeout(() => {
            if (logoRef.current) {
              // use timestamp to force browser to reload GIF from beginning
              const timestamp = Date.now();
              logoRef.current.src = `/locked.gif?t=${timestamp}`;
              // let GIF play at its natural speed for a short duration
              setTimeout(() => {
                if (logoRef.current) {
                  logoRef.current.src = "/locked.png";
                }
              }, 300); // timing to let lock animate and confetti play
            }
          }, 50);
        }
        
        // check if we should rate limit now
        if (!checkRateLimit()) {
          setIsRateLimited(true);
          updateRemainingTime();
          setError('Too many failed attempts. Please wait.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // format time for rate limit message
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen text-white flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: "linear-gradient(#0f0f0f 1px, transparent 1px), linear-gradient(90deg, #0f0f0f 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* background grid pattern */}
      <div className="absolute inset-0 opacity-20"></div>
      
      {/* social media icons - top right */}
      <div className="fixed top-4 right-4 z-50 flex space-x-4">
        <a 
          href="https://github.com/danapixels" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img src="/github.png" alt="GitHub" className="w-8 h-8" />
        </a>
        <a 
          href="https://www.linkedin.com/in/dananyc/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img src="/linkedin.png" alt="LinkedIn" className="w-8 h-8" />
        </a>
        <a 
          href="mailto:hi@dana.nyc"
          className="hover:opacity-80 transition-opacity"
        >
          <img src="/email.png" alt="Email" className="w-8 h-8" />
        </a>
      </div>
      
      {isSuccess && (
        <>
          <img src="/confetti.gif" alt="Confetti" className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none" />
          <img src="/confetti.gif" alt="Confetti" className="fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none scale-x-[-1]" />
        </>
      )}
      
                        {/* main content */}
                  <motion.div 
                    className="relative z-10 max-w-lg w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                            {/* logo */}
                    <div className="text-center mb-8">
                                              <img 
                          ref={logoRef}
                          src={isSuccess ? "/locked.gif" : "/locked.png"} 
                          alt="" 
                          className="h-12 w-auto mx-auto mb-4"
                        onLoad={(e) => {
                          if (isSuccess) {
                            // wait for confetti and locked.gif to complete before redirecting
                                                         setTimeout(() => {
                               navigate(intendedPath, { replace: true });
                             }, 2500); // duration of locked.gif + confetti
                          }
                        }}
                      />
                      <h1 className="text-2xl font-bold font-digi">Dana's portfolio (:</h1>
                    </div>

                            {/* password form */}
                    <motion.div 
                      className="rounded-2xl p-8 pb-10"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
          <form onSubmit={handleSubmit} className="space-y-4">
                                                            <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading || isRateLimited}
                            className="flex-1 px-4 py-2 bg-[#1a1a1a] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed font-digi"
                            placeholder="Enter password"
                            autoComplete="off"
                            spellCheck="false"
                          />
                          <button
                            type="submit"
                            disabled={isLoading || isRateLimited || !password.trim()}
                            className="py-2 px-4 bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors duration-200 flex items-center justify-center font-digi"
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ...
                              </>
                            ) : (
                              'go!'
                            )}
                          </button>
                        </div>

                        {/* identity selection */}
                        <div className="mt-6 text-center">
                          <p className="text-white/60 text-sm mb-3 font-digi">choose your role</p>
                          <IdentityChips 
                            selectedIdentity={selectedIdentity} 
                            onIdentitySelect={handleIdentitySelect} 
                          />
                        </div>

                        {/* error message - reserve space to prevent layout shift */}
                        <div className="min-h-[60px]">
                          {error && (
                            <motion.div 
                              className="p-3 bg-red-500/20 rounded-lg text-red-400 text-sm text-center font-digi"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              {error}
                            </motion.div>
                          )}

                          {/* rate limit message */}
                          {isRateLimited && (
                            <motion.div 
                              className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400 text-sm text-center font-digi"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                            >
                              Too many failed attempts, please wait {formatTime(remainingTime)} before trying again.
                            </motion.div>
                          )}
                        </div>
                        </form>
                        </motion.div>


      </motion.div>
    </div>
  );
} 