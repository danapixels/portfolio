import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  isAnimated?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, onComplete, isAnimated = true }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset animation when text changes and animation is enabled
  useEffect(() => {
    if (isAnimated) {
      setDisplayText('');
      setCurrentIndex(0);
    }
  }, [text, isAnimated]);

  useEffect(() => {
    if (currentIndex < text.length && isAnimated) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Adjust typing speed here

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length && isAnimated) {
      // Animation completed
      onComplete?.();
    }
  }, [currentIndex, text, isAnimated, onComplete]);

  // If animation is disabled, just show the full text
  if (!isAnimated) {
    return (
      <div className="relative inline-block">
        <span className="text-white">{text}</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <span className="text-white">{displayText}</span>
      <span className="inline-block w-[2px] h-[1em] bg-white ml-[2px] animate-blink" />
    </div>
  );
};

export default TypewriterText; 