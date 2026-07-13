"use client";

import { useReducedMotion } from "framer-motion";

export function Pin() {
  const reducedMotion = useReducedMotion();

  return (
    <g>
      {/* Outer pulsing ring — only when motion is allowed */}
      {!reducedMotion && (
        <circle r="14" fill="#f48b29" opacity="0.25">
          <animate
            attributeName="r"
            values="10;20;10"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Outer solid dot */}
      <circle r="7" fill="#f48b29" stroke="#0a0a0a" strokeWidth="2" />

      {/* Center hole (gives it a "pin" look) */}
      <circle r="2.5" fill="#0a0a0a" />
    </g>
  );
}
