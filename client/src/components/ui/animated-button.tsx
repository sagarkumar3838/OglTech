import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    
    const variants = {
      primary: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white shadow-2xl focus:ring-pink-400/50",
      secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm focus:ring-white/20",
      ghost: "text-white hover:bg-white/10 focus:ring-white/20"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm h-10",
      md: "px-6 py-3 text-base h-12",
      lg: "px-8 py-4 text-lg h-14"
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={loading}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {children}
        </div>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";