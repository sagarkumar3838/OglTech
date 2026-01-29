import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function GlassCard({ children, className, hover = true, gradient = false }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl',
        'bg-white/5 dark:bg-white/5',
        gradient && 'bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent',
        hover && 'hover:border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500',
        className
      )}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </motion.div>
  )
}