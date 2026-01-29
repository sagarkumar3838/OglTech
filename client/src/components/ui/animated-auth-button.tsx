import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedAuthButtonProps {
  children: React.ReactNode;
  variant?: 'signin' | 'signup';
  className?: string;
  onClick?: () => void;
}

export const AnimatedAuthButton = forwardRef<HTMLButtonElement, AnimatedAuthButtonProps>(
  ({ children, variant = 'signin', className, onClick }, ref) => {
    const baseStyles = `
      relative overflow-hidden z-10 
      h-10 px-4 rounded-full 
      font-medium text-sm font-inherit 
      border-none cursor-pointer
      transition-all duration-500 ease-in-out
      flex items-center justify-center gap-2
      bg-background/80 backdrop-blur-sm
      border border-border/50
      shadow-sm hover:shadow-md
      before:content-[''] before:absolute before:top-0 before:left-0 
      before:w-0 before:h-full before:rounded-full 
      before:transition-all before:duration-500 before:ease-in-out 
      before:block before:-z-10
      hover:before:w-full
      active:scale-95
      hover:border-transparent
    `;

    const variantStyles = {
      signin: `
        text-blue-700 hover:text-white
        before:bg-gradient-to-r before:from-blue-500 before:to-cyan-400
      `,
      signup: `
        text-purple-700 hover:text-white
        before:bg-gradient-to-r before:from-green-400 before:to-yellow-400
      `,
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        onClick={onClick}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

AnimatedAuthButton.displayName = 'AnimatedAuthButton';