import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { playSound } from '../utils/audioSynth';
import { MousePointer2, Move, Sparkles, Wind, Layers, AlertCircle, Compass } from 'lucide-react';

import cursedTeapot from '../assets/images/cursed_diy_craft_1788754970424.jpg';
import cursedJello from '../assets/images/cursed_food_recipe_1788754985383.jpg';
import cursedFurniture from '../assets/images/cursed_diy_furniture_1788755324776.jpg';

interface MotionDisasterSuiteProps {
  onAddRage: () => void;
  onToggleEarthquake: (enabled: boolean) => void;
}

export const MotionDisasterSuite: React.FC<MotionDisasterSuiteProps> = ({ onAddRage, onToggleEarthquake }) => {
  const [magneticRepel, setMagneticRepel] = useState(true);
  const [scrollHijacked, setScrollHijacked] = useState(false);
  const [earthquakeActive, setEarthquakeActive] = useState(false);
  const [stickers, setStickers] = useState([
    { id: 1, img: cursedTeapot, label: 'Teapot Entity', x: 20, y: 10, rot: -8 },
    { id: 2, img: cursedJello, label: '1974 Jello Aspic', x: 180, y: 35, rot: 12 },
    { id: 3, img: cursedFurniture, label: 'Leopard Toilet Throne', x: 340, y: 15, rot: -5 },
  ]);

  // Framer Motion 3D Card Tilt state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [25, -25]);
  const rotateY = useTransform(mouseX, [-100, 100], [-25, 25]);

  const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeaveTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleScrollHijack = () => {
    playSound('glitch');
    onAddRage();
    const next = !scrollHijacked;
    setScrollHijacked(next);
    if (next) {
      alert('WEBFLOW GSAP INERTIA HIJACKED: Your mouse wheel is now mapped to reverse hyperspace!');
    }
  };

  const toggleQuake = () => {
    playSound('honk');
    onAddRage();
    const next = !earthquakeActive;
    setEarthquakeActive(next);
    onToggleEarthquake(next);
  };

  return (
    <div className="bg-fuchsia-100 border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_#000] font-['Comic_Neue',cursive] mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-pink-700 text-white p-3 border-2 border-black flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-yellow-300 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-300 animate-bounce" />
            FRAMER MOTION & WEBFLOW / GSAP CHAOS ENGINE
          </h3>
          <p className="text-[11px] font-mono text-pink-200 mt-1">
            Physics-Based Malice: Spring Elasticity, Magnetic Repulsion & Kinetic Inertia
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={toggleQuake}
            className={`px-3 py-1 font-bold border border-black shadow-[2px_2px_0px_#000] cursor-pointer ${
              earthquakeActive ? 'bg-red-600 text-white animate-pulse' : 'bg-yellow-300 text-black'
            }`}
          >
            {earthquakeActive ? '🛑 Stop GSAP Earthquake' : '🌋 Trigger GSAP Earthquake'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Module 1: Magnetic / Repelling Physics Anti-Button */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-950 uppercase border-b pb-1 mb-2">
              <MousePointer2 className="w-4 h-4 text-red-600" />
              1. Framer Spring Repulsion Button
            </div>
            <p className="text-xs text-gray-700 mb-3">
              Modern websites use magnetic cursor attraction. We inverted the magnetic field so this button physically runs away from your cursor with spring damping:
            </p>
          </div>

          <div className="h-36 bg-purple-50 border-2 border-dashed border-purple-400 rounded-lg relative overflow-hidden flex items-center justify-center">
            <motion.button
              whileHover={{
                x: (Math.random() - 0.5) * 160,
                y: (Math.random() - 0.5) * 80,
                rotate: (Math.random() - 0.5) * 45,
                transition: { type: 'spring', stiffness: 500, damping: 12 },
              }}
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                playSound('win');
                alert('IMPOSSIBLE! You caught the repelling button! You are a reflex deity!');
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-['Press_Start_2P',monospace] text-[10px] py-2 px-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer select-none"
            >
              MAGNETIC REPULSION
            </motion.button>
          </div>
        </div>

        {/* Module 2: 3D Perspective Tilt Card */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-950 uppercase border-b pb-1 mb-2">
              <Compass className="w-4 h-4 text-blue-600" />
              2. 3D Perspective Tilt Matrix
            </div>
            <p className="text-xs text-gray-700 mb-3">
              Move your mouse over this cursed card to experience extreme 35-degree Webflow parallax tilt physics:
            </p>
          </div>

          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 800,
            }}
            onMouseMove={handleMouseMoveTilt}
            onMouseLeave={handleMouseLeaveTilt}
            className="h-36 bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-black rounded-lg p-3 flex flex-col justify-between shadow-[4px_4px_0px_#000] cursor-pointer"
          >
            <div className="text-[10px] font-mono font-bold text-black uppercase flex justify-between">
              <span>PARALLAX TILT 3D</span>
              <span className="bg-red-600 text-white px-1">ACTIVE</span>
            </div>
            <div className="text-center font-bold text-xs text-purple-950">
              ⚡ Hover around my edges to distort space-time!
            </div>
            <div className="text-[9px] font-mono text-gray-700 text-center">
              Framer Motion `useTransform` with Euler angles
            </div>
          </motion.div>
        </div>

        {/* Module 3: Webflow Smooth Scroll Hijacker */}
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-950 uppercase border-b pb-1 mb-2">
              <Wind className="w-4 h-4 text-emerald-600" />
              3. Webflow GSAP Scroll Desync
            </div>
            <p className="text-xs text-gray-700 mb-3">
              Simulates elite agency websites with 1,200ms buttery smooth inertial lag:
            </p>
          </div>

          <div className="space-y-2">
            <div className="bg-gray-100 p-2.5 border-2 border-black font-mono text-xs flex justify-between items-center">
              <span>Virtual Scroll Inertia:</span>
              <span className="text-red-600 font-bold">1,840ms DESYNC</span>
            </div>
            <button
              onClick={toggleScrollHijack}
              className={`w-full py-2 px-3 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer ${
                scrollHijacked ? 'bg-red-500 text-white' : 'bg-emerald-400 hover:bg-emerald-500 text-black'
              }`}
            >
              {scrollHijacked ? '⚡ Scroll Inversion Engaged' : 'Invert Mouse Wheel Physics'}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Draggable Cursed Pinterest Stickers Playpen */}
      <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000]">
        <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2 mb-3">
          <div className="font-['Press_Start_2P',monospace] text-xs text-purple-900 flex items-center gap-2">
            <Move className="w-4 h-4 text-pink-600 animate-spin" />
            DRAGGABLE CURSED STICKER PLAYPEN (SPRING ELASTICITY)
          </div>
          <span className="text-xs font-mono text-gray-500">
            Drag any cursed artifact around the box!
          </span>
        </div>

        <div className="h-56 bg-gradient-to-r from-yellow-100 via-pink-100 to-cyan-100 border-2 border-black relative overflow-hidden rounded-xl p-2 select-none">
          {stickers.map((st) => (
            <motion.div
              key={st.id}
              drag
              dragConstraints={{ left: -100, right: 350, top: -20, bottom: 100 }}
              dragElastic={0.4}
              whileDrag={{ scale: 1.15, rotate: 15, zIndex: 30 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: st.x, y: st.y, rotate: st.rot }}
              className="absolute bg-white border-3 border-black rounded-xl p-1.5 shadow-[4px_4px_0px_#000] cursor-grab active:cursor-grabbing w-36"
            >
              <img
                src={st.img}
                alt={st.label}
                referrerPolicy="no-referrer"
                className="w-full h-20 object-cover rounded-lg border border-black pointer-events-none"
              />
              <div className="text-[10px] font-bold text-center text-purple-950 mt-1 font-mono">
                {st.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
