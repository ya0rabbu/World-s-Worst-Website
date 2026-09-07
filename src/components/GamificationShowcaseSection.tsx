import React, { useState } from 'react';
import { Trophy, Zap, Flame, Award, Star, CheckCircle2, ShieldAlert, Sparkles, ChevronRight, MessageSquare, Mail } from 'lucide-react';
import { Achievement, getLevelInfo } from './GamificationCenter';
import { playSound } from '../utils/audioSynth';
import { TARGET_GMAIL } from './FeedbackReviewModal';

interface GamificationShowcaseSectionProps {
  xp: number;
  achievements: Achievement[];
  onOpenGamificationModal: () => void;
  onOpenFeedbackModal: () => void;
  onGainXp: (amount: number) => void;
}

export const GamificationShowcaseSection: React.FC<GamificationShowcaseSectionProps> = ({
  xp,
  achievements,
  onOpenGamificationModal,
  onOpenFeedbackModal,
  onGainXp,
}) => {
  const levelInfo = getLevelInfo(xp);
  const prevLevelXP = levelInfo.level === 1 ? 0 : [0, 0, 100, 250, 450, 700, 1000][levelInfo.level] || 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((xp - prevLevelXP) / (levelInfo.maxXP - prevLevelXP)) * 100)
  );

  const [claimedQuests, setClaimedQuests] = useState<{ [key: string]: boolean }>({
    q_visit: true,
  });

  const [questClaimToast, setQuestClaimToast] = useState<string | null>(null);

  const interactiveQuests = [
    {
      id: 'q_visit',
      titleBn: 'সাইটে প্রবেশ করার দুঃসাহস দেখানো',
      titleEn: 'Enter World\'s Worst Website',
      xp: 20,
      rewardText: '+20 XP',
    },
    {
      id: 'q_viral_read',
      titleBn: 'বাংলাদেশ ভাইরাল নিউজ সেকশন ভিজিট করা',
      titleEn: 'Explore Bangladesh Viral News & Reactions',
      xp: 35,
      rewardText: '+35 XP',
    },
    {
      id: 'q_fake_news',
      titleBn: 'ফেক নিউজ জেনারেটর দিয়ে অদ্ভুত শিরোনাম বানানো',
      titleEn: 'Generate Absurd Satirical News Headline',
      xp: 25,
      rewardText: '+25 XP',
    },
    {
      id: 'q_rabbu_email',
      titleBn: 'রাব্বুর অফিসিয়াল ইনবক্সে মতামত পাঠানো',
      titleEn: 'Submit Review directly to Creator Inbox',
      xp: 50,
      rewardText: '+50 XP',
    },
    {
      id: 'q_horror_sound',
      titleBn: '২৪-বিট সাইকোঅ্যাকোস্টিক হরর সাউন্ড টেস্ট করা',
      titleEn: 'Survive 24-Bit Acoustic Horror Soundpad',
      xp: 30,
      rewardText: '+30 XP',
    },
  ];

  const handleClaim = (questId: string, questXp: number, questName: string) => {
    if (claimedQuests[questId]) return;
    playSound('win');
    onGainXp(questXp);
    setClaimedQuests((prev) => ({ ...prev, [questId]: true }));
    setQuestClaimToast(`মিশন সম্পন্ন: ${questName} (+${questXp} XP অর্জিত!)`);
    setTimeout(() => setQuestClaimToast(null), 3000);
  };

  const leaderboard = [
    { rank: 1, name: '👑 Yasir Abed Rabbu', role: 'সাইটের স্থপতি ও ওনার (The Architect)', xp: 9999, badge: 'UNTOUCHABLE' },
    { rank: 2, name: '🥈 রাহুল আহমেদ (Victim #1042)', role: 'স্লাইডার দিয়ে ফোন নম্বর পূরণকারী', xp: 5420, badge: 'LEGEND' },
    { rank: 3, name: '🥉 Tanjim Frontend Dev', role: '১০/১০ ইউআই কষ্টের শিকার', xp: 3980, badge: 'SURVIVOR' },
    { rank: 4, name: '🎖️ সাদিয়া তাসনিম', role: 'হরর সাউন্ডে কেঁপে ওঠা ভুক্তভোগী', xp: 3150, badge: 'VETERAN' },
    { rank: 5, name: '⭐ আপনি (Current Player)', role: `${levelInfo.titleBn}`, xp: xp, badge: 'ACTIVE HERO' },
  ];

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <section
      id="gamification-showcase-section"
      className="bg-[#0b0317] border-4 border-lime-400 p-4 sm:p-6 shadow-[10px_10px_0px_#000] text-gray-100 font-sans space-y-6 select-none my-8 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-lime-400 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-lime-400 text-black font-mono font-black text-xs px-2.5 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
              🎮 সাইকো-গেমিফিকেশন ইঞ্জিন
            </span>
            <span className="bg-purple-900 text-yellow-300 font-mono font-bold text-xs px-2 py-0.5 border border-purple-500">
              AGONY LEVEL SYSTEM
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-lime-400 font-mono tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-300 animate-bounce" />
            <span>কষ্টের গেমিফিকেশন হাব &bull; AGONY GAMIFICATION</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-mono">
            ফালতু সাইটের প্রতিটি অপমানের সাথে আপনার অভিজ্ঞতা (XP) বাড়ে! মিশন পূরণ করে আনলক করুন ট্রফি এবং লিডারবোর্ডে নাম তুলুন।
          </p>
        </div>

        <button
          onClick={() => {
            playSound('win');
            onOpenGamificationModal();
          }}
          className="bg-lime-400 hover:bg-lime-300 text-black border-2 border-black px-4 py-2 font-mono font-black text-xs uppercase flex items-center gap-1.5 shadow-[3px_3px_0px_#000] cursor-pointer active:scale-95 transition-all"
        >
          <Trophy className="w-4 h-4 text-purple-950" />
          <span>সম্পূর্ণ গেমিফিকেশন সেন্টার খুলুন</span>
        </button>
      </div>

      {/* Main Status & Level HUD Card */}
      <div className="bg-gradient-to-r from-purple-950 via-[#18082e] to-black border-2 border-lime-400 p-4 space-y-4 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Level Circle Badge */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-lime-400 text-black border-3 border-black font-black font-mono text-2xl flex items-center justify-center shadow-[4px_4px_0px_#000] shrink-0">
              L{levelInfo.level}
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-lime-400 font-bold">
                <span>বর্তমান র‍্যাংক (CURRENT RANK):</span>
              </div>
              <div className={`text-base sm:text-lg font-black font-mono leading-tight ${levelInfo.color}`}>
                {levelInfo.titleBn}
              </div>
              <div className="text-xs text-gray-400 font-mono italic">
                {levelInfo.title}
              </div>
            </div>
          </div>

          {/* XP Total */}
          <div className="bg-black/90 border-2 border-yellow-400 px-4 py-2 text-right font-mono shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-gray-400">TOTAL AGONY XP:</div>
            <div className="text-xl sm:text-2xl font-black text-lime-400 flex items-center gap-1.5 justify-end">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar to next level */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-gray-300">
            <span>পরবর্তী লেভেল {levelInfo.level + 1}-এ যাওয়ার প্রগ্রেস</span>
            <span className="text-lime-300 font-bold">
              {Math.round(progressPercent)}% ({xp} / {levelInfo.maxXP} XP)
            </span>
          </div>
          <div className="w-full h-4 bg-black border-2 border-lime-400 p-0.5 shadow-[inset_0_0_8px_#000]">
            <div
              className="h-full bg-gradient-to-r from-lime-500 via-yellow-400 to-red-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Daily Quests & Hall of Agony Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Interactive Daily Quests */}
        <div className="bg-[#120722] border-2 border-purple-600 p-4 space-y-3 font-mono shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between border-b border-purple-800 pb-2">
            <h3 className="text-xs sm:text-sm font-black text-yellow-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>দৈনিক সার্ভাইভাল মিশনসমূহ (Daily Agony Quests)</span>
            </h3>
            <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.5 border border-red-800 font-bold">
              LIVE QUESTS
            </span>
          </div>

          <div className="space-y-2.5">
            {interactiveQuests.map((q) => {
              const isClaimed = !!claimedQuests[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-3 border flex items-center justify-between gap-3 transition-all ${
                    isClaimed
                      ? 'bg-lime-950/40 border-lime-500/60 text-gray-200'
                      : 'bg-black/70 border-purple-800 hover:border-yellow-400 text-gray-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-yellow-200 leading-snug">
                      {q.titleBn}
                    </div>
                    <div className="text-[10px] text-gray-400 italic">
                      {q.titleEn}
                    </div>
                    <div className="text-[10px] text-lime-400 font-black">
                      পুরস্কার: {q.rewardText}
                    </div>
                  </div>

                  {isClaimed ? (
                    <div className="flex items-center gap-1 text-lime-400 font-black text-xs bg-black px-2.5 py-1 border border-lime-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সম্পন্ন ✅</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (q.id === 'q_rabbu_email') {
                          onOpenFeedbackModal();
                        }
                        handleClaim(q.id, q.xp, q.titleBn);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 cursor-pointer active:scale-95 transition-transform"
                    >
                      ক্লেম করুন
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Achievements Showcase */}
        <div className="bg-[#120722] border-2 border-purple-600 p-4 space-y-3 font-mono shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between border-b border-purple-800 pb-2">
            <h3 className="text-xs sm:text-sm font-black text-yellow-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-400" />
              <span>কষ্টের ট্রফি গ্যালারি ({unlockedCount}/{achievements.length} আনলকড)</span>
            </h3>
            <button
              onClick={onOpenGamificationModal}
              className="text-[10px] text-lime-400 hover:underline cursor-pointer"
            >
              সব দেখুন &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-2.5 border text-center space-y-1.5 transition-all ${
                  ach.isUnlocked
                    ? 'bg-purple-950/60 border-lime-400 text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-black/50 border-gray-800 text-gray-500 opacity-60'
                }`}
              >
                <div className="text-2xl">{ach.icon}</div>
                <div className="text-[11px] font-bold text-yellow-300 leading-tight">
                  {ach.titleBn}
                </div>
                <div className="text-[9px] text-gray-400 line-clamp-2">
                  {ach.descBn}
                </div>
                <div className="text-[10px] font-mono font-black text-lime-400">
                  +{ach.xpReward} XP {ach.isUnlocked ? '✓' : '🔒'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agony Sufferers Leaderboard */}
      <div className="bg-black/80 border-2 border-yellow-400 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-yellow-500/40 pb-2">
          <h3 className="text-xs sm:text-sm font-black text-yellow-300 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>সেরা ভুক্তভোগী লিডারবোর্ড (Hall of Agony Sufferers)</span>
          </h3>
          <span className="text-[10px] text-gray-400">সর্বকালের সর্বোচ্চ স্কোর</span>
        </div>

        <div className="space-y-1.5">
          {leaderboard.map((user) => {
            const isMe = user.rank === 5;
            return (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-2 text-xs border ${
                  isMe
                    ? 'bg-lime-950/70 border-lime-400 text-lime-200 shadow-[2px_2px_0px_#000]'
                    : user.rank === 1
                    ? 'bg-purple-950/80 border-yellow-400 text-yellow-300'
                    : 'bg-[#150a26] border-purple-900 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-6 font-black text-center">{user.rank}.</span>
                  <div>
                    <span className="font-bold">{user.name}</span>
                    <span className="hidden sm:inline-block ml-2 text-[10px] text-gray-400">
                      ({user.role})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[9px] bg-black px-1.5 py-0.5 border border-gray-700 text-gray-400">
                    {user.badge}
                  </span>
                  <span className="font-black text-yellow-300">{user.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quest Claim Toast */}
      {questClaimToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100000] bg-lime-400 text-black border-2 border-black font-mono text-xs font-black px-4 py-2 shadow-[4px_4px_0px_#000] animate-bounce">
          {questClaimToast}
        </div>
      )}

      {/* Direct Feedback Link for Gamification suggestions */}
      <div className="bg-purple-950/80 border border-purple-500 p-3 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-red-400" />
          <span>গেমিফিকেশনে নতুন ট্রফি বা লেভেল আইডিয়া আছে? সরাসরি ওনারকে জানান: <strong className="text-yellow-300 underline">Official Developer Mailbox</strong></span>
        </div>
        <button
          onClick={() => {
            playSound('coin');
            onOpenFeedbackModal();
          }}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-3 py-1 text-xs border border-black cursor-pointer shadow-[2px_2px_0px_#000]"
        >
          মতামত দিন
        </button>
      </div>
    </section>
  );
};
