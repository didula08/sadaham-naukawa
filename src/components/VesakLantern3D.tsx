"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Gokkola (Young Coconut Leaf) & Coir Palette
const gokkolaColors = [
  { leaf: "#d9e09d", glow: "#ff7300" }, // Pale green (Fresh Gokkola)
  { leaf: "#e8e4a9", glow: "#ff8c00" }, // Pale yellow (Slightly dried Gokkola)
  { leaf: "#c3cc7e", glow: "#e65c00" }, // Deeper green
];

const EKEL_COLOR = "#635132"; // Dried coconut leaf midrib (Ekel / Iratu)
const COIR_COLOR = "#b88c51"; // Coconut fiber (Coir)

// Reusable satellite lantern (Atapattam)
function SatelliteLantern({ position, scale = 1, rotation = [0, 0, 0], themeIndex = 0 }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const theme = gokkolaColors[themeIndex % gokkolaColors.length];
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position} scale={scale} rotation={rotation} ref={groupRef}>
      {/* Ekel (Coconut Midrib) Frame */}
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color={EKEL_COLOR} 
          wireframe 
          wireframeLinewidth={3}
          roughness={1}
        />
      </mesh>
      
      {/* Gokkola Woven Leaf Body */}
      <mesh>
        <octahedronGeometry args={[0.96, 0]} />
        <meshStandardMaterial 
          color={theme.leaf} 
          transparent
          opacity={0.9} // Leaves are more opaque than paper
          emissive={theme.glow}
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
          roughness={0.8} // Natural waxy leaf texture
        />
      </mesh>
      
      {/* Woven pattern simulation (subtle wireframe over the leaf) */}
      <mesh>
        <octahedronGeometry args={[0.98, 1]} /> {/* Detail 1 adds extra lines to look like woven leaves */}
        <meshStandardMaterial 
          color={theme.leaf} 
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Hanging Coir String (Top) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.5]} />
        <meshStandardMaterial color={COIR_COLOR} roughness={1} />
      </mesh>

      {/* Gokkola Leaf Strip Frills (Flat, wide strips like real coconut leaves) */}
      {[0, 1, 2, 3].map((i) => (
        <group 
          key={`frill-${i}`}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.5, 
            -1.4, 
            Math.sin((i * Math.PI) / 2) * 0.5
          ]}
          rotation={[0, -(i * Math.PI) / 2, 0]}
        >
          <mesh>
            {/* Flat box geometry to mimic a cut leaf strip */}
            <boxGeometry args={[0.15, 1.2, 0.01]} />
            <meshStandardMaterial color={theme.leaf} emissive={theme.glow} emissiveIntensity={0.2} roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Center Gokkola Tassel */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[0.2, 1.6, 0.02]} />
        <meshStandardMaterial color={theme.leaf} emissive={theme.glow} emissiveIntensity={0.2} roughness={0.8} />
      </mesh>
    </group>
  );
}

function ComplexLantern() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002; 
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.015; 
    }
  });

  const armsTier1 = useMemo(() => [0, Math.PI/2, Math.PI, Math.PI*1.5], []);
  const armsTier2 = useMemo(() => Array.from({length: 8}).map((_, i) => (i * Math.PI * 2) / 8), []);

  return (
    <group ref={groupRef} scale={0.75} position={[0, 1.5, 0]}>
      
      {/* ================= CENTRAL PILLAR (Main Gokkola Structure) ================= */}
      <group>
        {/* Main Body Gokkola Leaf */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2, 2, 5, 8]} />
          <meshStandardMaterial 
            color="#e8e4a9" 
            transparent
            opacity={0.95}
            emissive="#ff7300"
            emissiveIntensity={0.7}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
        {/* Weave lines for main body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.01, 2.01, 5.01, 16, 5]} />
          <meshStandardMaterial color="#c3cc7e" wireframe transparent opacity={0.2} />
        </mesh>
        {/* Main Body Ekel Frame */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.02, 2.02, 5.02, 8]} />
          <meshStandardMaterial color={EKEL_COLOR} wireframe roughness={1} />
        </mesh>

        {/* Top Tier (Woven Roof) */}
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.5, 2, 2, 8]} />
          <meshStandardMaterial color="#d9e09d" transparent opacity={0.95} emissive="#ff8c00" emissiveIntensity={0.5} roughness={0.8} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.51, 2.01, 2.01, 8, 3]} />
          <meshStandardMaterial color="#c3cc7e" wireframe transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.52, 2.02, 2.02, 8]} />
          <meshStandardMaterial color={EKEL_COLOR} wireframe roughness={1} />
        </mesh>

        {/* Bottom Tier */}
        <mesh position={[0, -3.5, 0]}>
          <cylinderGeometry args={[2, 0.5, 2, 8]} />
          <meshStandardMaterial color="#d9e09d" transparent opacity={0.95} emissive="#ff8c00" emissiveIntensity={0.5} roughness={0.8} />
        </mesh>
        <mesh position={[0, -3.5, 0]}>
          <cylinderGeometry args={[2.02, 0.52, 2.02, 8]} />
          <meshStandardMaterial color={EKEL_COLOR} wireframe roughness={1} />
        </mesh>
        
        {/* Massive Center Gokkola Leaf Strips */}
        {[0, 1, 2].map((i) => (
          <mesh key={`center-tassel-${i}`} position={[(i-1)*0.4, -6, 0]} rotation={[0, i * Math.PI / 3, 0]}>
             <boxGeometry args={[0.3, 3, 0.02]} />
             <meshStandardMaterial color="#e8e4a9" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ================= SATELLITES (TIER 1 - TOP ARMS) ================= */}
      {armsTier1.map((angle, i) => {
        const radius = 4.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={`t1-${i}`}>
            {/* Coconut Ekel / Wood Arm */}
            <mesh position={[x/2, 2, z/2]} rotation={[0, -angle, Math.PI/2]}>
              <cylinderGeometry args={[0.06, 0.04, radius]} />
              <meshStandardMaterial color={EKEL_COLOR} roughness={1} />
            </mesh>
            <SatelliteLantern position={[x, 1, z]} scale={0.9} themeIndex={0} />
          </group>
        );
      })}

      {/* ================= SATELLITES (TIER 2 - MIDDLE ARMS) ================= */}
      {armsTier2.map((angle, i) => {
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={`t2-${i}`}>
             {/* Coconut Ekel / Wood Arm */}
             <mesh position={[x/2, -1, z/2]} rotation={[0, -angle, Math.PI/2]}>
              <cylinderGeometry args={[0.05, 0.03, radius]} />
              <meshStandardMaterial color={EKEL_COLOR} roughness={1} />
            </mesh>
            <SatelliteLantern position={[x, -2, z]} scale={1.2} themeIndex={i % 2 === 0 ? 1 : 2} />
          </group>
        );
      })}

    </group>
  );
}

export default function VesakLantern3D() {
  return (
    <div className="w-full h-[600px] lg:h-[800px] relative pointer-events-none flex items-center justify-center overflow-visible">
      {/* Soft warm oil-lamp glow in the background */}
      <div className="absolute inset-0 bg-[#e65c00]/10 blur-[150px] rounded-full z-0" />
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 24], fov: 45 }}>
          <ambientLight intensity={1} />
          {/* Fire/Clay lamp style warm point lights illuminating the leaves */}
          <pointLight position={[10, 10, 10]} intensity={2} color="#ffb066" />
          <pointLight position={[-10, -5, -10]} intensity={1.5} color="#ff6600" />
          <pointLight position={[0, -5, 5]} intensity={1} color="#e8e4a9" />
          
          <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
            <ComplexLantern />
          </Float>
        </Canvas>
      </div>
    </div>
  );
}
