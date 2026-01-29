import React from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  count = 50, 
  className = "" 
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    color: ['#60A5FA', '#A78BFA', '#34D399', '#FBBF24', '#F87171'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-60"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};