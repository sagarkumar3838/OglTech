/**
 * Reusable Glass Card Component
 * 
 * A flexible glassmorphism card component with multiple variants
 * and built-in hover effects.
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  variant?: 'light' | 'medium' | 'strong' | 'ultra' | 'accent';
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({
  children,
  variant = 'medium',
  className,
  hover = true,
  onClick,
}: GlassCardProps) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  
  const variantClasses = {
    light: 'glass-light',
    medium: 'glass-card',
    strong: 'glass-strong',
    ultra: 'glass-ultra',
    accent: 'glass-card-accent',
  };

  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-2xl cursor-pointer'
    : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface GlassButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const GlassButton = ({
  children,
  variant = 'secondary',
  className,
  onClick,
  disabled = false,
  type = 'button',
}: GlassButtonProps) => {
  const variantClasses = {
    primary: 'glass-button-primary',
    secondary: 'glass-button',
  };

  return (
    <button
      type={type}
      className={cn(variantClasses[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface GlassInputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const GlassInput = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
}: GlassInputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn('glass-input w-full', className)}
    />
  );
};

interface GlassBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export const GlassBadge = ({
  children,
  variant = 'default',
  className,
}: GlassBadgeProps) => {
  const variantClasses = {
    default: 'glass-badge',
    success: 'glass-badge-success',
    warning: 'glass-badge-warning',
    error: 'glass-badge-error',
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
};

export default GlassCard;
