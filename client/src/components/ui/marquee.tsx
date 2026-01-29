"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: any;
}

export const Marquee = ({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) => {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <motion.div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "flex-row": !vertical,
              "flex-col": vertical,
            })}
            animate={{
              [vertical ? "y" : "x"]: reverse
                ? [0, vertical ? -100 : -50]
                : [vertical ? -100 : -50, 0],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              [vertical ? "y" : "x"]: reverse
                ? [0, vertical ? -100 : -50]
                : [vertical ? -100 : -50, 0],
            }}
          >
            {children}
          </motion.div>
        ))}
    </div>
  );
};


