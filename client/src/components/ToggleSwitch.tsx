import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  className?: string;
}
// different switch images for light and dark mode
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle, className = "" }) => {
  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-10 items-center rounded-full bg-[#111111] p-0.5 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#3a3a3a] focus:ring-offset-1 focus:ring-offset-gray-800 shadow-lg hover:shadow-xl ${className}`}
      style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}
    >
      <div
        className={`relative h-5 w-5 rounded-full bg-[#111111] shadow-lg flex items-center justify-center text-xs z-10 transition-transform duration-300 ${
          isOn ? 'translate-x-0' : 'translate-x-4'
        }`}
      >
        {isOn ? (
          <img src="/sun.png" alt="Sun" style={{ width: 16, height: 16 }} />
        ) : (
          <img src="/moon.png" alt="Moon" style={{ width: 16, height: 16 }} />
        )}
      </div>
    </button>
  );
};

export default ToggleSwitch; 