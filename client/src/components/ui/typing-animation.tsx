"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
  cursor?: boolean;
  cursorClassName?: string;
}

export const TypingAnimation = ({ 
  text, 
  duration = 50, 
  className,
  cursor = true,
  cursorClassName 
}: TypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, duration]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {cursor && (
        <motion.span
          className={cn("inline-block w-0.5 h-5 bg-current ml-1", cursorClassName)}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </span>
  );
};


