import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType } from '../types';
import { playSound } from '../utils/audioSynth';
import {
  Home,
  Pin,
  ShoppingCart,
  Headset,
  Award,
  Zap,
  X,
  Shuffle,
  BatteryCharging,
  ShieldAlert,
  Cookie,
  PhoneCall,
  Flame,
  Radio,
  Sliders,
  AlertTriangle,
  MessageSquare,
  Trophy,
  Newspaper,
} from 'lucide-react';

interface MobileAppNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  frustrationScore: number;
  onTriggerCaptcha: () => void;
  onTriggerBattery: () => void;
  onTriggerCookies: () => void;
  onSpawnAd: () => void;
  onDialUp: () => void;
  chaosMode: boolean;
  onToggleChaosMode: () => void;
  onTriggerWarning?: () => void;
  onTriggerFeedback?: () => void;
  onTriggerGamification?: () => void;
  xp?: number;
}

export const MobileAppNav: React.FC<MobileAppNavProps> = ({
  currentPage,
  onNavigate,
  frustrationScore,
  onTriggerCaptcha,
  onTriggerBattery,
  onTriggerCookies,
  onSpawnAd,
  onDialUp,
  chaosMode,
  onToggleChaosMode,
  onTriggerWarning,
  onTriggerFeedback,
  onTriggerGamification,
  xp = 120,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabs: { id: PageType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'viral', label: 'BD Viral', icon: Newspaper },
    { id: 'pinterest', label: 'Pinterest', icon: Pin },
    { id: 'shop', label: 'Store', icon: ShoppingCart },
    { id: 'support', label: 'Support', icon: Headset },
    { id: 'records', label: 'Guinness', icon: Award },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* MODERN TOP APP BAR (MOBILE ONLY) */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-[9990] bg-neutral-950/90 backdrop-blur-md border-b border-white/10 px-3 py-2 flex items-center justify-between text-white select-none">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-yellow-400 to-red-500 flex items-center justify-center text-black font-black text-xs shadow-md">
            W
          </div>
          <div>
            <div className="text-xs font-bold font-mono text-yellow-300 leading-none">
              WORST APP v2
            </div>
            <div className="text-[9px] text-gray-400 font-mono">Mobile Edition</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onTriggerGamification && (
            <button
              onClick={() => {
                playSound('win');
                onTriggerGamification();
              }}
              className="flex items-center gap-1 bg-lime-400 text-black font-black px-2 py-0.5 rounded-full text-[10px] font-mono shadow-sm cursor-pointer active:scale-95"
            >
              <Trophy className="w-3 h-3 text-purple-950" />
              <span>{xp} XP</span>
            </button>
          )}

          {/* Live Frustration Badge Pill */}
          <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-full text-[10px] font-mono text-red-300">
            <Flame className="w-3 h-3 text-red-500 animate-pulse" />
            <span>{Math.round(frustrationScore)}% RAGE</span>
          </div>

          {/* Quick Dialup Modem trigger */}
          <button
            onClick={() => {
              playSound('dialup');
              onDialUp();
            }}
            className="p-1.5 bg-yellow-400 text-black rounded-full cursor-pointer hover:bg-yellow-300 active:scale-95"
            title="Dial-up Screech"
          >
            <PhoneCall className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MODERN FLOATING BOTTOM DOCK NAVIGATION (MOBILE ONLY) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 z-[9995] select-none">
        <div className="backdrop-blur-2xl bg-neutral-950/85 border border-white/15 rounded-2xl p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.8)] flex items-center justify-between">
          {/* Main App Navigation Tabs */}
          <div className="flex items-center justify-around flex-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentPage === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('coin');
                    onNavigate(tab.id);
                  }}
                  className="relative py-1.5 px-2.5 flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors"
                >
                  {/* Smooth Motion Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTabPill"
                      className="absolute inset-0 bg-yellow-400/20 border border-yellow-400/50 rounded-xl"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}

                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 relative z-10 ${
                      isActive ? 'text-yellow-400 scale-110' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono mt-0.5 tracking-tight relative z-10 ${
                      isActive ? 'text-yellow-300 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Chaos Trigger Button */}
          <div className="pl-1 border-l border-white/10 ml-1">
            <button
              onClick={() => {
                playSound('beep');
                setDrawerOpen(true);
              }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex flex-col items-center justify-center cursor-pointer shadow-lg shadow-pink-500/20 active:scale-95"
              title="Open Chaos Sheet"
            >
              <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="text-[8px] font-bold font-mono leading-none">TOOL</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MODERN CHAOS BOTTOM SHEET DRAWER (MOBILE ONLY) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[99990] bg-black/70 backdrop-blur-sm md:hidden"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-[99999] bg-neutral-900 border-t-2 border-yellow-400 rounded-t-3xl p-5 shadow-2xl md:hidden text-white font-mono space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Handle Bar */}
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto" />

              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-sm font-bold text-yellow-300">CHAOS DECK CONTROLS</h4>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-full bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {onTriggerWarning && (
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onTriggerWarning();
                    }}
                    className="p-3 bg-red-950/80 border-2 border-red-500 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-center active:scale-95 col-span-2 sm:col-span-1 shadow-md"
                  >
                    <AlertTriangle className="w-5 h-5 text-yellow-300 animate-bounce" />
                    <span className="font-bold text-yellow-300">⚠️ চরম সতর্কবার্তা (Warning)</span>
                    <span className="text-[9px] text-gray-300">Bangla &amp; English Worst Web Alert</span>
                  </button>
                )}

                {onTriggerFeedback && (
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onTriggerFeedback();
                    }}
                    className="p-3 bg-purple-950/80 border border-purple-400 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-center active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5 text-cyan-300" />
                    <span className="font-bold text-cyan-300">মতামত / Feedback</span>
                    <span className="text-[9px] text-gray-300">রিভিউ ও ফিচার রিকোয়েস্ট</span>
                  </button>
                )}

                {onTriggerGamification && (
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onTriggerGamification();
                    }}
                    className="p-3 bg-lime-950/80 border border-lime-400 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-center active:scale-95"
                  >
                    <Trophy className="w-5 h-5 text-lime-400" />
                    <span className="font-bold text-lime-300">গেমিফিকেশন ({xp} XP)</span>
                    <span className="text-[9px] text-gray-300">কষ্টের কোয়েস্ট ও ব্যাজ</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onTriggerCaptcha();
                  }}
                  className="p-3 bg-purple-950/80 border border-purple-500 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-center active:scale-95"
                >
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                  <span className="font-bold">Test CAPTCHA</span>
                  <span className="text-[9px] text-gray-400">Impossible puzzle</span>
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onTriggerBattery();
                  }}
                  className="p-3 bg-red-950/80 border border-red-500 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-center active:scale-95"
                >
                  <BatteryCharging className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="font-bold">1% Battery</span>
                  <span className="text-[9px] text-gray-400">Low battery panic</span>
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onTriggerCookies();
                  }}
                  className="p-3 bg-amber-950/80 border border-amber-500 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-center active:scale-95"
                >
                  <Cookie className="w-5 h-5 text-amber-400" />
                  <span className="font-bold">Cookie Policy</span>
                  <span className="text-[9px] text-gray-400">Slippery reject</span>
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onSpawnAd();
                  }}
                  className="p-3 bg-pink-950/80 border border-pink-500 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer text-center active:scale-95"
                >
                  <Flame className="w-5 h-5 text-pink-400" />
                  <span className="font-bold">Spawn Spam Ad</span>
                  <span className="text-[9px] text-gray-400">Hydra popup</span>
                </button>
              </div>

              {/* Chaos Mode Toggle */}
              <div className="p-3 bg-black/60 border border-gray-700 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                    <Shuffle className="w-4 h-4" />
                    30% CHAOS INVERSION
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Clicks have 30% chance to do opposite action
                  </div>
                </div>

                <button
                  onClick={onToggleChaosMode}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer border ${
                    chaosMode
                      ? 'bg-red-600 border-red-400 text-white animate-pulse'
                      : 'bg-gray-800 border-gray-600 text-gray-300'
                  }`}
                >
                  {chaosMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
