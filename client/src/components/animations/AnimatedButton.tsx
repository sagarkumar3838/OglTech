import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
}

export const AnimatedButton = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button'
}: AnimatedButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-indigo-600 border-2 border-indigo-600 shadow-md hover:shadow-lg',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 
        font-semibold rounded-xl
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};
