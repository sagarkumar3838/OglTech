"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const updatePath = () => {
      if (
        !containerRef.current ||
        !fromRef.current ||
        !toRef.current ||
        !svgRef.current
      ) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      const cpx1 = midX - curvature;
      const cpy1 = midY - curvature;
      const cpx2 = midX + curvature;
      const cpy2 = midY + curvature;

      const path = `M ${startX} ${startY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${endX} ${endY}`;

      setPathD(path);

      const svgRect = svgRef.current.getBoundingClientRect();
      setSvgDimensions({
        w: svgRect.width,
        h: svgRect.height,
      });
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${svgDimensions.w} ${svgDimensions.h}`}
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        reverse ? "scale-x-[-1]" : "",
        className
      )}
      style={{
        filter: "drop-shadow(0 0 6px rgb(0 0 0 / 0.4))",
      }}
    >
      <defs>
        <linearGradient
          id="gradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientStopColor} />
        </linearGradient>
      </defs>
      <motion.path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: "easeInOut" }}
      />
      <motion.path
        d={pathD}
        stroke="url(#gradient)"
        strokeWidth={pathWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: "easeInOut" }}
      />
    </svg>
  );
};


