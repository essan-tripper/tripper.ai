"use client";

import { motion, type MotionValue } from "framer-motion";
import { jyotirlingas } from "@/data/jyotirlingas";
import { dotPositions } from "@/lib/polyline";
import { Pin } from "./Pin";
import { Dot } from "./Dot";
import IndiaOutline from "./IndiaOutline";

type IndiaMapProps = {
  pinX: MotionValue<number>;
  pinY: MotionValue<number>;
  activeIndex: number;
  onDotClick: (index: number) => void;
};

export function IndiaMap({ pinX, pinY, activeIndex, onDotClick }: IndiaMapProps) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* India outline */}
      <IndiaOutline className="text-[#2a2a2a] w-full h-full" />

      {/* Dots */}
      {dotPositions.map((p, i) => (
        <Dot
          key={jyotirlingas[i].id}
          point={p}
          active={activeIndex === i}
          onClick={() => onDotClick(i)}
        />
      ))}

      {/* Active label */}
      {dotPositions.map((p, i) => (
        <motion.text
          key={`label-${jyotirlingas[i].id}`}
          x={p.x + 14}
          y={p.y + 4}
          fill="#f48b29"
          fontSize="14"
          fontFamily="var(--font-inter)"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeIndex === i ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: "none" }}
        >
          {jyotirlingas[i].name}
        </motion.text>
      ))}

      {/* Pin (last so it sits on top) */}
      <motion.g style={{ x: pinX, y: pinY }} className="pointer-events-none">
        <Pin />
      </motion.g>
    </svg>
  );
}
