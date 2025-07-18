import { useState } from "react";

interface CustomTooltipProps {
  children: React.ReactNode;
  content: string;
}

export default function CustomTooltip({ children, content }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative pointer-events-none"
    >
      <div className="pointer-events-auto">
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-50 px-3 py-2 rounded-lg text-white text-sm font-digi shadow-lg pointer-events-none"
          style={{
            backgroundColor: "#0d0d0d",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            left: position.x,
            top: position.y,
            transform: "translateX(-50%) translateY(-100%)",
            fontFamily: "'Pixelify Sans', sans-serif"
          }}
        >
          {content}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "4px solid #0d0d0d"
            }}
          />
        </div>
      )}
    </div>
  );
} 