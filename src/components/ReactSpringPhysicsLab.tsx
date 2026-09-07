import React, { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { Activity, Sliders, RotateCcw, Zap, Sparkles, Hand } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

export const ReactSpringPhysicsLab: React.FC = () => {
  const [tension, setTension] = useState(170);
  const [friction, setFriction] = useState(12);
  const [mass, setMass] = useState(1);
  const [isBouncing, setIsBouncing] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);

  // Main spring card
  const [{ xy }, api] = useSpring(() => ({
    xy: [0, 0],
    scale: 1,
    rotateZ: 0,
    config: { mass, tension, friction },
  }));

  // Wobble / Harmonic trigger
  const triggerSpringImpulse = (impulseX = 0, impulseY = -120) => {
    playSound('beep');
    setBounceCount((c) => c + 1);
    setIsBouncing(true);

    api.start({
      to: async (next) => {
        await next({ xy: [impulseX, impulseY], scale: 1.15, rotateZ: 8 });
        await next({ xy: [0, 0], scale: 1, rotateZ: 0 });
      },
      config: { mass, tension, friction },
      onRest: () => setIsBouncing(false),
    });
  };

  // Multiple spring dots for chain simulation
  const [dotSprings, dotApi] = useSpring(() => ({
    y: 0,
    config: config.wobbly,
  }));

  const triggerChainWave = () => {
    playSound('coin');
    dotApi.start({
      to: async (next) => {
        await next({ y: -50 });
        await next({ y: 0 });
      },
    });
  };

  return (
    <div className="bg-emerald-950 border-4 border-lime-400 p-4 sm:p-6 shadow-[8px_8px_0px_#000] text-white font-['Comic_Neue',cursive]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-lime-400 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-lime-400 animate-pulse" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-lime-400">
              REACT SPRING PHYSICS SIMULATOR
            </h3>
          </div>
          <p className="text-xs text-lime-200 mt-1 font-mono">
            Eulerian spring-mass-damping integration with zero frame drop
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-lime-400 text-black px-2 py-0.5 font-black">
            IMPULSES: {bounceCount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Physics Stage */}
        <div className="lg:col-span-2 bg-black/70 border-2 border-lime-500/80 p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden rounded-sm">
          <div className="absolute top-2 left-2 text-[10px] font-mono text-lime-400 flex items-center gap-1">
            <Hand className="w-3.5 h-3.5" />
            Click or drag the spring core below to inject kinetic energy
          </div>

          <animated.div
            onClick={() => triggerSpringImpulse(Math.random() * 80 - 40, -110)}
            style={{
              transform: xy.to((x, y) => `translate3d(${x}px,${y}px,0)`),
            }}
            className="cursor-pointer select-none bg-gradient-to-tr from-lime-500 via-emerald-400 to-yellow-300 text-black p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center justify-center text-center max-w-xs hover:brightness-110 active:scale-95 transition-all"
          >
            <Zap className="w-8 h-8 text-black fill-current mb-2 animate-bounce" />
            <div className="font-black font-mono text-sm leading-tight">
              SPRING OSCILLATOR
            </div>
            <div className="text-[11px] font-mono font-bold mt-1 text-emerald-950">
              Tension: {tension} | Friction: {friction} | Mass: {mass}
            </div>
            <div className="mt-3 text-[10px] bg-black text-lime-400 px-2 py-1 font-mono rounded">
              TAP TO SMACK SPRING
            </div>
          </animated.div>

          {/* Connected Harmonic Wave Dots */}
          <div className="flex items-center gap-4 mt-8">
            {[0, 1, 2, 3, 4].map((index) => (
              <animated.div
                key={index}
                style={{
                  transform: dotSprings.y.to((y) => `translateY(${y * (1 - index * 0.15)}px)`),
                }}
                className="w-4 h-4 rounded-full bg-lime-400 border border-black shadow-[2px_2px_0px_#000]"
              />
            ))}
            <button
              onClick={triggerChainWave}
              className="ml-3 px-2 py-1 bg-lime-400 hover:bg-lime-300 text-black font-mono text-[10px] font-bold border border-black cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              TRIGGER WAVE
            </button>
          </div>
        </div>

        {/* Realtime Spring Controls & Presets */}
        <div className="bg-emerald-900/60 border border-lime-500/60 p-4 font-mono text-xs space-y-4">
          <div className="font-bold text-lime-300 text-sm flex items-center gap-2 border-b border-lime-500/40 pb-2">
            <Sliders className="w-4 h-4 text-lime-400" />
            PHYSICS PARAMETERS
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-lime-200 mb-1">
                <span>TENSION (Stiffness):</span>
                <span className="font-bold text-lime-400">{tension}</span>
              </div>
              <input
                type="range"
                min="40"
                max="500"
                value={tension}
                onChange={(e) => setTension(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-lime-200 mb-1">
                <span>FRICTION (Damping):</span>
                <span className="font-bold text-lime-400">{friction}</span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={friction}
                onChange={(e) => setFriction(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-lime-200 mb-1">
                <span>MASS (Inertia weight):</span>
                <span className="font-bold text-lime-400">{mass}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-lime-500/40 space-y-2">
            <div className="text-[11px] text-lime-300 font-bold">PHYSICS PRESETS:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setTension(120);
                  setFriction(14);
                  setMass(1);
                  triggerSpringImpulse(0, -90);
                }}
                className="px-2 py-1.5 bg-black/80 hover:bg-black text-lime-300 border border-lime-400 text-[10px] cursor-pointer"
              >
                🌊 Gentle Molasses
              </button>
              <button
                onClick={() => {
                  setTension(400);
                  setFriction(8);
                  setMass(1);
                  triggerSpringImpulse(0, -140);
                }}
                className="px-2 py-1.5 bg-black/80 hover:bg-black text-yellow-300 border border-yellow-400 text-[10px] cursor-pointer"
              >
                ⚡ Ultra Bouncy
              </button>
              <button
                onClick={() => {
                  setTension(180);
                  setFriction(30);
                  setMass(3);
                  triggerSpringImpulse(0, -60);
                }}
                className="px-2 py-1.5 bg-black/80 hover:bg-black text-cyan-300 border border-cyan-400 text-[10px] cursor-pointer"
              >
                🪨 Heavy Lead Ball
              </button>
              <button
                onClick={() => {
                  setTension(170);
                  setFriction(12);
                  setMass(1);
                  triggerSpringImpulse(0, -100);
                }}
                className="px-2 py-1.5 bg-lime-400 text-black font-bold border border-black text-[10px] cursor-pointer"
              >
                ↺ Reset Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
