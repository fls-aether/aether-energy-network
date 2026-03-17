"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface WireframeMetatronsCubeProps {
  intensity: number;
}

export function WireframeMetatronsCube({ intensity }: WireframeMetatronsCubeProps) {
  const dodecahedronRef = useRef<THREE.Group>(null);
  const icosahedronRef = useRef<THREE.Group>(null);
  const starTetrahedronRef = useRef<THREE.Group>(null);

  const materialRef1 = useRef<THREE.MeshStandardMaterial>(null);
  const materialRef2 = useRef<THREE.MeshStandardMaterial>(null);
  const materialRef3 = useRef<THREE.MeshStandardMaterial>(null);

  const lastTimeRef = useRef(0);

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    const customDelta = elapsedTime - lastTimeRef.current;
    lastTimeRef.current = elapsedTime;

    const baseSpeed = 0.2 + intensity * 0.5;

    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.y += customDelta * baseSpeed * 0.5;
      dodecahedronRef.current.rotation.x += customDelta * baseSpeed * 0.3;
    }
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.y -= customDelta * baseSpeed * 0.8;
      icosahedronRef.current.rotation.z += customDelta * baseSpeed * 0.4;
    }
    if (starTetrahedronRef.current) {
      starTetrahedronRef.current.rotation.x -= customDelta * baseSpeed * 1.2;
      starTetrahedronRef.current.rotation.y += customDelta * baseSpeed * 1.0;
    }
    
    const targetEmissiveIntensity = 0.5 + intensity * 3;
    [materialRef1, materialRef2, materialRef3].forEach(ref => {
      if (ref.current) {
        ref.current.emissiveIntensity = THREE.MathUtils.lerp(
          ref.current.emissiveIntensity,
          targetEmissiveIntensity,
          0.1
        );
      }
    });
  });

  return (
    <group>
      {/* Outer Dodecahedron */}
      <group ref={dodecahedronRef}>
        <mesh>
          <dodecahedronGeometry args={[2.5]} />
          <meshStandardMaterial
            ref={materialRef1}
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={0.5}
            wireframe={true}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Inner Icosahedron */}
      <group ref={icosahedronRef}>
        <mesh>
          <icosahedronGeometry args={[1.8]} />
          <meshStandardMaterial
            ref={materialRef2}
            color="#9D00FF"
            emissive="#9D00FF"
            emissiveIntensity={0.5}
            wireframe={true}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Center Star Tetrahedron (Merkaba style) */}
      <group ref={starTetrahedronRef}>
        <mesh>
          <tetrahedronGeometry args={[1.2]} />
          <meshStandardMaterial
            ref={materialRef3}
            color="#FF8C00"
            emissive="#FF8C00"
            emissiveIntensity={0.5}
            wireframe={true}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
        <mesh rotation={[Math.PI, 0, Math.PI / 2]}>
          <tetrahedronGeometry args={[1.2]} />
          <meshStandardMaterial
            color="#FF8C00"
            emissive="#FF8C00"
            emissiveIntensity={0.5}
            wireframe={true}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      </group>
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}
