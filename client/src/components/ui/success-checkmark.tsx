import React from 'react';
import { cn } from '@/lib/utils';

interface SuccessCheckmarkProps {
  className?: string;
  size?: number;
}

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  className,
  size = 24
}) => {
  return (
    <div className={cn("relative", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-in zoom-in duration-500"
      >
        <circle
          cx="12"
          cy="12"
          r="11"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
        <path
          d="M8 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-in slide-in-from-left-2 duration-700 delay-300"
          style={{
            strokeDasharray: '10',
            strokeDashoffset: '10',
            animation: 'drawCheck 0.5s ease-in-out 0.3s forwards'
          }}
        />
      </svg>
      
      <style jsx>{`
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};