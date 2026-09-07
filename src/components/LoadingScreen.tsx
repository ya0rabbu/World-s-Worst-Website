import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, Zap, Sparkles, Terminal, FastForward } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  'Initializing Guinness World Record UX Atrocity...',
  'Warming up PixiJS WebGL GPU shader pipelines...',
  'Seeding 3,000 swarming cognitive thoughts...',
  'Mounting Konva.js scene graph & Fabric.js vectors...',
  'De-optimizing CSS layout algorithms for maximum lag...',
  'Synchronizing hostile Unix hybrid shell terminal...',
  'Ready to inflict certified interactive agony!',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Fast, lightweight simulated boot sequence (~1.2 seconds total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            playSound('win');
            onComplete();
          }, 350);
          return 100;
        }
        const jump = Math.floor(Math.random() * 18) + 12;
        const next = Math.min(100, prev + jump);
        const msgIdx = Math.min(
          LOADING_MESSAGES.length - 1,
          Math.floor((next / 100) * LOADING_MESSAGES.length)
        );
        setMessageIndex(msgIdx);
        if (Math.random() > 0.4) {
          playSound('click');
        }
        return next;
      });
    }, 140);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    playSound('coin');
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="fixed inset-0 z-[999999] bg-[#0d0714] text-lime-400 font-mono flex flex-col items-center justify-center p-4 select-none"
      >
        {/* Retro Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 255, 128, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 128, 0.2) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Central Terminal Boot Card */}
        <div className="relative z-10 w-full max-w-lg bg-black/90 border-4 border-yellow-400 p-5 sm:p-7 shadow-[10px_10px_0px_#000] text-center space-y-4">
          {/* Header Badge */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-yellow-400 pb-2 text-xs">
            <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              SYSTEM BOOT: GUINNESS UX KERNEL
            </span>
            <span className="bg-red-600 text-white px-1.5 py-0.5 text-[10px] font-bold">
              HOSTILE v2.0
            </span>
          </div>

          {/* Central Animated Icon */}
          <div className="flex justify-center py-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-purple-950/80 border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,0,0.3)]">
                <Skull className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              <Sparkles className="w-5 h-5 text-cyan-400 absolute -top-1 -right-1 animate-spin" />
            </div>
          </div>

          {/* System Title */}
          <div>
            <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-yellow-300 leading-snug">
              WORLD&apos;S WORST WEBSITE
            </h1>
            <p className="text-[11px] text-gray-400 mt-1">
              Guinness Certified High-Performance Agony Laboratory
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between text-xs text-yellow-300 font-bold">
              <span>LOADING PAYLOAD</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-4 bg-gray-900 border-2 border-lime-400 p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-lime-400 via-yellow-400 to-red-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Dynamic Status Text */}
          <div className="min-h-[38px] flex items-center justify-center">
            <p className="text-[11px] text-cyan-300 animate-pulse leading-tight">
              &gt; {LOADING_MESSAGES[messageIndex]}
            </p>
          </div>

          {/* Skip Button */}
          <div className="pt-2 border-t border-gray-800 flex justify-center">
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-4 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <FastForward className="w-3.5 h-3.5" />
              ENTER IMMEDIATELY [ESC]
            </button>
          </div>
        </div>

        {/* Footer Subtext */}
        <p className="relative z-10 text-[10px] text-gray-500 mt-4">
          PixiJS • Konva.js • Fabric.js • Three.js • GSAP • Framer Motion • Shell
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
