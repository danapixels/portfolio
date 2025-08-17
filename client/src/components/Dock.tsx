"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./Dock.css";

// public item descriptor for the Dock toolbar
export type DockItemData = {
  icon: React.ReactNode;        // visual icon node
  label: React.ReactNode;       // short text label shown above on hover
  onClick: () => void;          // action when the item is clicked
  className?: string;           // optional extra classes for the item
  type?: string;                // key used to determine selection state (e.g., 'gold')
  selected?: boolean;           // explicit selection override for the item
};

// public props for the Dock toolbar
export type DockProps = {
  items: DockItemData[];        // list of items to render in the dock
  selectedStamp?: string | null;// current selected key to highlight matching item
  className?: string;           // additional classes for the dock panel
  distance?: number;            // radius in px around the cursor for magnification falloff
  panelHeight?: number;         // collapsed height of the dock (px)
  baseItemSize?: number;        // normal (non-magnified) item size (px)
  dockHeight?: number;          // max dock height budget (px)
  magnification?: number;       // peak item size when the cursor is centered (px)
  spring?: SpringOptions;       // spring physics options for motions
};

// Internal props for each DockItem instance
type DockItemProps = {
  className?: string;
  children: React.ReactNode;    // icon + label nodes
  onClick?: () => void;
  mouseX: MotionValue<number>;  // shared cursor X position across dock
  spring: SpringOptions;        // spring configuration for transitions
  distance: number;             // influence radius for magnification
  baseItemSize: number;         // base size in px
  magnification: number;        // peak size in px
  isSelected?: boolean;         // whether this item is visually selected
};

// Aa single dock item that grows/shrinks based on proximity to the cursor
function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  isSelected = false,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0); // 1 while hovered/focused, 0 otherwise

  // compute horizontal distance from the cursor to the item's center
  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    } as DOMRect;
    return val - rect.x - baseItemSize / 2;
  });

  // map distance to target size within [-distance, 0, distance]
  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  // smooth the size changes using a spring
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        // only essential motion-driven styles; visuals are handled in CSS
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${isSelected ? "dock-item-selected" : ""} ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // inject the hover MotionValue into DockLabel only
          if (child.type === DockLabel) {
            return cloneElement(child, { isHovered } as any);
          }
          return child;
        }
        return child;
      })}
    </motion.div>
  );
}

// floating label above a dock item that fades in while the item is hovered
type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>; // 1 when hovered, 0 otherwise
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  // subscribe to the hover MotionValue to toggle label visibility
  useEffect(() => {
    if (!isHovered) return;

    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label font-sans ${className}`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// wrapper for icon content to apply consistent sizing/align rules
type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

// main dock component that renders a macOS-like magnifying toolbar fixed at the bottom
export default function Dock({
  items,
  selectedStamp = null, // current selected key (or null when none)
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  // shared MotionValues for cursor position and hover state
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  // compute animated dock height based on hover
  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{
        height,
        scrollbarWidth: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "transparent",
      }}
      className="dock-outer"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            // consider an item selected if its type matches the selected key,
            // or if the item explicitly sets selected=true
            isSelected={
              (selectedStamp !== null && selectedStamp !== undefined && selectedStamp === item.type) ||
              item.selected === true
            }
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}