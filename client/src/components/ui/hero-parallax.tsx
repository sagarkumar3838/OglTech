"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

interface HeroParallaxProps {
  products: Product[];
}

export const HeroParallax = ({ products }: HeroParallaxProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["10%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative h-[300vh] overflow-hidden antialiased"
      style={{
        background: "#BEBFC5",
      }}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center text-white">
        <motion.div
          style={{ opacity }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: "#FFF0F5" }}>
            OGL Courses
          </h1>
          <p className="text-xl md:text-2xl mb-8" style={{ color: "#FFF0F5" }}>
            Comprehensive Oracle Global Learning courses and Oracle SaaS product training
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-20">
        <motion.div
          style={{ y }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 mt-[40vh]"
        >
          {products.map((product, i) => (
            <div
              key={i}
              className="group relative h-64 w-full overflow-hidden rounded-lg"
              style={{
                background: "#58111A",
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${product.thumbnail})`,
                }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300" />

              {/* Oracle Logo and Heading at Top */}
              <div className="absolute top-0 left-0 right-0 p-3" style={{ background: "rgba(255, 240, 245, 0.9)" }}>
                <div className="flex items-center justify-center space-x-2">
                  {/* Oracle Logo SVG */}
                  <svg width="32" height="32" viewBox="0 0 32 32" className="flex-shrink-0">
                    <circle cx="16" cy="16" r="15" fill="#FF0000"/>
                    <text x="16" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">ORCL</text>
                  </svg>
                  <span className="text-sm font-bold text-gray-800">Oracle</span>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 pt-16">
                <h3 className="text-lg font-bold mb-2 group-hover:text-yellow-400 transition-colors duration-300" style={{ color: "#FFF0F5" }}>
                  {product.title}
                </h3>
                {product.link.startsWith('/') ? (
                  <a
                    href={product.link}
                    className="transition-colors duration-300 text-sm hover:text-yellow-300"
                    style={{ color: "#FFF0F5" }}
                  >
                    View Course →
                  </a>
                ) : (
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 text-sm hover:text-yellow-300"
                    style={{ color: "#FFF0F5" }}
                  >
                    Learn More →
                  </a>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
