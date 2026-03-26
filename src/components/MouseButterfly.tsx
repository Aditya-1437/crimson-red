"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function MouseButterfly() {
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth out the movement using spring physics for a more natural flight
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let lastX = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      // Calculate rotation based on movement direction
      const currentX = e.clientX;
      if (currentX > lastX) {
        setRotation(15); // flying right
      } else if (currentX < lastX) {
        setRotation(-15); // flying left
      }
      lastX = currentX;

      // Position slightly offset from cursor so it looks like it follows it
      mouseX.set(e.clientX + 15);
      mouseY.set(e.clientY + 15);
    };

    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] text-crimson"
      style={{
        x: springX,
        y: springY,
      }}
    >
      <motion.div
        animate={{ 
          rotate: rotation,
          y: [0, -5, 5, 0]
        }}
        transition={{ 
          rotate: { type: "spring", stiffness: 100 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
      >
        <ButterflyIcon size={24} />
      </motion.div>
    </motion.div>
  );
}

const ButterflyIcon = ({ size = 24 }: { size?: number }) => (
  <motion.svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    animate={{ 
      scaleX: [1, 0.4, 1],
      scaleY: [1, 0.9, 1]
    }}
    transition={{
      repeat: Infinity,
      duration: 0.25,
      ease: "linear"
    }}
  >
    <path d="M12 12C12 12 8 4 4 8C2 10 4 14 8 12C10 11 12 12 12 12ZM12 12C12 12 16 4 20 8C22 10 20 14 16 12C14 11 12 12 12 12Z" />
    <path d="M12 12C12 12 9 20 5 18C3 17 5 14 8 14C10 14 12 12 12 12ZM12 12C12 12 15 20 19 18C21 17 19 14 16 14C14 14 12 12 12 12Z" opacity="0.8" />
  </motion.svg>
);
