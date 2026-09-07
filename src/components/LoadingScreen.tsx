import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Skull,
  Terminal,
  FastForward,
  Cpu,
  Wifi,
  HardDrive,
  Flame,
  Volume2,
  VolumeX,
  AlertTriangle,
} from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface LoadingScreenProps {
  onComplete: () => void;
  isManualTrigger?: boolean;
}

interface BootStep {
  bn: string;
  en: string;
  detail: string;
}

const BOOT_STEPS: BootStep[] = [
  {
    bn: 'ডায়াল-আপ মডেম সংযোগ স্থাপন করা হচ্ছে (মতিঝিল BTTB V.90 56k)...',
    en: 'Establishing 56k V.90 dial-up handshake with Motijheel server...',
    detail: 'ATDT *70,18005559842 ... CONNECT 28800/ARQ',
  },
  {
    bn: 'জাভাস্ক্রিপ্ট ও ব্রাউজার লেআউট আন-অপটিমাইজেশন চালু হচ্ছে (সর্বোচ্চ ল্যাগ)...',
    en: 'De-optimizing CSS layout engine to ensure certified 4 FPS...',
    detail: 'DOM reflow cycle forced x99, layout thrashing engaged',
  },
  {
    bn: 'পদ্মা সেতু ও ঢাকাইয়া কাচ্চি বিরিয়ানির মসলা রেসিপি ক্যাশ লোড হচ্ছে...',
    en: 'Synchronizing viral Bangladeshi meme cache & mustard oil buffers...',
    detail: 'CACHE_BD_VIRAL_NEWS [OK] • Ilish spices synced',
  },
  {
    bn: 'ইয়াসির আবেদ রাব্বুর চরম বৈরী আর্কিটেকচার ম্যাট্রিক্স চালু হচ্ছে...',
    en: 'Injecting Yasir Abed Rabbu hostile UX agony architecture...',
    detail: 'RABBU_HOSTILE_CORE_v2.0 loaded into kernel memory',
  },
  {
    bn: 'পাইথন PIL ডট ম্যাট্রিক্স ও রেট্রো CRT হাফটোন শেডার কম্পাইল হচ্ছে...',
    en: 'Compiling Python PIL halftone raster engine & retro scanlines...',
    detail: 'RGB -> CMYK frequency matrix initialized (45° screen angle)',
  },
  {
    bn: 'রিয়েল-টাইম মাল্টি-ইউজার SSE প্রেসেন্স ও লাইভ কার্সর ইঞ্জিন যুক্ত হচ্ছে...',
    en: 'Connecting real-time multi-user SSE stream & cursor bus...',
    detail: 'SSE /api/presence/stream connected • 0 dummy bots allowed',
  },
  {
    bn: '১৫০০+ অবাধ্য পপ-আপ অ্যাড, কুকি গার্ড ও ক্যাপচা ট্র্যাপ সক্রিয় করা হচ্ছে...',
    en: 'Spawning 1,500 unskippable pop-up traps and Karen bot AI...',
    detail: 'SPAWN_AD_DAEMON [ONLINE] • Karen support queue loaded',
  },
  {
    bn: 'বুট সম্পন্ন! গিনেস ওয়ার্ল্ড রেকর্ডসের চরম বিরক্তি জগতে স্বাগতম!',
    en: 'Boot sequence complete! Certified Guinness UX Agony ready!',
    detail: 'ALL WRONGS RESERVED © 1996-2026 • SYSTEM READY',
  },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  isManualTrigger = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    'ROM BIOS Version 3.12 (C) 1996 Agony Micro Devices',
    'CPU: Intel 80486DX2 66MHz • 640KB Base RAM Checked [OK]',
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (soundEnabled) {
      playSound('dialup');
    }

    // Step-by-step authentic loading progression
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (soundEnabled) playSound('win');
            onComplete();
          }, 400);
          return 100;
        }

        const delta = Math.floor(Math.random() * 12) + 8;
        const next = Math.min(100, prev + delta);

        const currentStepIdx = Math.min(
          BOOT_STEPS.length - 1,
          Math.floor((next / 100) * BOOT_STEPS.length)
        );

        setStepIndex(currentStepIdx);

        // Add log line
        const step = BOOT_STEPS[currentStepIdx];
        setLogs((prevLogs) => {
          if (!prevLogs.includes(`> ${step.detail}`)) {
            return [...prevLogs, `> ${step.detail}`].slice(-8);
          }
          return prevLogs;
        });

        if (soundEnabled && Math.random() > 0.35) {
          playSound('click');
        }

        return next;
      });
    }, 280);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        if (soundEnabled) playSound('coin');
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, soundEnabled]);

  const handleSkip = () => {
    if (soundEnabled) playSound('coin');
    onComplete();
  };

  const currentStep = BOOT_STEPS[stepIndex];
  const bytesLoaded = Math.floor((progress / 100) * 4096);

  return (
    <AnimatePresence>
      <motion.div
        id="hostile-system-loading-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999999] bg-[#07010e] text-lime-400 font-mono flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-hidden"
      >
        {/* Retro Matrix / Scanline Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 255, 100, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 100, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Scanline CRT overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

        {/* Central Terminal Boot Frame */}
        <div className="relative z-10 w-full max-w-2xl bg-black/95 border-4 border-yellow-400 p-4 sm:p-6 shadow-[10px_10px_0px_#000,0_0_40px_rgba(250,204,21,0.25)] text-left space-y-4 rounded-none">
          {/* Top BIOS Header */}
          <div className="flex flex-wrap items-center justify-between border-b-2 border-dashed border-yellow-400 pb-2.5 text-xs gap-2">
            <div className="flex items-center gap-2 text-yellow-300 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>GUINNESS AGONY OS v2026.4 &bull; BOOTLOADER</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-yellow-300 px-2 py-0.5 border border-yellow-400 cursor-pointer flex items-center gap-1"
                title="Toggle audio synth"
              >
                {soundEnabled ? <Volume2 className="w-3 h-3 text-lime-400" /> : <VolumeX className="w-3 h-3 text-red-400" />}
                <span>{soundEnabled ? 'SOUND: ON' : 'MUTED'}</span>
              </button>
              <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-black">
                {isManualTrigger ? 'REBOOT' : 'HOSTILE v2.0'}
              </span>
            </div>
          </div>

          {/* Center Visuals: Animated CPU / Skull & Title */}
          <div className="flex flex-col sm:flex-row items-center gap-4 py-1 border-b border-neutral-800 pb-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-purple-950/80 border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.4)]">
                <Skull className="w-9 h-9 sm:w-11 sm:h-11 text-yellow-300 animate-pulse" />
              </div>
              <Flame className="w-5 h-5 text-red-500 absolute -top-2 -right-2 animate-bounce" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="inline-block bg-red-600/30 border border-red-500 text-red-300 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                গিনেস বুক অফ রেকর্ডস মনোনীত • GUINNESS WORLD RECORD CANDIDATE
              </div>
              <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-yellow-300 leading-tight">
                WORLD&apos;S WORST WEBSITE
              </h1>
              <p className="text-[11px] text-gray-300 font-sans">
                চিফ আর্কিটেক্ট: <strong className="text-yellow-400">ইয়াসির আবেদ রাব্বু (Yasir Abed Rabbu)</strong> | চরম বিরক্তির ল্যাবরেটরি
              </p>
            </div>
          </div>

          {/* Progress Bar & Dial-Up Metrics */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold font-mono">
              <span className="text-yellow-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>লোড হচ্ছে (LOADING PAYLOAD)...</span>
              </span>
              <span className="text-lime-400 text-sm font-black tracking-wider">
                {progress}%
              </span>
            </div>

            {/* Custom 8-bit Segmented Progress Bar */}
            <div className="w-full h-5 bg-black border-2 border-lime-400 p-0.5 flex items-center">
              <motion.div
                className="h-full bg-gradient-to-r from-lime-500 via-yellow-400 to-red-600 flex items-center justify-end px-1"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              >
                {progress > 15 && (
                  <span className="text-[9px] text-black font-black leading-none select-none">
                    {progress}%
                  </span>
                )}
              </motion.div>
            </div>

            {/* Connection Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono text-gray-400 pt-1">
              <div className="bg-neutral-900 border border-neutral-800 p-1 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span>MODEM: 28.8K</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-1 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-yellow-400" />
                <span>RAM: 640KB OK</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-1 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-lime-400" />
                <span>{bytesLoaded}/4096 KB</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-1 flex items-center gap-1 text-red-400 font-bold">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span>LAG: GUARANTEED</span>
              </div>
            </div>
          </div>

          {/* Current Step Status (Bangla & English) */}
          <div className="bg-[#12071f] border-2 border-purple-600/70 p-3 space-y-1">
            <div className="text-[10px] text-purple-300 font-bold flex items-center justify-between">
              <span>ধাপ [{stepIndex + 1}/{BOOT_STEPS.length}] CURRENT SEQUENCE:</span>
              <span className="text-yellow-400 animate-pulse">PROCESSING...</span>
            </div>
            <p className="text-xs text-yellow-300 font-sans font-bold leading-snug">
              {currentStep.bn}
            </p>
            <p className="text-[11px] text-cyan-300 font-mono">
              &gt; {currentStep.en}
            </p>
          </div>

          {/* Scrolling BIOS Terminal Logs Box */}
          <div
            ref={logContainerRef}
            className="h-20 bg-black border border-neutral-800 p-2 overflow-y-auto font-mono text-[10px] text-lime-400/90 space-y-0.5 scrollbar-thin"
          >
            {logs.map((log, idx) => (
              <div key={idx} className="leading-tight">
                {log}
              </div>
            ))}
            <div className="animate-pulse text-yellow-400">&gt; _</div>
          </div>

          {/* Action Footer: Quick Skip [ESC] */}
          <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-gray-500">
              কিবোর্ডে <kbd className="bg-neutral-800 text-yellow-300 px-1 border border-neutral-700">ESC</kbd> চাপুন সরাসরি ঢুকতে
            </span>

            <button
              id="btn-skip-loading-screen"
              type="button"
              onClick={handleSkip}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black text-xs font-black px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <FastForward className="w-4 h-4" />
              <span>সরাসরি প্রবেশ করুন / ENTER IMMEDIATELY [ESC]</span>
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <p className="relative z-10 text-[10px] text-gray-400 text-center mt-3 font-mono">
          PixiJS • Konva • Fabric • Three.js • Python Halftone • Live Multi-User SSE Engine
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
