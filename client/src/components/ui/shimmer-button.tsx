"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const ShimmerButton = ({
  children,
  className,
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  borderRadius = "100px",
  shimmerDuration = "3s",
  background = "rgba(0, 0, 0, 1)",
  onClick,
  disabled = false,
  ...props
}: ShimmerButtonProps) => {
  return (
    <motion.button
      style={{
        background: background,
        borderRadius: borderRadius,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-slate-800/50 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-slate-600/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, transparent 30%, ${shimmerColor} 50%, transparent 70%)`,
          backgroundSize: `${shimmerSize} ${shimmerSize}`,
          animation: `shimmer ${shimmerDuration} infinite`,
        }}
        className="opacity-0 transition-opacity duration-300 hover:opacity-100"
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.button>
  );
};


