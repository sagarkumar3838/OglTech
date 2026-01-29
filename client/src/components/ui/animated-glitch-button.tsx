import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGlitchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedGlitchButton: React.FC<AnimatedGlitchButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantStyles = {
    default: 'bg-gray-800 text-white hover:bg-gray-700',
    outline: 'bg-transparent text-gray-800 border-2 border-gray-800 hover:bg-gray-800 hover:text-white'
  };

  return (
    <>
      <style>{`
        @keyframes chitchat {
          0% { content: "#"; }
          5% { content: "."; }
          10% { content: "^{"; }
          15% { content: "-!"; }
          20% { content: "#$_"; }
          25% { content: "№:0"; }
          30% { content: "#{+."; }
          35% { content: "@}-?"; }
          40% { content: "?{4@%"; }
          45% { content: "=.,^!"; }
          50% { content: "?2@%"; }
          55% { content: "\\;1}]"; }
          60% { content: "?{%:%"; right: 0; }
          65% { content: "|{f[4"; right: 0; }
          70% { content: "{4%0%"; right: 0; }
          75% { content: "'1_0<"; right: 0; }
          80% { content: "{0%"; right: 0; }
          85% { content: "]>'"; right: 0; }
          90% { content: "4"; right: 0; }
          95% { content: "2"; right: 0; }
          100% { content: ""; right: 0; }
        }
        
        .glitch-btn:hover .glitch-text::before,
        .glitch-btn:focus .glitch-text::before {
          animation: chitchat 1.2s linear both;
        }
        
        .glitch-text::before {
          box-sizing: border-box;
          position: absolute;
          content: "";
          background: inherit;
        }
        
        .glitch-btn:hover .glitch-text,
        .glitch-btn:focus .glitch-text {
          color: #FAC921;
        }
      `}</style>
      <button
        className={cn(
          'glitch-btn',
          'box-border flex items-center justify-center border-none cursor-pointer overflow-hidden transition-all duration-300',
          'font-mono font-semibold tracking-wider shadow-lg hover:shadow-xl',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <span className="glitch-text relative transition-colors duration-300">
          {children}
        </span>
      </button>
    </>
  );
};