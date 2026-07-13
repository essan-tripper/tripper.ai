"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function DharmachakraMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.15;
    }
  });

  const spokesCount = 8;
  const spokes = Array.from({ length: spokesCount });

  return (
    <group ref={groupRef} rotation={[0.2, 0.2, 0]}>
      {/* Outer Rim */}
      <mesh>
        <torusGeometry args={[1.8, 0.12, 16, 100]} />
        <meshStandardMaterial color="#f48b29" wireframe />
      </mesh>

      {/* Inner Rim */}
      <mesh>
        <torusGeometry args={[1.5, 0.04, 8, 100]} />
        <meshStandardMaterial color="#f48b29" wireframe />
      </mesh>

      {/* Central Hub */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
        <meshStandardMaterial color="#f48b29" wireframe />
      </mesh>
      
      {/* Hub center hole */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.28, 16]} />
        <meshStandardMaterial color="#f48b29" wireframe />
      </mesh>

      {/* Spokes */}
      {spokes.map((_, index) => {
        const angle = (index / spokesCount) * Math.PI * 2;
        return (
          <group key={index} rotation={[0, 0, angle]}>
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 1.5, 8]} />
              <meshStandardMaterial color="#f48b29" wireframe />
            </mesh>
            {/* Sphere on spoke tip */}
            <mesh position={[0, 1.6, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#f48b29" wireframe />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function DharmachakraCanvas() {
  return (
    <div className="absolute inset-0 z-1 pointer-events-none opacity-15 flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[1, 1, 1]} intensity={1.0} />
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <DharmachakraMesh />
        </Float>
      </Canvas>
    </div>
  );
}
