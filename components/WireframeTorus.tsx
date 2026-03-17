"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface WireframeTorusProps {
  intensity: number; // 0 to 1 based on typing/input length
}

export function WireframeTorus({ intensity }: WireframeTorusProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef1 = useRef<THREE.MeshStandardMaterial>(null);

  const lastTimeRef = useRef(0);

  // Base rotation speed + intensity multiplier
  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    const customDelta = elapsedTime - lastTimeRef.current;
    lastTimeRef.current = elapsedTime;

    if (groupRef.current) {
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
      {/* Core Geometric Torus */}
      <mesh>
        <torusGeometry args={[2, 0.4, 16, 100]} />
        <meshStandardMaterial
          ref={materialRef1}
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent={true}
        />
      </mesh>
      
      {/* Inner Vortex Torus 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.3, 16, 100]} />
         <meshStandardMaterial
          color="#9D00FF"
          emissive="#9D00FF"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent={true}
        />
      </mesh>

      {/* Inner Vortex Torus 2 */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1, 0.2, 16, 100]} />
         <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF8C00"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent={true}
        />
      </mesh>
      
      {/* Base lighting for the material */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}
