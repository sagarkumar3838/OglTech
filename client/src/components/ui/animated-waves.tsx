import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedWaves: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wave 1 */}
      <motion.div
        className="absolute inset-0"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,400 Q300,200 600,400 T1200,400 L1200,0 L0,0 Z"
            fill="url(#wave1)"
            animate={{
              d: [
                "M0,400 Q300,200 600,400 T1200,400 L1200,0 L0,0 Z",
                "M0,350 Q300,150 600,350 T1200,350 L1200,0 L0,0 Z",
                "M0,400 Q300,200 600,400 T1200,400 L1200,0 L0,0 Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Wave 2 */}
      <motion.div
        className="absolute inset-0"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
      >
        <svg
          className="absolute bottom-0 right-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M1200,400 Q900,600 600,400 T0,400 L0,800 L1200,800 Z"
            fill="url(#wave2)"
            animate={{
              d: [
                "M1200,400 Q900,600 600,400 T0,400 L0,800 L1200,800 Z",
                "M1200,450 Q900,650 600,450 T0,450 L0,800 L1200,800 Z",
                "M1200,400 Q900,600 600,400 T0,400 L0,800 L1200,800 Z"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <defs>
            <linearGradient id="wave2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};