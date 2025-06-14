import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset animation when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Adjust typing speed here

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className="relative inline-block">
      <span className="text-white">{displayText}</span>
      <span className="inline-block w-[2px] h-[1em] bg-white ml-[2px] animate-blink" />
    </div>
  );
};

export default TypewriterText; 