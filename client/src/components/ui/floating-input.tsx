import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, icon, error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(e.target.value !== '');
    };

    return (
      <div className="relative">
        <div className="relative">
          {icon && (
            <div className={cn(
              "absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10",
              focused ? "text-pink-400" : "text-white/50"
            )}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "peer w-full h-14 px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm",
              "text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-pink-400/20 focus:border-pink-400",
              "transition-all duration-300",
              icon && "pl-12",
              error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
              className
            )}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <label
            className={cn(
              "absolute left-4 transition-all duration-300 pointer-events-none",
              icon && "left-12",
              focused || hasValue || props.value
                ? "top-2 text-xs text-pink-400"
                : "top-1/2 -translate-y-1/2 text-sm text-white/70"
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-400 animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";