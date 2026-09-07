import React, { useState } from 'react';
import { Trophy, Award, Zap, Star, ShieldCheck, Flame, Skull, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

export interface Achievement {
  id: string;
  title: string;
  titleBn: string;
  desc: string;
  descBn: string;
  icon: string;
  xpReward: number;
  isUnlocked: boolean;
}

export interface Quest {
  id: string;
  title: string;
  titleBn: string;
  xp: number;
  completed: boolean;
}

interface GamificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
  achievements: Achievement[];
  onClaimQuest?: (questId: string, xp: number) => void;
}

export function getLevelInfo(xp: number) {
  if (xp < 100) return { level: 1, title: 'Innocent Surfer', titleBn: 'নিষ্পাপ আগন্তুক', maxXP: 100, color: 'text-gray-300' };
  if (xp < 250) return { level: 2, title: 'Frustrated Novice', titleBn: 'হতাশ শিক্ষানবিস', maxXP: 250, color: 'text-yellow-400' };
  if (xp < 450) return { level: 3, title: 'Popup Hydra Hunter', titleBn: 'পপ-আপ শিকারী', maxXP: 450, color: 'text-orange-400' };
  if (xp < 700) return { level: 4, title: 'Terminal Hacker', titleBn: 'টার্মিনাল সাইবার জাদুকর', maxXP: 700, color: 'text-cyan-400' };
  if (xp < 1000) return { level: 5, title: '24-Bit Horror Survivor', titleBn: 'হরর সাউন্ড সারভাইভার', maxXP: 1000, color: 'text-pink-400' };
  return { level: 6, title: 'Ultimate UX Masochist', titleBn: 'মহামানব কষ্টের রাজা', maxXP: 2000, color: 'text-red-500' };
}

export const GamificationCenter: React.FC<GamificationCenterProps> = ({
  isOpen,
  onClose,
  xp,
  achievements,
  onClaimQuest,
}) => {
  const levelInfo = getLevelInfo(xp);
  const prevLevelXP = levelInfo.level === 1 ? 0 : [0, 0, 100, 250, 450, 700, 1000][levelInfo.level] || 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((xp - prevLevelXP) / (levelInfo.maxXP - prevLevelXP)) * 100)
  );

  const [quests, setQuests] = useState<Quest[]>([
    { id: 'q1', title: 'Test 24-bit horror sound in soundpad', titleBn: '২৪-বিট হরর সাউন্ড ট্রাই করুন', xp: 30, completed: false },
    { id: 'q2', title: 'Execute "neofetch" or "help" in Terminal', titleBn: 'টার্মিনালে neofetch বা help চালান', xp: 25, completed: false },
    { id: 'q3', title: 'Submit a feedback or feature request', titleBn: 'মতামত বা ফিচার রিকোয়েস্ট দিন', xp: 50, completed: false },
    { id: 'q4', title: 'Survive 60 seconds of worst UI agony', titleBn: '৬০ সেকেন্ড সাইটে টিকে থাকুন', xp: 40, completed: false },
  ]);

  if (!isOpen) return null;

  return (
    <div
      id="gamification-modal-overlay"
      className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        id="gamification-modal-card"
        className="relative w-full max-w-2xl bg-[#090414] border-4 border-lime-400 shadow-[0_0_40px_rgba(0,255,100,0.6),10px_10px_0px_#000] text-gray-100 font-sans p-4 sm:p-6 space-y-5 rounded-none max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-lime-400 text-black px-3 py-2 border-2 border-black font-mono font-black text-sm uppercase select-none">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-950" />
            <span>AGONY GAMIFICATION &bull; কষ্টের গেমিফিকেশন হাব</span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-1 hover:bg-black hover:text-lime-400 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Level & XP HUD */}
        <div className="bg-gradient-to-r from-purple-950 via-[#1a0733] to-black border-2 border-purple-500 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-none bg-lime-400 text-black border-2 border-black font-black font-mono text-xl flex items-center justify-center shadow-[3px_3px_0px_#000]">
                L{levelInfo.level}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-lime-400 font-bold">CURRENT RANK:</span>
                  <span className={`font-mono text-sm font-black ${levelInfo.color}`}>
                    {levelInfo.title}
                  </span>
                </div>
                <span className="text-xs text-yellow-200 font-medium">
                  {levelInfo.titleBn}
                </span>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs text-gray-400">TOTAL AGONY XP:</div>
              <div className="text-xl font-black text-lime-400 flex items-center gap-1 justify-end">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span>{xp} XP</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-gray-300">
              <span>Progress to Level {levelInfo.level + 1}</span>
              <span>{Math.round(progressPercent)}% ({xp} / {levelInfo.maxXP} XP)</span>
            </div>
            <div className="w-full h-3.5 bg-black border border-lime-400 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-lime-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quests Section */}
        <div className="space-y-2.5 font-mono">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1">
            <h3 className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>ACTIVE SURVIVAL QUESTS (মিশনসমূহ):</span>
            </h3>
            <span className="text-[10px] text-gray-400">Complete actions to earn XP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {quests.map((q) => (
              <div
                key={q.id}
                className="bg-black/70 border border-purple-800/80 p-2.5 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-gray-200">{q.titleBn}</div>
                  <div className="text-[10px] text-gray-400">{q.title}</div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 bg-lime-950/80 border border-lime-500 px-2 py-1 text-lime-400 font-bold text-[11px]">
                  <span>+{q.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Badges Grid */}
        <div className="space-y-2.5 font-mono">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1">
            <h3 className="text-xs font-bold text-lime-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>ACHIEVEMENT TROPHIES (অর্জিত ব্যাজ):</span>
            </h3>
            <span className="text-[10px] text-gray-400">
              {achievements.filter((a) => a.isUnlocked).length} / {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-2.5 border transition-all flex items-start gap-2.5 ${
                  ach.isUnlocked
                    ? 'bg-[#180a2b] border-lime-400 text-gray-100 shadow-[2px_2px_0px_#00ff66]'
                    : 'bg-black/50 border-gray-800 text-gray-500 opacity-60'
                }`}
              >
                <div className="text-2xl select-none flex-shrink-0">{ach.icon}</div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={ach.isUnlocked ? 'text-yellow-300' : 'text-gray-500'}>
                      {ach.titleBn}
                    </span>
                    {ach.isUnlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-gray-300">{ach.descBn}</div>
                  <div className="text-[10px] text-yellow-400 font-bold pt-0.5">
                    +{ach.xpReward} XP REWARD
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
