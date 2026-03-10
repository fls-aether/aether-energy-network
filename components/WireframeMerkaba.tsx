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
  const materialRef2 = useRef<THREE.MeshStandardMaterial>(null);

  // Base rotation speed + intensity multiplier
  useFrame((state, delta) => {
    if (groupRef.current && !isFlattening) {
      groupRef.current.rotation.y += delta * (0.5 + intensity * 5);
      groupRef.current.rotation.x += delta * (0.2 + intensity * 2);
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
    if (materialRef2.current) {
      materialRef2.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef2.current.emissiveIntensity,
        targetEmissiveIntensity,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Upward pointing tetrahedron */}
      <mesh>
        <tetrahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          ref={materialRef1}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.5}
          wireframe={true}
          transparent={true}
          opacity={isFlattening ? 0 : 1}
        />
      </mesh>

      {/* Downward pointing tetrahedron */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <tetrahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          ref={materialRef2}
          color="#00f0ff"
          emissive="#00f0ff"
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
