"use client";
import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionAllowed } from "./use-motion";

/** Tilts its child from a slanted "screen on a desk" angle to flat as it scrolls into view. */
export function ScrollTilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const allowed = useMotionAllowed();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <div ref={ref} className={className} style={{ perspective: 1800 }}>
      <motion.div style={allowed ? { rotateX, scale, y, transformOrigin: "50% 0%" } : undefined}>{children}</motion.div>
    </div>
  );
}
