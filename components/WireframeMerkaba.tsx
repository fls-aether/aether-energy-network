"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface WireframeMerkabaProps {
  intensity: number; // 0 to 1 based on typing/input length
  isFlattening?: boolean; // For Phase 2 transition
}

export function WireframeMerkaba({ intensity, isFlattening = false }: WireframeMerkabaProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef1 = useRef<THREE.MeshStandardMaterial>(null);

  const lastTimeRef = useRef(0);

  // Base rotation speed + intensity multiplier
  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    const customDelta = elapsedTime - lastTimeRef.current;
    lastTimeRef.current = elapsedTime;

    if (groupRef.current && !isFlattening) {
      // Kinetic Dampening: Multiply intensity by a much smaller decimal to avoid frantic spinning
      groupRef.current.rotation.y += customDelta * (0.2 + intensity * 0.5);
      groupRef.current.rotation.x += customDelta * (0.1 + intensity * 0.2);
    }
    
    // Animate glow based on intensity
    const targetEmissiveIntensity = 0.5 + intensity * 3;
    if (materialRef1.current) {
      materialRef1.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef1.current.emissiveIntensity,
        targetEmissiveIntensity,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Complex Geometric Torus Knot */}
      <mesh>
        <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
        <meshStandardMaterial
          ref={materialRef1}
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent={true}
          opacity={isFlattening ? 0 : 1}
        />
      </mesh>
      
      {/* Base lighting for the material */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}
