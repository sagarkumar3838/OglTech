import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CleanCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl'
}

export function CleanCard({ children, className, hover = true, shadow = 'md' }: CleanCardProps) {
  const shadowClasses = {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl'
  }

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card',
        shadowClasses[shadow],
        hover && 'hover:border-primary/20 transition-all duration-300',
        'dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10',
        className
      )}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Light mode clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-white/5 dark:via-transparent dark:to-white/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle hover effect for light mode */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-50/30 dark:from-blue-500/5 dark:to-purple-500/5 pointer-events-none" />
    </motion.div>
  )
}