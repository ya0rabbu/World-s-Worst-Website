import React from 'react';
import { Flame, Construction, Award, Skull, Sparkles, Volume2 } from 'lucide-react';
import { playSound } from '../utils/audioSynth';
import { useHeaderScramble } from '../hooks/useHeaderScramble';

interface MarqueeBannerProps {
  onHonk: () => void;
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ onHonk }) => {
  const scrambledTitle = useHeaderScramble("WORLD'S WORST WEBSITE", 1800);
  const scrambledSubtitle = useHeaderScramble("Guinness Record Edition: Where Every Click Hurts Your Soul", 2400);

  return (
    <header className="w-full bg-yellow-300 border-b-4 border-dashed border-red-600 shadow-md select-none">
      {/* Top Warning Banner */}
      <div className="bg-red-600 text-white font-mono text-xs py-1 px-2 flex items-center justify-between overflow-hidden">
        <div className="animate-pulse flex items-center gap-2 font-bold tracking-widest text-yellow-300">
          <Skull className="w-4 h-4 animate-spin text-lime-400" />
          <span>⚠️ WARNING: HIGH DENSITY OF BAD DESIGN AHEAD. PROCEED AT YOUR OWN SANITY RISK! ⚠️</span>
          <Skull className="w-4 h-4 animate-spin text-lime-400" />
        </div>
        <button
          onClick={() => {
            playSound('honk');
            onHonk();
          }}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-2 py-0.5 text-[10px] font-bold border border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
        >
          🔊 DO NOT CLICK
        </button>
      </div>

      {/* Retro Marquee 1 */}
      <div className="bg-black text-lime-400 py-1.5 overflow-hidden whitespace-nowrap border-y-2 border-yellow-400 font-['Comic_Neue',cursive] font-black text-sm tracking-wider">
        <div className="inline-block animate-[marquee_15s_linear_infinite]">
          🏆 OFFICIAL GUINNESS WORLD RECORD CONTENDER FOR &quot;THE WORLD&apos;S WORST WEBSITE&quot; (2026 EDITION) ★★★ OPTIMIZED FOR DIAL-UP 14.4K MODEMS ★★★ BEST VIEWED AT 800x600 WITH NETSCAPE 3.0 ★★★ PLEASE WAIT WHILE WE LOAD 947 UNNECESSARY SCRIPTS ★★★ 🏆
        </div>
      </div>

      {/* Main Header Row */}
      <div className="p-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-500 text-white border-b-4 border-black flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center animate-bounce shadow-[4px_4px_0px_#000]">
            <Award className="w-8 h-8 text-red-600 animate-spin" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-['Press_Start_2P',monospace] text-yellow-300 drop-shadow-[3px_3px_0px_#000] tracking-tight leading-tight">
              {scrambledTitle}
            </h1>
            <p className="text-xs font-bold text-lime-300 tracking-wide font-['Comic_Neue',cursive] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-yellow-200" />
              {scrambledSubtitle}
            </p>
          </div>
        </div>

        {/* 90s Web Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold font-mono">
          <div className="bg-blue-600 text-white px-2 py-1 border-2 border-white shadow-[2px_2px_0px_#000] flex items-center gap-1 animate-pulse">
            <Construction className="w-3.5 h-3.5 text-yellow-300" />
            UNDER CONSTRUCTION 1999
          </div>
          <div className="bg-green-700 text-yellow-300 px-2 py-1 border-2 border-yellow-300 shadow-[2px_2px_0px_#000]">
            ★ BEST ON THE WEB ★
          </div>
          <div className="bg-red-800 text-white px-2 py-1 border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            HOT! 100% PURE HTML
          </div>
        </div>
      </div>
    </header>
  );
};
