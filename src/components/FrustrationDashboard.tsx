import React from 'react';
import { Flame, Clock, MousePointerClick, Zap, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface FrustrationDashboardProps {
  stats: {
    clicks: number;
    rageClicks: number;
    timeSpentSeconds: number;
    frustrationScore: number;
  };
  onAddRage: () => void;
  onSpawnPopup: () => void;
}

export const FrustrationDashboard: React.FC<FrustrationDashboardProps> = ({
  stats,
  onAddRage,
  onSpawnPopup,
}) => {
  const visitorCount = 4289 + stats.clicks * 3;
  const formattedTime = `${Math.floor(stats.timeSpentSeconds / 60)}m ${stats.timeSpentSeconds % 60}s`;

  return (
    <section className="bg-lime-300 border-4 border-black p-4 shadow-[6px_6px_0px_#000] my-4">
      <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2 mb-3">
        <h2 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-purple-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-600 animate-bounce" />
          RAGE-O-METER & STATS
        </h2>
        <span className="bg-red-600 text-white font-mono text-[10px] px-2 py-0.5 font-bold uppercase animate-pulse">
          LIVE TELEMETRY OF AGONY
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
        {/* Visitor Counter */}
        <div className="bg-black p-2 border-2 border-yellow-400 text-yellow-400 shadow-[3px_3px_0px_#222]">
          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">VISITOR #</div>
          <div className="text-lg md:text-xl font-black tracking-widest font-mono text-green-400">
            {visitorCount.toString().padStart(8, '0')}
          </div>
        </div>

        {/* Clicks */}
        <div className="bg-white p-2 border-2 border-black text-black shadow-[3px_3px_0px_#000]">
          <div className="text-[10px] font-bold text-gray-600 flex items-center justify-center gap-1">
            <MousePointerClick className="w-3 h-3 text-blue-600" /> CLICKS
          </div>
          <div className="text-lg md:text-xl font-black text-blue-700">
            {stats.clicks}
          </div>
        </div>

        {/* Time Wasted */}
        <div className="bg-pink-100 p-2 border-2 border-black text-black shadow-[3px_3px_0px_#000]">
          <div className="text-[10px] font-bold text-pink-700 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-pink-600" /> WASTED TIME
          </div>
          <div className="text-base md:text-lg font-black text-red-600">
            {formattedTime}
          </div>
        </div>

        {/* Rage Score */}
        <div className="bg-yellow-200 p-2 border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="text-[10px] font-bold text-red-700 flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-orange-600" /> ANGER LEVEL
          </div>
          <div className="text-lg md:text-xl font-black text-red-600 animate-pulse">
            {Math.min(100, Math.floor(stats.frustrationScore))}%
          </div>
        </div>
      </div>

      {/* Progress Bar of Doom */}
      <div className="mt-3">
        <div className="flex justify-between text-[11px] font-bold font-mono mb-1">
          <span className="text-red-900">Frustration Index:</span>
          <span className="text-purple-900">
            {stats.frustrationScore < 30
              ? 'Mildly Irritated'
              : stats.frustrationScore < 70
              ? 'Teeth Grinding'
              : 'Imminent Monitor Destruction'}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-5 border-2 border-black p-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all duration-300 flex items-center justify-end pr-1 text-[9px] font-mono font-black text-white"
            style={{ width: `${Math.min(100, stats.frustrationScore)}%` }}
          >
            {Math.floor(stats.frustrationScore)}%
          </div>
        </div>
      </div>

      {/* Funny Action Buttons */}
      <div className="mt-3 pt-2 border-t-2 border-black flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => {
            playSound('error');
            onAddRage();
          }}
          className="bg-red-500 hover:bg-red-600 text-yellow-100 font-['Comic_Neue',cursive] font-bold px-3 py-1 text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-300" />
          Click to Calm Down (Adds +15 Anger)
        </button>

        <button
          onClick={() => {
            playSound('coin');
            onSpawnPopup();
          }}
          className="bg-cyan-400 hover:bg-cyan-300 text-black font-['Comic_Neue',cursive] font-bold px-3 py-1 text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          🎁 Claim Free Mystery Virus
        </button>
      </div>
    </section>
  );
};
