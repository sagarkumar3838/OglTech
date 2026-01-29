"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
  gradientOpacity?: number;
  gradientSize?: string;
  borderWidth?: number;
  duration?: number;
  spotlightColor?: string;
  spotlightSize?: string;
  spotlightOpacity?: number;
}

export const MagicCard = ({
  children,
  className,
  gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  gradientOpacity = 0.1,
  gradientSize = "200%",
  borderWidth = 1,
  duration = 3,
  spotlightColor = "white",
  spotlightSize = "600px",
  spotlightOpacity = 0.1,
}: MagicCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border bg-background p-6 shadow-2xl",
        className
      )}
      style={{
        backgroundImage: gradient,
        backgroundSize: gradientSize,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${spotlightColor} 60deg, transparent 120deg)`,
          filter: `blur(${spotlightSize})`,
          opacity: spotlightOpacity,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(${spotlightSize} circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 40%)`,
          opacity: spotlightOpacity,
        }}
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};


