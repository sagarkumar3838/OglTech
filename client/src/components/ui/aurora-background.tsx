import React from 'react';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className,
  children,
  showRadialGradient = true,
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Aurora Effect */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        
        {/* Aurora layers */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '4s', animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400/30 to-teal-600/30 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '5s', animationDelay: '1s' }} />
        </div>
        
        {/* Moving aurora waves */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent transform -skew-y-12 animate-pulse" 
               style={{ animationDuration: '8s' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform skew-y-12 animate-pulse" 
               style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>
        
        {/* Radial gradient overlay */}
        {showRadialGradient && (
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
        )}
      </div>
      
      {children}
    </div>
  );
};