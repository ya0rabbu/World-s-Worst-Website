import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Sparkles, RefreshCw, Eye, Move } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

// 3D Spinning Torus Knot Mesh
function FloatingTorusKnot({ wireframe }: { wireframe: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.7;
      meshRef.current.rotation.y += delta * 0.9;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.25 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => playSound('beep')}
    >
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshStandardMaterial
        color={hovered ? '#ff007f' : '#00f0ff'}
        wireframe={wireframe}
        roughness={0.2}
        metalness={0.8}
        emissive={hovered ? '#550022' : '#002244'}
      />
    </mesh>
  );
}

// 3D Floating Satellites
function SatelliteCube({ position, color }: { position: [number, number, number]; color: string }) {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (cubeRef.current) {
      const t = state.clock.getElapsedTime();
      cubeRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.5;
      cubeRef.current.rotation.x += 0.02;
      cubeRef.current.rotation.y += 0.03;
    }
  });

  return (
    <mesh ref={cubeRef} position={position}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
    </mesh>
  );
}

export const ReactThreeFiberDisaster: React.FC = () => {
  const [wireframe, setWireframe] = useState(false);
  const [lightColor, setLightColor] = useState('#ffff00');
  const [rotationSpeed, setRotationSpeed] = useState(1);

  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-black border-4 border-cyan-400 p-4 sm:p-6 shadow-[8px_8px_0px_#000] text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-cyan-400 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400 animate-spin" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-cyan-400">
              REACT THREE FIBER (R3F) 3D HOLODECK
            </h3>
          </div>
          <p className="text-xs text-cyan-200 mt-1 font-mono">
            Declarative GPU Three.js pipeline inside React 19 Virtual DOM
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              playSound('coin');
              setWireframe(!wireframe);
            }}
            className={`px-3 py-1 font-mono text-xs font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] transition-colors ${
              wireframe ? 'bg-cyan-400 text-black' : 'bg-gray-800 text-cyan-300'
            }`}
          >
            {wireframe ? 'WIREFRAME: ON' : 'WIREFRAME: OFF'}
          </button>

          <button
            onClick={() => {
              playSound('glitch');
              const colors = ['#ffff00', '#ff00ff', '#00ffcc', '#ff3300', '#ffffff'];
              const next = colors[(colors.indexOf(lightColor) + 1) % colors.length];
              setLightColor(next);
            }}
            className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-xs font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            💡 SHIFT LIGHT
          </button>
        </div>
      </div>

      <div className="relative w-full h-80 sm:h-96 bg-black/90 border-2 border-cyan-500 rounded-sm overflow-hidden">
        {/* Canvas 3D Viewport */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color={lightColor} />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00ffff" />

          <Float speed={2 * rotationSpeed} rotationIntensity={1.5} floatIntensity={2}>
            <FloatingTorusKnot wireframe={wireframe} />
          </Float>

          <SatelliteCube position={[-2.4, 1.2, 0]} color="#ff0055" />
          <SatelliteCube position={[2.4, -1.2, 0]} color="#00ff66" />
          <SatelliteCube position={[1.8, 1.6, -1]} color="#ffaa00" />
          <SatelliteCube position={[-1.8, -1.6, -1]} color="#aa00ff" />

          <OrbitControls enableZoom={true} enablePan={false} autoRotate={true} autoRotateSpeed={rotationSpeed} />
        </Canvas>

        {/* 3D Viewport HUD Overlay */}
        <div className="absolute top-2 left-2 pointer-events-none bg-black/80 px-2.5 py-1 border border-cyan-400/80 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
          <Move className="w-3 h-3 text-yellow-300" />
          <span>DRAG TO ROTATE 3D CAMERA &bull; SCROLL TO ZOOM</span>
        </div>

        <div className="absolute bottom-2 right-2 pointer-events-none bg-black/80 px-2 py-0.5 border border-cyan-400/80 text-[10px] font-mono text-lime-400">
          WEBGL2 / 60 FPS / GLTF READY
        </div>
      </div>
    </div>
  );
};
