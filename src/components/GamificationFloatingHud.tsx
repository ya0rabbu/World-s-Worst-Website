import React from 'react';
import { Trophy, Zap, Flame, ChevronUp, Sparkles } from 'lucide-react';
import { getLevelInfo } from './GamificationCenter';
import { playSound } from '../utils/audioSynth';

interface GamificationFloatingHudProps {
  xp: number;
  onOpenGamification: () => void;
  unlockedCount: number;
  totalAchievements: number;
}

export const GamificationFloatingHud: React.FC<GamificationFloatingHudProps> = ({
  xp,
  onOpenGamification,
  unlockedCount,
  totalAchievements,
}) => {
  const levelInfo = getLevelInfo(xp);
  const prevLevelXP = levelInfo.level === 1 ? 0 : [0, 0, 100, 250, 450, 700, 1000][levelInfo.level] || 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((xp - prevLevelXP) / (levelInfo.maxXP - prevLevelXP)) * 100)
  );

  return (
    <aside
      aria-label="Agony Gamification Floating HUD"
      id="gamification-floating-hud"
      onClick={() => {
        playSound('win');
        onOpenGamification();
      }}
      className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-[9980] bg-[#0c0419]/95 backdrop-blur-md border-3 border-lime-400 p-2.5 sm:p-3 shadow-[0_0_20px_rgba(0,255,100,0.4),4px_4px_0px_#000] text-gray-100 font-mono text-xs cursor-pointer hover:border-yellow-400 transition-all hover:scale-105 select-none max-w-[280px] sm:max-w-xs"
      title="Click to view full Gamification Center & Quests"
    >
      <div className="flex items-center justify-between gap-2 border-b border-lime-500/50 pb-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-lime-400 text-black font-black text-xs flex items-center justify-center border border-black shadow-[1px_1px_0px_#000]">
            L{levelInfo.level}
          </div>
          <div>
            <div className="text-[10px] text-lime-400 font-bold leading-none">
              গেম লেভেল {levelInfo.level}
            </div>
            <div className={`text-[11px] font-black leading-tight ${levelInfo.color}`}>
              {levelInfo.titleBn}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black px-2 py-0.5 border border-lime-400 text-lime-400 font-black text-xs">
          <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
          <span>{xp} XP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] text-gray-300">
          <span>লেভেল প্রগ্রেস ({Math.round(progressPercent)}%)</span>
          <span>{unlockedCount}/{totalAchievements} ট্রফি</span>
        </div>
        <div className="w-full h-2 bg-black border border-lime-500/80 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-lime-400 to-yellow-300 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-1.5 pt-1 border-t border-purple-900 flex items-center justify-between text-[9px] text-gray-400">
        <span className="flex items-center gap-1 text-yellow-300">
          <Sparkles className="w-2.5 h-2.5" />
          <span>ক্লিক করে কোয়েস্ট দেখুন</span>
        </span>
        <span className="text-lime-400 font-bold flex items-center">
          <span>বিস্তারিত</span>
          <ChevronUp className="w-3 h-3" />
        </span>
      </div>
    </aside>
  );
};
