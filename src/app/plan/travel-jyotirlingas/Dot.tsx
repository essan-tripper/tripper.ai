"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Point } from "@/lib/projection";

type DotProps = {
  point: Point;
  active: boolean;
  onClick: () => void;
};

export function Dot({ point, active, onClick }: DotProps) {
  const reducedMotion = useReducedMotion();

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Invisible larger hit area for mobile (30 viewBox units) */}
      <circle cx={point.x} cy={point.y} r="30" fill="transparent" />

      {/* Visible dot */}
      <motion.circle
        cx={point.x}
        cy={point.y}
        animate={{
          r: active ? (reducedMotion ? 8 : [6, 10, 6]) : 4,
        }}
        transition={{
          duration: 1.5,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        fill={active ? "#f48b29" : "#666666"}
      />
    </g>
  );
}
