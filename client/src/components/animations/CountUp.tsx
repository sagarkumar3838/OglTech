import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const CountUp = ({ 
  from = 0, 
  to, 
  duration = 2,
  suffix = '',
  className = ''
}: CountUpProps) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration });
      return controls.stop;
    }
  }, [isInView, count, to, duration]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};
