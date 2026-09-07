import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playSound } from '../utils/audioSynth';
import { Box, RefreshCw, Zap, Sparkles, AlertTriangle, Eye } from 'lucide-react';

import cursedServer from '../assets/images/cursed_server_disaster_1788755308246.jpg';
import cursedDiy from '../assets/images/cursed_diy_craft_1788754970424.jpg';
import cursedFood from '../assets/images/cursed_food_recipe_1788754985383.jpg';
import cursedFurniture from '../assets/images/cursed_diy_furniture_1788755324776.jpg';

interface ThreeDisasterCanvasProps {
  onAddRage: () => void;
}

export const ThreeDisasterCanvas: React.FC<ThreeDisasterCanvasProps> = ({ onAddRage }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [particleCount, setParticleCount] = useState(60);
  const [isExploded, setIsExploded] = useState(false);

  // References to Three.js objects to mutate in animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const wireMeshRef = useRef<THREE.Mesh | null>(null);
  const cubesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 320;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x11052c); // Deep chaotic purple
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0055, 3, 50);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x00ffff, 3, 50);
    pointLight2.position.set(-4, -4, 4);
    scene.add(pointLight2);

    // 5. Mesh Group
    const group = new THREE.Group();
    scene.add(group);
    meshGroupRef.current = group;

    // Center Giant Wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    group.add(icoMesh);
    wireMeshRef.current = icoMesh;

    // 6. Cursed Texture Cubes in 3D orbit
    const textureLoader = new THREE.TextureLoader();
    const textures = [
      textureLoader.load(cursedServer),
      textureLoader.load(cursedDiy),
      textureLoader.load(cursedFood),
      textureLoader.load(cursedFurniture),
    ];

    const cubes: THREE.Mesh[] = [];
    const positions = [
      [-3.2, 1.5, 0],
      [3.2, 1.5, 0],
      [-2.8, -1.8, 1],
      [2.8, -1.8, 1],
    ];

    textures.forEach((tex, i) => {
      const cubeGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      const cubeMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.4,
        metalness: 0.2,
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(positions[i][0], positions[i][1], positions[i][2]);
      group.add(cube);
      cubes.push(cube);
    });
    cubesRef.current = cubes;

    // 7. Floating Chaos Particle Dust
    const particleGeo = new THREE.BufferGeometry();
    const count = 120;
    const posArray = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8,
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * rotationSpeed;

      // Rotate central icosahedron
      if (icoMesh) {
        icoMesh.rotation.x = elapsedTime * 0.4;
        icoMesh.rotation.y = elapsedTime * 0.6;
      }

      // Rotate & wobble cubes
      cubes.forEach((cube, idx) => {
        cube.rotation.x += 0.015 * rotationSpeed;
        cube.rotation.y += 0.02 * rotationSpeed;
        const offset = idx * Math.PI * 0.5;
        cube.position.y += Math.sin(elapsedTime * 2 + offset) * 0.005;
      });

      // Float particle swarm
      particleMesh.rotation.y = -elapsedTime * 0.1;
      particleMesh.rotation.x = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [rotationSpeed]);

  // Dynamic Wireframe Toggle
  const toggleWireframe = () => {
    playSound('glitch');
    onAddRage();
    const next = !wireframeMode;
    setWireframeMode(next);
    if (wireMeshRef.current) {
      (wireMeshRef.current.material as THREE.MeshStandardMaterial).wireframe = next;
    }
    cubesRef.current.forEach((c) => {
      (c.material as THREE.MeshStandardMaterial).wireframe = next;
    });
  };

  // Explode geometry out
  const handleExplode = () => {
    playSound('honk');
    onAddRage();
    setIsExploded(!isExploded);
    const factor = isExploded ? 0.5 : 2.0;
    cubesRef.current.forEach((cube) => {
      cube.position.x *= factor;
      cube.position.y *= factor;
      cube.position.z *= factor;
    });
  };

  const handleSpeedBoost = () => {
    playSound('coin');
    onAddRage();
    setRotationSpeed((s) => (s >= 5 ? 1 : s + 1.5));
  };

  return (
    <div className="bg-black border-4 border-yellow-400 p-4 shadow-[8px_8px_0px_#000] text-white font-['Comic_Neue',cursive] mb-8">
      {/* Three.js Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-lime-400 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-cyan-400 animate-spin" />
          <h3 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-yellow-300">
            THREE.JS 3D DISASTER MATRIX
          </h3>
          <span className="bg-red-600 text-white text-[9px] font-mono px-2 py-0.5 font-bold uppercase">
            WebGL 2.0 Catastrophe
          </span>
        </div>

        {/* 3D Interactive Controls */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            onClick={toggleWireframe}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-2.5 py-1 border border-white shadow-[2px_2px_0px_#fff] cursor-pointer flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            {wireframeMode ? 'Disable Wireframe' : 'Wireframe Glitch'}
          </button>

          <button
            onClick={handleSpeedBoost}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-2.5 py-1 border border-white shadow-[2px_2px_0px_#fff] cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" />
            Speed: {rotationSpeed.toFixed(1)}x
          </button>

          <button
            onClick={handleExplode}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-2.5 py-1 border border-white shadow-[2px_2px_0px_#fff] cursor-pointer flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {isExploded ? 'Reassemble 3D' : 'Explode Polygons'}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-[320px] rounded-lg overflow-hidden border-2 border-cyan-400 relative bg-black shadow-inner cursor-grab active:cursor-grabbing"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px] font-mono text-gray-400">
        <div>
          🎮 <strong>Interactive 3D Objects:</strong> Central Icosahedron Wireframe + 4 Orbiting Cursed Pinterest Texture Cubes with vertex specular reflections.
        </div>
        <div className="text-lime-400 font-bold">
          Renderer: Three.js r174 (GPU Accelerated Agony)
        </div>
      </div>
    </div>
  );
};
