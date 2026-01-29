import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className
}) => {
  return (
    <div className={cn(
      "group relative p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10",
      "hover:bg-white/10 transition-all duration-300 hover:scale-105",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <p className="text-xs text-white/60 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};