"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const WordRotate = ({ words, duration = 2500, className }: WordRotateProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className={cn("relative inline-block", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 90 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};


