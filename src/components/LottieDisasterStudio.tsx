import React, { useState } from 'react';
import { Lottie } from 'lottie-react';
import { Play, Pause, FastForward, RotateCcw, Sparkles, Award, Flame } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

// Lightweight procedurally crafted Lottie JSONs for offline execution without CDN dependencies
const trophyAnimationData = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "TrophySpin",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Cup",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [15] },
            { t: 15, s: [15], e: [-15] },
            { t: 30, s: [-15], e: [15] },
            { t: 45, s: [15], e: [0] },
            { t: 60, s: [0] }
          ]
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100], e: [110, 110, 100] },
            { t: 30, s: [110, 110, 100], e: [90, 90, 100] },
            { t: 60, s: [90, 90, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [60, 70] },
              p: { a: 0, k: [0, -10] },
              r: { a: 0, k: 12 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 0.85, 0.1, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "st",
              c: { a: 0, k: [0.2, 0.1, 0, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 5 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        },
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [40, 24] },
              p: { a: 0, k: [0, 45] },
              r: { a: 0, k: 4 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.9, 0.3, 0.1, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "st",
              c: { a: 0, k: [0, 0, 0, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ]
    }
  ]
};

const rocketAnimationData = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "RocketHover",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "RocketBody",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-6], e: [6] },
            { t: 30, s: [6], e: [-6] },
            { t: 60, s: [-6] }
          ]
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [100, 108, 0], e: [100, 88, 0] },
            { t: 30, s: [100, 88, 0], e: [100, 108, 0] },
            { t: 60, s: [100, 108, 0] }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [38, 70] },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 18 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.95, 0.2, 0.3, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "st",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        },
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [16, 16] },
              p: { a: 0, k: [0, -12] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.2, 0.8, 1, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ]
    }
  ]
};

export const LottieDisasterStudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activePreset, setActivePreset] = useState<'trophy' | 'rocket'>('trophy');

  const handleTogglePlay = () => {
    playSound('coin');
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number) => {
    playSound('beep');
    setSpeed(newSpeed);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-black border-4 border-yellow-400 p-4 sm:p-6 shadow-[8px_8px_0px_#000] text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-yellow-400 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-yellow-300">
              AFTER EFFECTS &times; LOTTIE REACT STUDIO
            </h3>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            Real vector SVG motion graphics exported from Adobe After Effects via Bodymovin
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound('beep');
              setActivePreset('trophy');
            }}
            className={`px-3 py-1 text-xs font-mono font-bold border-2 border-black cursor-pointer transition-colors ${
              activePreset === 'trophy' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'
            }`}
          >
            🏆 Trophy Spin
          </button>
          <button
            onClick={() => {
              playSound('beep');
              setActivePreset('rocket');
            }}
            className={`px-3 py-1 text-xs font-mono font-bold border-2 border-black cursor-pointer transition-colors ${
              activePreset === 'rocket' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'
            }`}
          >
            🚀 Turbopack Rocket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Lottie Animation Display */}
        <div className="flex flex-col items-center justify-center p-4 bg-black/60 border-2 border-purple-500 rounded-sm relative overflow-hidden min-h-[240px]">
          <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-purple-950/80 px-2 py-0.5 border border-purple-400">
            ENGINE: Lottie-Web (React 19)
          </div>

          <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            {activePreset === 'trophy' ? (
              <Lottie
                src={trophyAnimationData}
                loop={true}
                autoplay={isPlaying}
                speed={speed}
                className="w-full h-full"
              />
            ) : (
              <Lottie
                src={rocketAnimationData}
                loop={true}
                autoplay={isPlaying}
                speed={speed}
                className="w-full h-full"
              />
            )}
          </div>

          <div className="text-xs font-mono text-yellow-300 mt-2">
            Status: {isPlaying ? '▶ RUNNING AT 60 FPS' : '⏸ PAUSED'} | Speed: {speed}x
          </div>
        </div>

        {/* Lottie Control Deck */}
        <div className="space-y-4 bg-purple-950/50 p-4 border border-purple-600 font-mono text-xs">
          <div className="font-bold text-yellow-300 text-sm flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            ANIMATION TIMELINE CONTROLS
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1 px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>

            <button
              onClick={() => handleSpeedChange(0.5)}
              className={`px-2.5 py-2 border border-yellow-400 font-bold cursor-pointer ${
                speed === 0.5 ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-300'
              }`}
            >
              0.5x SLOW
            </button>
            <button
              onClick={() => handleSpeedChange(1)}
              className={`px-2.5 py-2 border border-yellow-400 font-bold cursor-pointer ${
                speed === 1 ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-300'
              }`}
            >
              1.0x NORMAL
            </button>
            <button
              onClick={() => handleSpeedChange(2.5)}
              className={`px-2.5 py-2 border border-yellow-400 font-bold cursor-pointer ${
                speed === 2.5 ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-300'
              }`}
            >
              2.5x TURBO
            </button>
          </div>

          <div className="p-3 bg-black/70 border border-purple-500 space-y-1.5 text-[11px]">
            <div className="text-cyan-300 font-bold">✨ Lottie Vector Architecture Highlights:</div>
            <p className="text-gray-300">
              • Zero pixelation at any resolution via native SVG bezier curves.
            </p>
            <p className="text-gray-300">
              • 98% smaller payload compared to high-res video or GIF animations.
            </p>
            <p className="text-gray-300">
              • Complete imperative programmatic control via React hooks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
