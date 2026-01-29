"use client";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

export const GoogleGeminiEffect = ({
  className,
  title,
  description,
  pathLengths,
}: {
  className?: string;
  title?: string;
  description?: string;
  pathLengths: MotionValue<number>[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const paths = [
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1.2]),
    useTransform(scrollYProgress, [0.2, 0.4], [0.15, 1.2]),
    useTransform(scrollYProgress, [0.4, 0.6], [0.1, 1.2]),
    useTransform(scrollYProgress, [0.6, 0.8], [0.05, 1.2]),
    useTransform(scrollYProgress, [0.8, 1], [0, 1.2]),
  ];

  return (
    <div
      className={cn(
        "h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip",
        className
      )}
      ref={ref}
    >
      <div className="sticky top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-center text-white">
            {title || `Build with Aceternity UI`}
          </h2>
          <p className="text-lg text-center text-white max-w-md mt-2">
            {description ||
              `Scroll this component and see the bottom SVG come to life wow this works!`}
          </p>
        </div>
      </div>

      <svg
        className="w-full h-auto"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          d="M 20, 50 C 20, 20, 80, 20, 80, 50 S 20, 80, 20, 50"
          style={{ pathLength: paths[0] }}
        />
        <motion.path
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          d="M 20, 50 C 20, 80, 80, 80, 80, 50 S 20, 20, 20, 50"
          style={{ pathLength: paths[1] }}
        />
        <motion.path
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          d="M 20, 50 C 30, 20, 70, 20, 80, 50 S 30, 80, 20, 50"
          style={{ pathLength: paths[2] }}
        />
        <motion.path
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          d="M 20, 50 C 30, 80, 70, 80, 80, 50 S 30, 20, 20, 50"
          style={{ pathLength: paths[3] }}
        />
        <motion.path
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          d="M 20, 50 C 40, 20, 60, 20, 80, 50 S 40, 80, 20, 50"
          style={{ pathLength: paths[4] }}
        />
        <defs>
          <linearGradient
            id="gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="100"
            y2="0"
          >
            <stop stopColor="#18CCFC" />
            <stop offset="1" stopColor="#6344F5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
