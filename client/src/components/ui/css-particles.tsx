import { motion } from 'framer-motion'

export function CSSParticles() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 dark:from-blue-400/10 dark:to-purple-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          top: '10%',
          right: '10%',
        }}
      />
      
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-600/20 dark:from-pink-400/10 dark:to-orange-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          top: '50%',
          left: '5%',
        }}
      />
      
      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-600/20 dark:from-green-400/10 dark:to-blue-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          bottom: '10%',
          right: '30%',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/30 dark:bg-blue-400/20 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}