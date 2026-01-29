import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingCard = ({ 
  children, 
  delay = 0,
  className = ''
}: FloatingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
