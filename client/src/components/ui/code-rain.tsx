import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeSymbol {
  id: number;
  char: string;
  x: number;
  delay: number;
  duration: number;
  color: string;
}

export const CodeRain: React.FC = () => {
  const [symbols, setSymbols] = useState<CodeSymbol[]>([]);

  const codeChars = [
    '{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', 
    '=', '+', '-', '*', '&', '%', '$', '#', '@', '!',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'
  ];

  const colors = ['#60A5FA', '#A78BFA', '#34D399', '#FBBF24', '#F87171'];

  useEffect(() => {
    const generateSymbols = () => {
      const newSymbols: CodeSymbol[] = [];
      for (let i = 0; i < 30; i++) {
        newSymbols.push({
          id: i,
          char: codeChars[Math.floor(Math.random() * codeChars.length)],
          x: Math.random() * 100,
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setSymbols(newSymbols);
    };

    generateSymbols();
    const interval = setInterval(generateSymbols, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <AnimatePresence>
        {symbols.map((symbol) => (
          <motion.div
            key={symbol.id}
            className="absolute text-2xl font-mono font-bold"
            style={{
              left: `${symbol.x}%`,
              color: symbol.color,
            }}
            initial={{ y: -50, opacity: 0, scale: 0.5 }}
            animate={{ 
              y: '100vh', 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: symbol.duration,
              delay: symbol.delay,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            {symbol.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};