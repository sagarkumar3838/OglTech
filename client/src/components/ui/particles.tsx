"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  ease?: number;
  color?: string;
  size?: number;
  refresh?: boolean;
}

export const Particles = ({
  className,
  quantity = 30,
  ease = 50,
  color = "#ffffff",
  size = 0.4,
  refresh = false,
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrame = useRef<number>();
  const particles = useRef<any[]>([]);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    if (refresh) {
      initCanvas();
    }
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      particles.current = [];
      const { w, h } = canvasContainerRef.current.getBoundingClientRect();
      const newDpr = window.devicePixelRatio || 1;
      setDpr(newDpr);
      setCanvasSize({ w, h });
      canvasRef.current.width = w * newDpr;
      canvasRef.current.height = h * newDpr;
      context.current.scale(newDpr, newDpr);
      canvasRef.current.style.width = `${w}px`;
      canvasRef.current.style.height = `${h}px`;
    }
  };

  const particlePos = (particle: any) => {
    const value = particle.xa * particle.xa + particle.ya * particle.ya;
    if (value === 0) {
      particle.xa += (Math.random() - 0.5) * 0.01;
      particle.ya += (Math.random() - 0.5) * 0.01;
    }
    particle.x += particle.xa;
    particle.y += particle.ya;
    particle.xa *= ease;
    particle.ya *= ease;
  };

  const drawParticle = (particle: any) => {
    if (context.current) {
      context.current.beginPath();
      context.current.arc(particle.x, particle.y, particle.l, 0, 2 * Math.PI);
      context.current.fillStyle = particle.color;
      context.current.fill();
    }
  };

  const drawParticles = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.w, canvasSize.h);
      particles.current.forEach((particle) => {
        particlePos(particle);
        drawParticle(particle);
      });
    }
  };

  const animate = () => {
    if (refresh) {
      initCanvas();
    }
    drawParticles();
    animationFrame.current = requestAnimationFrame(animate);
  };


  useEffect(() => {
    if (canvasSize.w && canvasSize.h) {
      particles.current = [];
      for (let i = 0; i < quantity; i++) {
        particles.current.push({
          x: Math.random() * canvasSize.w,
          y: Math.random() * canvasSize.h,
          xa: 2 * Math.random() - 1,
          ya: 2 * Math.random() - 1,
          max: 6000,
          color: color,
          l: Math.random() * size,
        });
      }
    }
  }, [canvasSize.w, canvasSize.h, quantity, color, size]);

  return (
    <div className={cn("pointer-events-none", className)} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};
