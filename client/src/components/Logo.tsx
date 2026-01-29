interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizes = {
    sm: { 
      text: 'text-lg', 
      gap: 'gap-2' 
    },
    md: { 
      text: 'text-xl', 
      gap: 'gap-2' 
    },
    lg: { 
      text: 'text-3xl', 
      gap: 'gap-3' 
    },
  };

  const currentSize = sizes[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${currentSize.text} font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent`}>
            SkillEval
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium -mt-1">
            AI Assessment
          </span>
        </div>
      )}
    </div>
  );
};

// Simple icon-only version for favicon
export const LogoIcon = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
        SE
      </div>
    </div>
  );
};
