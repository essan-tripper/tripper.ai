"use client";

import { useState } from "react";
import Image from "next/image";

const ENABLE_ZOOM = true;

interface ProductZoomProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

export function ProductZoom({ src, alt, sizes, priority, className = "", imgClassName = "" }: ProductZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [bgX, setBgX] = useState(50);
  const [bgY, setBgY] = useState(50);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBgX(x);
    setBgY(y);
    setIsZoomed(true);
  }

  function handleMouseLeave() {
    setIsZoomed(false);
  }

  const shared = (
    <div className={`relative rounded-xl overflow-hidden bg-black/40 aspect-[3/4] ${className}`}>
      {ENABLE_ZOOM ? (
        <div
          className="relative w-full h-full overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={`object-cover pointer-events-none select-none ${imgClassName}`}
            style={{ opacity: isZoomed ? 0 : 1 }}
          />
          <div
            className="absolute inset-0 bg-no-repeat pointer-events-none transition-opacity duration-150"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "200%",
              backgroundPosition: `${bgX}% ${bgY}%`,
              opacity: isZoomed ? 1 : 0,
            }}
          />
        </div>
      ) : (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imgClassName}`}
        />
      )}
    </div>
  );

  return shared;
}
