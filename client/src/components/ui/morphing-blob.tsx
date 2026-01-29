import React from 'react';
import { motion } from 'framer-motion';

interface MorphingBlobProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const MorphingBlob: React.FC<MorphingBlobProps> = ({ 
  className = "", 
  size = 'md',
  color = '#60A5FA'
}) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full opacity-30 blur-xl"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 0.8, 1.1, 1],
          rotate: [0, 90, 180, 270, 360],
          borderRadius: [
            "60% 40% 30% 70%/60% 30% 70% 40%",
            "30% 60% 70% 40%/50% 60% 30% 60%",
            "50% 40% 60% 30%/70% 50% 40% 60%",
            "40% 70% 50% 60%/30% 40% 70% 50%",
            "60% 40% 30% 70%/60% 30% 70% 40%"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-4 rounded-full opacity-50 blur-lg"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1.1, 0.9, 1.3, 0.8, 1.1],
          rotate: [360, 270, 180, 90, 0],
          borderRadius: [
            "40% 70% 50% 60%/30% 40% 70% 50%",
            "60% 40% 30% 70%/60% 30% 70% 40%",
            "30% 60% 70% 40%/50% 60% 30% 60%",
            "50% 40% 60% 30%/70% 50% 40% 60%",
            "40% 70% 50% 60%/30% 40% 70% 50%"
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};