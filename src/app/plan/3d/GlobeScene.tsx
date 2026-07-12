"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ItineraryDay } from "@/data/itineraries";

type GlobeSceneProps = {
  days: ItineraryDay[];
};

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 1.05,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function MarkerPulse({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Sprite>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.3 + 0.2 * Math.sin(state.clock.elapsedTime * 3);
    }
  });

  return (
    <sprite ref={ref} position={position} scale={[0.1, 0.1, 1]}>
      <spriteMaterial
        color="#f48b29"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </sprite>
  );
}

function Marker({
  day,
  position,
  isSelected,
  onSelect,
}: {
  day: ItineraryDay;
  position: THREE.Vector3;
  isSelected: boolean;
  onSelect: (day: ItineraryDay | null) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group>
      <mesh
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(isSelected ? null : day);
        }}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#f48b29"
          emissive="#f48b29"
          emissiveIntensity={0.8}
        />
      </mesh>

      {hovered && <MarkerPulse position={position} />}

      {isSelected && (
        <Html
          position={position.clone().multiplyScalar(1.25)}
          center
          distanceFactor={8}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-[#1a1c1c]/95 border border-[#f48b29]/60 text-white text-xs rounded-lg px-3 py-2 max-w-[200px] shadow-lg backdrop-blur-sm">
            <p className="text-[#f48b29] font-semibold mb-0.5">
              Day {day.dayNumber} — {day.title}
            </p>
            <p className="text-white/70 mb-0.5">{day.location}</p>
            <p className="text-white/50 leading-tight">{day.description}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function GlobeScene({ days }: GlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (reducedMotion ? 0 : 0.15);
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += delta * (reducedMotion ? 0 : 0.15);
    }
  });

  const markers = days.map((day) => ({
    day,
    position: latLngToVector3(day.coords.lat, day.coords.lng),
  }));

  return (
    <group>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[1, 48, 48]} />
          <meshBasicMaterial
            color="#0a0a0a"
            transparent
            opacity={0.3}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.99, 32, 32]} />
          <meshStandardMaterial
            wireframe
            color="#f48b29"
            transparent
            opacity={0.15}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[1.002, 32, 32]} />
          <meshBasicMaterial
            wireframe
            color="#f48b29"
            transparent
            opacity={0.08}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            wireframe
            color="#f48b29"
            transparent
            opacity={0.25}
          />
        </mesh>

        {markers.map((marker) => (
          <Marker
            key={marker.day.dayNumber}
            day={marker.day}
            position={marker.position}
            isSelected={selectedDay?.dayNumber === marker.day.dayNumber}
            onSelect={setSelectedDay}
          />
        ))}
      </group>

      <mesh ref={glowRef}>
        <sphereGeometry args={[1.03, 32, 32]} />
        <meshBasicMaterial
          color="#f48b29"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {selectedDay && (
        <Html
          position={[0, 1.7, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-[#1a1c1c]/90 border border-[#f48b29]/40 text-white text-xs rounded-lg px-3 py-2 max-w-[240px] shadow-lg backdrop-blur-sm text-center">
            <p className="text-[#f48b29] font-semibold">{selectedDay.title}</p>
            <p className="text-white/60">{selectedDay.location}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
