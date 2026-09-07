import React, { useState } from 'react';
import { PageType } from '../types';
import { playSound } from '../utils/audioSynth';
import { Flame, ShoppingCart, Headset, UserX, Award, Home, Wifi, PhoneCall, Pin, AlertTriangle, MessageSquare, Trophy, Newspaper, Camera, RotateCcw } from 'lucide-react';

interface WorstNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onDialUp: () => void;
  onOpenWarning?: () => void;
  onOpenFeedback?: () => void;
  onOpenGamification?: () => void;
  onTriggerLoading?: () => void;
  xp?: number;
}

export const WorstNav: React.FC<WorstNavProps> = ({
  currentPage,
  onNavigate,
  onDialUp,
  onOpenWarning,
  onOpenFeedback,
  onOpenGamification,
  xp = 120,
}) => {
  // Navigation jitter state: whenever mouse enters a link, it might randomly swap or shift
  const [hoverJitter, setHoverJitter] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [fakePing, setFakePing] = useState(9421);

  const handleLinkHover = (id: string) => {
    // 35% chance to dodge slightly
    if (Math.random() > 0.65) {
      playSound('beep');
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 15;
      setHoverJitter((prev) => ({ ...prev, [id]: { x, y } }));
    }
  };

  const navItems: { id: PageType; label: string; icon: React.ReactNode; badSub: string }[] = [
    { id: 'home', label: '🏠 HOME (PAIN HUB)', icon: <Home className="w-3.5 h-3.5" />, badSub: 'Main Disasters' },
    { id: 'halftone', label: '🎨 HALFTONE STUDIO', icon: <Camera className="w-3.5 h-3.5" />, badSub: 'Python & Dotted Art' },
    { id: 'viral', label: '🇧🇩 VIRAL NEWS BD', icon: <Newspaper className="w-3.5 h-3.5" />, badSub: 'Padma & Biryani' },
    { id: 'pinterest', label: '📌 CURSED PINTEREST', icon: <Pin className="w-3.5 h-3.5" />, badSub: 'Worst DIY & Food' },
    { id: 'shop', label: '🛒 SCAM STORE', icon: <ShoppingCart className="w-3.5 h-3.5" />, badSub: '150% Tip Required' },
    { id: 'support', label: '🎧 KAREN BOT SUPPORT', icon: <Headset className="w-3.5 h-3.5" />, badSub: 'Queue: #9,842' },
    { id: 'unsubscribe', label: '🛑 UNSUBSCRIBE MAZE', icon: <UserX className="w-3.5 h-3.5" />, badSub: 'You Cannot Leave' },
    { id: 'records', label: '🏆 GUINNESS HALL', icon: <Award className="w-3.5 h-3.5" />, badSub: 'All 10 Atrocities' },
  ];

  function onTriggerLoading() {
    onTriggerLoading?.();
  }

  return (
    <nav className="bg-purple-950 border-b-4 border-black p-2 font-mono text-xs shadow-[4px_4px_0px_#000] select-none">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {navItems.map((item) => {
            const jitter = hoverJitter[item.id] || { x: 0, y: 0 };
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onMouseEnter={() => handleLinkHover(item.id)}
                onClick={() => {
                  playSound('coin');
                  onNavigate(item.id);
                }}
                style={{
                  transform: `translate(${jitter.x}px, ${jitter.y}px)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className={`px-2.5 py-1.5 border-2 border-black font-bold flex flex-col items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  isActive
                    ? 'bg-yellow-400 text-black ring-2 ring-red-500'
                    : 'bg-yellow-100 hover:bg-yellow-300 text-purple-950'
                }`}
              >
                <span className="flex items-center gap-1 leading-none text-[11px]">
                  {item.icon}
                  {item.label}
                </span>
                <span className="text-[8px] text-red-700 font-mono tracking-tighter">
                  {item.badSub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Community & Warning & Gamification Triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenWarning && (
            <button
              onClick={() => {
                playSound('beep');
                onOpenWarning();
              }}
              className="bg-red-600 hover:bg-red-500 text-yellow-300 font-bold px-2 py-1 border border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1 text-[10px]"
              title="View Bilingual Warning Modal"
            >
              <AlertTriangle className="w-3 h-3 text-yellow-300 animate-bounce" />
              <span>সতর্কবার্তা</span>
            </button>
          )}

          {onOpenFeedback && (
            <button
              onClick={() => {
                playSound('coin');
                onOpenFeedback();
              }}
              className="bg-purple-800 hover:bg-purple-700 text-cyan-300 font-bold px-2 py-1 border border-purple-400 shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1 text-[10px]"
              title="Submit Feedback & Feature Requests"
            >
              <MessageSquare className="w-3 h-3 text-cyan-300" />
              <span>মতামত দিন</span>
            </button>
          )}

          {onOpenGamification && (
            <button
              onClick={() => {
                playSound('win');
                onOpenGamification();
              }}
              className="bg-lime-400 hover:bg-lime-300 text-black font-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1 text-[10px]"
              title="Agony Gamification & Quests"
            >
              <Trophy className="w-3 h-3 text-purple-950" />
              <span>{xp} XP</span>
            </button>
          )}

          {onTriggerLoading && (

            <button
              onClick={() => {
                playSound('beep');
                onTriggerLoading();
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-2 py-1 border border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1 text-[10px]"
              title="Re-run Guinness Hostile Boot Loading Screen"
            >
              <RotateCcw className="w-3 h-3 text-black" />
              <span>লোডিং স্ক্রিন</span>
            </button>
          )}

          <button
            onClick={() => {
              playSound('dialup');
              onDialUp();
              setFakePing((p) => p + Math.floor(Math.random() * 2000));
            }}
            className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 border border-black shadow-[2px_2px_0px_#fff] cursor-pointer flex items-center gap-1 font-bold text-[10px] animate-pulse"
            title="Hear authentic 56k dialup screech"
          >
            <PhoneCall className="w-3 h-3 text-yellow-300" />
            56k MODEM
          </button>

          <div className="bg-black text-lime-400 px-2 py-1 border border-lime-400 text-[10px] font-mono flex items-center gap-1">
            <Wifi className="w-3 h-3 text-red-500 animate-ping" />
            <span>PING: {fakePing}ms</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
