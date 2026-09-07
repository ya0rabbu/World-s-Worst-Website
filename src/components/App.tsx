import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WorstNav } from './components/WorstNav';
import { MarqueeBanner } from './components/MarqueeBanner';
import { FrustrationDashboard } from './components/FrustrationDashboard';
import { WorstForm } from './components/WorstForm';
import { PopUpSwarm } from './components/PopUpSwarm';
import { ChaosControls } from './components/ChaosControls';
import { CookieNightmareModal } from './components/CookieNightmareModal';
import { GuinnessCertificate } from './components/GuinnessCertificate';
import { FakeCaptchaModal } from './components/FakeCaptchaModal';
import { LowBatteryModal } from './components/LowBatteryModal';
import { InactivityModal } from './components/InactivityModal';
import { WorstStore } from './pages/WorstStore';
import { WorstSupport } from './pages/WorstSupport';
import { WorstUnsubscribe } from './pages/WorstUnsubscribe';
import { WorstRecords } from './pages/WorstRecords';
import { WorstPinterest } from './pages/WorstPinterest';
import { ThreeDisasterCanvas } from './components/ThreeDisasterCanvas';
import { MotionDisasterSuite } from './components/MotionDisasterSuite';
import { NextJsDisasterPanel } from './components/NextJsDisasterPanel';
import { ConfusingCursor } from './components/ConfusingCursor';
import { ReactThreeFiberDisaster } from './components/ReactThreeFiberDisaster';
import { ReactSpringPhysicsLab } from './components/ReactSpringPhysicsLab';
import { LottieDisasterStudio } from './components/LottieDisasterStudio';
import { InteractiveParticleVortex } from './components/InteractiveParticleVortex';
import { useHeaderScramble } from './hooks/useHeaderScramble';
import { useGsapScrollTrigger } from './hooks/useGsapScrollTrigger';
import { PopupAd, FrustrationStats, PageType } from './types';
import { playSound, playHorrorSound } from './utils/audioSynth';
import { Award, Flame, Skull, Sparkles, AlertTriangle, ShieldAlert, Shuffle, Zap, Box, Activity, Film, Terminal, Cpu, Wand2, Trophy, MessageSquare, Volume2 } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';
import { HybridTerminal } from './components/HybridTerminal';
import { CanvasEnginesTriad } from './components/CanvasEnginesTriad';
import { MagicArcaneStudio } from './components/MagicArcaneStudio';
import { MobileAppNav } from './components/MobileAppNav';
import { BanglaEnglishWarningModal } from './components/BanglaEnglishWarningModal';
import { FeedbackReviewModal, TARGET_GMAIL } from './components/FeedbackReviewModal';
import { GamificationCenter, Achievement, getLevelInfo } from './components/GamificationCenter';
import { HorrorSoundPad } from './components/HorrorSoundPad';
import { BangladeshViralNews } from './components/BangladeshViralNews';
import { GamificationShowcaseSection } from './components/GamificationShowcaseSection';
import { GamificationFloatingHud } from './components/GamificationFloatingHud';
import { LiveUserCounter } from './components/LiveUserCounter';
import { MultiUserCursors } from './components/MultiUserCursors';
import { HalftoneStudio } from './components/HalftoneStudio';
import { presenceManager } from './utils/presenceClient';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-warning',
    title: 'Warning Defier',
    titleBn: 'সতর্কবার্তা অগ্রাহ্যকারী',
    desc: 'Braved the bilingual Bangla/English hostile website warning.',
    descBn: 'বাংলা ও ইংরেজি চরম সতর্কবার্তা পড়েও সাইটে ঢুকেছেন।',
    icon: '⚠️',
    xpReward: 30,
    isUnlocked: true,
  },
  {
    id: 'ach-horror',
    title: '24-Bit Horror Survivor',
    titleBn: '২৪-বিট হরর সারভাইভার',
    desc: 'Endured acoustic terror from the 24-bit sound lab.',
    descBn: '২৪-বিট সাইকোঅ্যাকোস্টিক হরর সাউন্ড ট্রাই করে বেঁচে ফিরেছেন।',
    icon: '👻',
    xpReward: 35,
    isUnlocked: false,
  },
  {
    id: 'ach-viral',
    title: 'BD Viral Connoisseur',
    titleBn: 'বাংলাদেশি ভাইরাল বিশেষজ্ঞ',
    desc: 'Explored Bangladesh viral news, kacchi biryani war, and reacted to satire.',
    descBn: 'বাংলাদেশি ভাইরাল নিউজ, কাচ্চির রণক্ষেত্র ও পদ্মা সেতুর সেলফি গ্যাং এক্সপ্লোর করেছেন।',
    icon: '🇧🇩',
    xpReward: 40,
    isUnlocked: false,
  },
  {
    id: 'ach-rabbu-mail',
    title: 'Direct Line to Rabbu',
    titleBn: 'রাব্বুর ইনবক্স দূত',
    desc: 'Sent an honest opinion directly to the creator official inbox.',
    descBn: 'সরাসরি ক্রিয়েটরের অফিসিয়াল ইনবক্সে নিজের মতামত বা ক্ষোভ পাঠিয়েছেন।',
    icon: '✉️',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'ach-terminal',
    title: 'Kernel Cyber Wizard',
    titleBn: 'টার্মিনাল সাইবার জাদুকর',
    desc: 'Executed commands in the hostile bash hybrid terminal.',
    descBn: 'টার্মিনালে শেল কমান্ড চালিয়ে ওয়েবসাইট হ্যাক করেছেন।',
    icon: '💻',
    xpReward: 25,
    isUnlocked: false,
  },
  {
    id: 'ach-feedback',
    title: 'Critic of the Year',
    titleBn: 'বছরের সেরা সমালোচক',
    desc: 'Submitted an official review or feature request.',
    descBn: 'ফালতু ওয়েবসাইট নিয়ে মতামত বা নতুন ফিচার রিকোয়েস্ট দিয়েছেন।',
    icon: '⭐',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'ach-canvas',
    title: 'Canvas Triad Master',
    titleBn: 'ক্যানভাস ট্রায়াড মাস্টার',
    desc: 'Inspected 2,500 PixiJS thoughts, Konva, and Fabric.',
    descBn: 'পিক্সি জেএস ও কোনভা ক্যানভাস আর্ট এক্সপ্লোর করেছেন।',
    icon: '🎨',
    xpReward: 40,
    isUnlocked: false,
  },
  {
    id: 'ach-halftone',
    title: 'Halftone Matrix Pioneer',
    titleBn: 'হাফটোন ডট রূপকার',
    desc: 'Generated custom halftone dotted or retro cinematic art with Python engine.',
    descBn: 'পাইথন ইঞ্জিন দিয়ে হাফটোন ডটেড বা রেট্রো সিনেমাটিক আর্ট তৈরি করেছেন।',
    icon: '🖼️',
    xpReward: 40,
    isUnlocked: false,
  },
  {
    id: 'ach-chaos',
    title: 'Entropy Overlord',
    titleBn: 'বিশৃঙ্খলার সম্রাট',
    desc: 'Engaged the 30% Chaos Inversion engine.',
    descBn: '৩০% ক্যাওস ইনভার্সন ইঞ্জিন চালিয়ে বাস্তবতা উল্টে দিয়েছেন।',
    icon: '🌀',
    xpReward: 30,
    isUnlocked: false,
  },
];

export default function App() {
  // Initial Boot Loading Screen
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Navigation
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Warning Modal, Feedback/Review Modal, Gamification, Horror Sound
  const [showWarningModal, setShowWarningModal] = useState<boolean>(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showGamificationModal, setShowGamificationModal] = useState<boolean>(false);
  const [warningToast, setWarningToast] = useState<string | null>(null);

  // Gamification XP & Achievements State with local persistence
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('guinness_user_xp');
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('guinness_user_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const match = prev.find((a) => a.id === id);
      if (match && !match.isUnlocked) {
        playSound('win');
        setXp((curr) => {
          const next = curr + match.xpReward;
          try {
            localStorage.setItem('guinness_user_xp', next.toString());
          } catch {}
          return next;
        });
        const updated = prev.map((a) => (a.id === id ? { ...a, isUnlocked: true } : a));
        try {
          localStorage.setItem('guinness_user_achievements', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });
  };

  const handleGainXp = (amount: number) => {
    setXp((curr) => {
      const next = curr + amount;
      try {
        localStorage.setItem('guinness_user_xp', next.toString());
      } catch {}
      return next;
    });
  };

  const handleContinueWarning = () => {
    setShowWarningModal(false);
    playSound('win');
    unlockAchievement('ach-warning');
    handleGainXp(20);
  };

  const handleLeaveWarning = () => {
    setShowWarningModal(false);
    playSound('honk');
    addRage(10);
    setWarningToast("🚨 'ফালতু বাদ দেই' বাটনে ক্লিক করেছেন? কিন্তু হোস্টাইল সাইট আপনাকে সহজে ছাড়বে না! পুরো সাইটটা দেখুন!");
    setTimeout(() => setWarningToast(null), 5000);
  };

  const levelInfo = getLevelInfo(xp);

  // Chaos Mode (Optional 30% chance for inverted actions, turned off by default for clean entry)
  const [chaosMode, setChaosMode] = useState<boolean>(false);
  const [chaosAlert, setChaosAlert] = useState<string | null>(null);
  const [scrollAlert, setScrollAlert] = useState<string | null>(null);
  const [retroCursorActive, setRetroCursorActive] = useState<boolean>(false);

  // Scrambled Headers
  const scrambledNomination = useHeaderScramble("GUINNESS WORLD RECORD NOMINATION", 2200);
  const scrambledPillars = useHeaderScramble("THE 10 PILLARS OF PURE UX AGONY", 2600);
  const scrambledWebring = useHeaderScramble("THE WORST WEBRING © 1996-2026. ALL WRONGS RESERVED.", 3200);

  // Frustration metrics
  const [stats, setStats] = useState<FrustrationStats>({
    clicks: 0,
    rageClicks: 0,
    attempts: 0,
    timeSpentSeconds: 0,
    frustrationScore: 18,
  });

  const addRage = (amount = 6) => {
    setStats((prev) => ({
      ...prev,
      rageClicks: prev.rageClicks + 1,
      frustrationScore: Math.min(100, prev.frustrationScore + amount),
    }));
  };

  // GSAP ScrollTrigger telemetry
  const { scrollSpeedMultiplier, snapbackCount } = useGsapScrollTrigger({
    enabled: true,
    onSnapback: () => {
      setScrollAlert("⚡ GSAP SCROLLTRIGGER TELEMETRY: Scroll milestone reached!");
      setTimeout(() => setScrollAlert(null), 3500);
    },
    onAddRage: () => addRage(5),
  });

  // Modals & UI States (All closed on initial load so visitors can explore immediately!)
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showLowBattery, setShowLowBattery] = useState(false);
  const [showInactivity, setShowInactivity] = useState(false);

  // Themes & Effects
  const [currentTheme, setCurrentTheme] = useState<'toxic' | 'geocities' | 'stealth'>('toxic');
  const [isTilted, setIsTilted] = useState(false);
  const [sparklesActive, setSparklesActive] = useState(true);
  const [earthquakeActive, setEarthquakeActive] = useState(false);
  const [cursorTrails, setCursorTrails] = useState<{ id: number; x: number; y: number }[]>([]);

  // Popups swarm state (Empty by default so visitors are never blocked upon arrival!)
  const [popups, setPopups] = useState<PopupAd[]>([]);

  // Timer for time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        timeSpentSeconds: prev.timeSpentSeconds + 1,
        frustrationScore: Math.min(100, prev.frustrationScore + 0.05),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track global clicks & rage
  const handleGlobalClick = () => {
    setStats((prev) => ({
      ...prev,
      clicks: prev.clicks + 1,
      frustrationScore: Math.min(100, prev.frustrationScore + 0.5),
    }));
  };

  // Track mouse for retro sparkle trail
  const handleMouseMove = (e: React.MouseEvent) => {
    if (sparklesActive && Math.random() > 0.6) {
      setCursorTrails((prev) => [
        ...prev.slice(-12),
        { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY },
      ]);
    }
  };

  const spawnRandomPopup = () => {
    playSound('honk');
    const types: ('iphone' | 'antivirus' | 'ram' | 'singles' | 'crypto')[] = [
      'iphone',
      'antivirus',
      'ram',
      'singles',
      'crypto',
    ];
    const titles = [
      'YOU WON 500,000 BITCOINS',
      'YOUR HARD DRIVE IS ON FIRE',
      'HOT SINGLES IN LOCALHOST:3000',
      'FREE RAM (32TB) DOWNLOAD READY',
      'CONGRATULATIONS 1,000,000TH VISITOR',
    ];
    const newPopup: PopupAd = {
      id: `pop-${Date.now()}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      content: 'Click here immediately to claim before timer hits 0:00!',
      top: Math.floor(Math.random() * (window.innerHeight - 320) + 40),
      left: Math.floor(Math.random() * (Math.max(200, window.innerWidth - 340)) + 20),
      zIndex: 50 + popups.length,
      type: types[Math.floor(Math.random() * types.length)],
    };
    setPopups((prev) => [...prev, newPopup]);
    addRage(4);
  };

  const handleClosePopup = (id: string, trickSpawn: boolean) => {
    if (chaosMode && Math.random() < 0.3) {
      playSound('honk');
      addRage(12);
      setChaosAlert("🌀 CHAOS INVERSION (30% TRIGGERED): You clicked to close a popup, so we opened 2 more instead!");
      setTimeout(() => setChaosAlert(null), 4500);
      spawnRandomPopup();
      spawnRandomPopup();
      return;
    }

    setPopups((prev) => prev.filter((p) => p.id !== id));
    if (trickSpawn && Math.random() > 0.35) {
      spawnRandomPopup();
    }
  };

  const handleClearAllPopups = () => {
    if (chaosMode && Math.random() < 0.3) {
      playSound('honk');
      addRage(15);
      setChaosAlert("🌀 CHAOS INVERSION: You clicked 'Close All Popups', so we spawned 4 extra ads!");
      setTimeout(() => setChaosAlert(null), 4500);
      for (let i = 0; i < 4; i++) spawnRandomPopup();
      return;
    }
    setPopups([]);
  };

  const handleNavigation = (page: PageType) => {
    presenceManager.setPage(page);
    if (chaosMode && Math.random() < 0.3) {
      const allPages: PageType[] = ['home', 'pinterest', 'shop', 'support', 'unsubscribe', 'records'];
      const otherPages = allPages.filter((p) => p !== page);
      const inverted = otherPages[Math.floor(Math.random() * otherPages.length)];
      playSound('honk');
      addRage(10);
      setChaosAlert(`🌀 CHAOS INVERSION: You selected [${page.toUpperCase()}], so Chaos Mode routed you to [${inverted.toUpperCase()}]!`);
      setTimeout(() => setChaosAlert(null), 4500);
      presenceManager.setPage(inverted);
      setCurrentPage(inverted);
      return;
    }

    setCurrentPage(page);
  };

  const handleOpenCertificate = () => {
    playSound('win');
    setShowCertificate(true);
  };

  // Background style based on theme
  const getThemeBg = () => {
    if (currentTheme === 'geocities') {
      return 'bg-[#000080] text-yellow-300';
    }
    if (currentTheme === 'stealth') {
      return 'bg-gray-900 text-gray-800';
    }
    return 'bg-[#ff00ff] text-lime-400';
  };

  return (
    <div
      onClick={handleGlobalClick}
      onMouseMove={handleMouseMove}
      className={`min-h-screen ${getThemeBg()} ${isTilted ? 'tilted-chaos' : ''} ${
        earthquakeActive ? 'earthquake-shake' : ''
      } selection:bg-red-500 selection:text-white font-['Comic_Neue',cursive] overflow-x-hidden`}
    >
      {/* Retro Mouse Sparkle Follower */}
      <ConfusingCursor enabled={retroCursorActive} />

      {/* Floating Chaos Inversion Alert Banner */}
      {chaosAlert && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100000] bg-red-600 text-yellow-300 font-mono text-xs md:text-sm font-black px-4 py-2 border-4 border-black shadow-[6px_6px_0px_#000] animate-bounce max-w-xl text-center">
          {chaosAlert}
        </div>
      )}

      {/* Floating GSAP ScrollTrigger Alert Banner */}
      {scrollAlert && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100000] bg-purple-900 text-cyan-300 font-mono text-xs md:text-sm font-black px-4 py-2 border-4 border-yellow-400 shadow-[6px_6px_0px_#000] animate-pulse max-w-xl text-center">
          {scrollAlert}
        </div>
      )}

      {/* Retro Mouse Sparkle Trails */}
      {sparklesActive &&
        cursorTrails.map((trail) => (
          <div
            key={trail.id}
            className="fixed pointer-events-none z-50 text-xs animate-ping select-none"
            style={{ left: trail.x + 8, top: trail.y + 8 }}
          >
            ✨
          </div>
        ))}

      {/* Initial Boot Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Simulated Live Collaborative Multi-User Cursors */}
      <MultiUserCursors />

      {/* Top Bar Real-Time User Counter & Network Monitor */}
      <LiveUserCounter />

      {/* Marquee Banner */}
      <MarqueeBanner onHonk={() => addRage(2)} />

      {/* Hostile Navigation Bar - Desktop Edition */}
      <div className="hidden md:block">
        <WorstNav
          currentPage={currentPage}
          onNavigate={handleNavigation}
          onDialUp={() => addRage(5)}
          onOpenWarning={() => setShowWarningModal(true)}
          onOpenFeedback={() => setShowFeedbackModal(true)}
          onOpenGamification={() => setShowGamificationModal(true)}
          xp={xp}
        />
      </div>

      {/* Modern Mobile App Navigation Dock & Header (Transforms on mobile screens) */}
      <MobileAppNav
        currentPage={currentPage}
        onNavigate={handleNavigation}
        frustrationScore={stats.frustrationScore}
        onTriggerCaptcha={() => setShowCaptcha(true)}
        onTriggerBattery={() => setShowLowBattery(true)}
        onTriggerCookies={() => setCookieModalOpen(true)}
        onSpawnAd={() => spawnRandomPopup()}
        onDialUp={() => addRage(5)}
        chaosMode={chaosMode}
        onToggleChaosMode={() => setChaosMode(!chaosMode)}
        onTriggerWarning={() => setShowWarningModal(true)}
        onTriggerFeedback={() => setShowFeedbackModal(true)}
        onTriggerGamification={() => setShowGamificationModal(true)}
        xp={xp}
      />

      {/* Main Content Viewport */}
      <main className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6 pb-28 md:pb-10">
        {/* Global Quick Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-yellow-300 border-2 border-black p-2 mb-4 font-mono text-xs shadow-[3px_3px_0px_#000]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-red-700 text-[11px] sm:text-xs">CHAOS DECK:</span>
            
            {/* Warning Modal Trigger */}
            <button
              onClick={() => {
                playSound('beep');
                setShowWarningModal(true);
              }}
              className="bg-red-600 text-yellow-300 font-bold px-2 py-1 border border-black hover:bg-red-700 cursor-pointer text-[10px] sm:text-xs flex items-center gap-1 shadow-[2px_2px_0px_#000]"
              title="Open Bangla & English Hostile Warning Modal"
            >
              <AlertTriangle className="w-3 h-3 text-yellow-300 animate-bounce" />
              <span>⚠️ সতর্কবার্তা</span>
            </button>

            {/* Feedback & Review Modal Trigger */}
            <button
              onClick={() => {
                playSound('coin');
                setShowFeedbackModal(true);
              }}
              className="bg-purple-800 text-cyan-300 font-bold px-2 py-1 border border-purple-400 hover:bg-purple-700 cursor-pointer text-[10px] sm:text-xs flex items-center gap-1 shadow-[2px_2px_0px_#000]"
              title="Submit Ratings, Reviews & Feature Requests"
            >
              <MessageSquare className="w-3 h-3 text-cyan-300" />
              <span>💬 মতামত দিন</span>
            </button>

            {/* Gamification Center Trigger */}
            <button
              onClick={() => {
                playSound('win');
                setShowGamificationModal(true);
              }}
              className="bg-lime-400 text-black font-black px-2 py-1 border border-black hover:bg-lime-300 cursor-pointer text-[10px] sm:text-xs flex items-center gap-1 shadow-[2px_2px_0px_#000]"
              title="View XP, Quests, Agony Titles & Achievements"
            >
              <Trophy className="w-3 h-3 text-purple-950" />
              <span>🏆 {xp} XP (Lvl {levelInfo.level})</span>
            </button>

            <button
              onClick={() => setShowCaptcha(true)}
              className="bg-purple-700 text-white px-2 py-1 border border-black hover:bg-purple-800 cursor-pointer text-[10px] sm:text-xs font-bold"
            >
              Test CAPTCHA
            </button>
            <button
              onClick={() => setShowLowBattery(true)}
              className="bg-red-600 text-white px-2 py-1 border border-black hover:bg-red-700 cursor-pointer text-[10px] sm:text-xs font-bold"
            >
              1% Battery
            </button>
            <button
              onClick={() => setCookieModalOpen(true)}
              className="bg-amber-600 text-white px-2 py-1 border border-black hover:bg-amber-700 cursor-pointer text-[10px] sm:text-xs font-bold"
            >
              Cookies
            </button>
            <button
              onClick={() => spawnRandomPopup()}
              className="bg-pink-600 text-white px-2 py-1 border border-black hover:bg-pink-700 cursor-pointer text-[10px] sm:text-xs font-bold"
            >
              Spawn Ad
            </button>
            <button
              onClick={() => {
                playSound('glitch');
                setChaosMode(!chaosMode);
              }}
              className={`px-2 py-1 border-2 border-black font-bold cursor-pointer flex items-center gap-1 shadow-[2px_2px_0px_#000] text-[10px] sm:text-xs ${
                chaosMode
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-300 text-black'
              }`}
              title="30% chance for button clicks to trigger opposite action"
            >
              <Shuffle className="w-3 h-3" />
              CHAOS MODE (30%): {chaosMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="bg-black text-lime-400 px-2 py-1 border border-lime-400 text-[10px] font-mono flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-300 animate-spin" />
              <span>GSAP: {scrollSpeedMultiplier.toFixed(1)}x</span>
            </div>
            <button
              onClick={() => {
                playSound('coin');
                handleNavigation('halftone');
              }}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black px-2 py-1 border border-black hover:from-yellow-400 hover:to-amber-500 cursor-pointer text-[10px] sm:text-xs shadow-[2px_2px_0px_#000] flex items-center gap-1"
              title="Generate Halftone, Retro & Cinematic Art with Python PIL Engine"
            >
              <span>🎨 Halftone Studio</span>
            </button>
            <button
              onClick={() => {
                playSound('coin');
                handleNavigation('pinterest');
              }}
              className="bg-[#e60023] text-white font-bold px-2 py-1 border border-black hover:bg-red-700 cursor-pointer text-[10px] sm:text-xs"
            >
              📌 Pinterest
            </button>
            <button
              onClick={handleOpenCertificate}
              className="bg-green-600 text-white font-bold px-2 py-1 border border-black hover:bg-green-700 cursor-pointer text-[10px] sm:text-xs"
            >
              🏆 Certificate
            </button>
          </div>
        </div>

        {/* Smooth Page Transitions via Framer Motion AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="space-y-8"
          >
            {/* Dynamic Page Rendering */}
            {currentPage === 'home' && (
              <>
                {/* ========================================================================= */}
                {/* SECTION 01 / 10: HERO & GUINNESS RECORD VERDICT + LIVE FRUSTRATION HUD */}
                {/* ========================================================================= */}
                <section id="section-01-hero" className="space-y-4">
                  <div className="bg-black text-yellow-400 border-2 border-yellow-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-red-600 text-white px-1.5 py-0.5">SECTION 01 / 10</span>
                    <span>HERO &amp; GUINNESS WORLD RECORD ENTRYWAY</span>
                  </div>

                  <div className="bg-yellow-300 border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0px_#000]">
                    <div className="flex flex-wrap items-center justify-between border-b-2 border-dashed border-black pb-2 mb-3 gap-2">
                      <span className="font-['Press_Start_2P',monospace] text-xs text-red-700 flex items-center gap-1.5 font-bold">
                        <Award className="w-4 h-4 text-yellow-600 animate-spin" />
                        {scrambledNomination}
                      </span>
                      <button
                        onClick={handleOpenCertificate}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                      >
                        📜 View Official Certificate
                      </button>
                    </div>

                    <p className="text-sm font-bold text-gray-900 leading-relaxed mb-3">
                      🏆 <strong>Guinness Committee Verdict:</strong> Certified as the world&apos;s most hostile, chaotic, and technologically over-engineered interactive digital disaster.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
                      <div className="bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                        <div className="text-red-700 font-bold">1. The Slippery Reject Button</div>
                        <div className="text-[11px] text-gray-700">Rejecting cookies makes the button flee your cursor at lightspeed.</div>
                      </div>
                      <div className="bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                        <div className="text-blue-700 font-bold">2. Slider Phone Number</div>
                        <div className="text-[11px] text-gray-700">Requires pixel-perfect slider precision (0 to 9,999,999,999).</div>
                      </div>
                      <div className="bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                        <div className="text-purple-700 font-bold">3. Slot Machine Birthday</div>
                        <div className="text-[11px] text-gray-700">Roll casino reels until you match your birth date.</div>
                      </div>
                      <div className="bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                        <div className="text-pink-700 font-bold">4. Impossible Password Rules</div>
                        <div className="text-[11px] text-gray-700">Bangla alphabet letters, emoji, sum=42, and no letter &apos;e&apos;.</div>
                      </div>
                      <div className="bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                        <div className="text-green-700 font-bold">5. Hydra Ad Spawn Engine</div>
                        <div className="text-[11px] text-gray-700">Closing popups triggers unpredictable retro spawn cascades.</div>
                      </div>
                      <div className="bg-white p-2.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                        <div className="text-orange-700 font-bold">6. Multi-Page Agony</div>
                        <div className="text-[11px] text-gray-700">Scam Store, Karen Bot Support, and Unsubscribe Maze!</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Frustration Dashboard */}
                  <FrustrationDashboard
                    stats={stats}
                    onAddRage={() => addRage(15)}
                    onSpawnPopup={spawnRandomPopup}
                  />

                  {/* Chaos Controls & Audio Synth */}
                  <ChaosControls
                    currentTheme={currentTheme}
                    onThemeChange={(theme) => {
                      playSound('glitch');
                      setCurrentTheme(theme as 'toxic' | 'geocities' | 'stealth');
                    }}
                    isTilted={isTilted}
                    onToggleTilt={() => {
                      playSound('beep');
                      setIsTilted(!isTilted);
                    }}
                    sparklesActive={sparklesActive}
                    onToggleSparkles={() => {
                      playSound('beep');
                      setSparklesActive(!sparklesActive);
                    }}
                    onRateAction={() => addRage(8)}
                    chaosMode={chaosMode}
                    onToggleChaosMode={() => setChaosMode(!chaosMode)}
                  />
                </section>

                {/* ========================================================================= */}
                {/* 🇧🇩 BANGLADESH VIRAL NEWS & SATIRE HUB (WITH HIGH-RES IMAGERY) */}
                {/* ========================================================================= */}
                <BangladeshViralNews
                  onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                  onGainXp={(gain) => {
                    unlockAchievement('ach-viral');
                    handleGainXp(gain);
                  }}
                />

                {/* ========================================================================= */}
                {/* 🎮 AGONY GAMIFICATION HUB, QUESTS & LEADERBOARD (NOW PROMINENT) */}
                {/* ========================================================================= */}
                <GamificationShowcaseSection
                  xp={xp}
                  achievements={achievements}
                  onOpenGamificationModal={() => setShowGamificationModal(true)}
                  onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                  onGainXp={handleGainXp}
                />

                {/* ========================================================================= */}
                {/* HYBRID TERMINAL: UNIX/BASH HOSTILE SHELL INTERPRETER */}
                {/* ========================================================================= */}
                <section id="section-hybrid-terminal" className="space-y-2">
                  <div className="bg-black text-lime-400 border-2 border-lime-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-lime-600 text-black px-1.5 py-0.5">HYBRID TERMINAL</span>
                    <Terminal className="w-3.5 h-3.5" />
                    <span>UNIX / BASH HOSTILE SHELL KERNEL &times; REAL COMMAND LINE</span>
                  </div>
                  <HybridTerminal
                    onTriggerChaos={() => {
                      setChaosMode(!chaosMode);
                      unlockAchievement('ach-chaos');
                    }}
                    onTriggerMagic={() => {
                      playSound('magic');
                      handleGainXp(10);
                    }}
                    onAddRage={() => addRage(10)}
                    onOpenFeedback={() => setShowFeedbackModal(true)}
                    onOpenGamification={() => setShowGamificationModal(true)}
                    onTriggerHorror={(type) => {
                      playHorrorSound(type);
                      unlockAchievement('ach-horror');
                      handleGainXp(15);
                      addRage(5);
                    }}
                    xp={xp}
                  />
                </section>

                {/* ========================================================================= */}
                {/* 24-BIT PROCEDURAL HORROR SOUND LAB & ACOUSTIC TERROR */}
                {/* ========================================================================= */}
                <section id="section-horror-soundpad" className="space-y-2">
                  <div className="bg-black text-red-500 border-2 border-red-500 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-red-600 text-white px-1.5 py-0.5">24-BIT HORROR AUDIO</span>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>PSYCHOACOUSTIC 24-BIT DISSONANT SYNTHESIZER &times; PROCEDURAL TERROR</span>
                  </div>
                  <HorrorSoundPad
                    onHorrorTriggered={() => {
                      unlockAchievement('ach-horror');
                      handleGainXp(15);
                      addRage(6);
                    }}
                  />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 03 / 10: REACT THREE FIBER (R3F) 3D INTERACTIVE HOLODECK */}
                {/* ========================================================================= */}
                <section id="section-03-r3f" className="space-y-2">
                  <div className="bg-black text-cyan-400 border-2 border-cyan-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-cyan-600 text-black px-1.5 py-0.5">SECTION 03 / 10</span>
                    <Box className="w-3.5 h-3.5" />
                    <span>3D ANIMATION &rarr; REACT THREE FIBER (THREE.JS REACT WRAPPER)</span>
                  </div>
                  <ReactThreeFiberDisaster />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 04 / 10: REACT SPRING REAL PHYSICS SIMULATOR */}
                {/* ========================================================================= */}
                <section id="section-04-spring" className="space-y-2">
                  <div className="bg-black text-lime-400 border-2 border-lime-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-lime-500 text-black px-1.5 py-0.5">SECTION 04 / 10</span>
                    <Activity className="w-3.5 h-3.5" />
                    <span>PHYSICS ANIMATION &rarr; REACT SPRING (@REACT-SPRING/WEB)</span>
                  </div>
                  <ReactSpringPhysicsLab />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 05 / 10: LOTTIE REACT & AFTER EFFECTS VECTOR ANIMATION STUDIO */}
                {/* ========================================================================= */}
                <section id="section-05-lottie" className="space-y-2">
                  <div className="bg-black text-yellow-300 border-2 border-yellow-300 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-yellow-400 text-black px-1.5 py-0.5">SECTION 05 / 10</span>
                    <Film className="w-3.5 h-3.5" />
                    <span>AFTER EFFECTS ANIMATION &rarr; LOTTIE REACT (BODYMOVIN JSON)</span>
                  </div>
                  <LottieDisasterStudio />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 06 / 10: KINETIC PARTICLE NEBULA FIELD */}
                {/* ========================================================================= */}
                <section id="section-06-particles" className="space-y-2">
                  <div className="bg-black text-cyan-300 border-2 border-cyan-300 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-cyan-500 text-black px-1.5 py-0.5">SECTION 06 / 10</span>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>PARTICLE EFFECTS &rarr; INTERACTIVE CONSTELLATION &amp; FORCE MESH</span>
                  </div>
                  <InteractiveParticleVortex />
                </section>

                {/* ========================================================================= */}
                {/* 2D CANVAS TRIAD: PIXIJS × KONVA.JS × FABRIC.JS (THOUSANDS OF THOUGHTS) */}
                {/* ========================================================================= */}
                <section id="section-canvas-triad" className="space-y-2">
                  <div className="bg-black text-cyan-400 border-2 border-cyan-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-cyan-600 text-black px-1.5 py-0.5">2D CANVAS TRIAD</span>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>THOUSANDS OF THOUGHTS &rarr; PIXIJS &times; KONVA.JS &times; FABRIC.JS</span>
                  </div>
                  <CanvasEnginesTriad />
                </section>

                {/* ========================================================================= */}
                {/* MAGIC ANIMATION: CELESTIAL STARDUST & ARCANE RUNES */}
                {/* ========================================================================= */}
                <section id="section-magic-particles" className="space-y-2">
                  <div className="bg-black text-pink-400 border-2 border-pink-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-pink-600 text-white px-1.5 py-0.5">MAGIC &times; PARTICLES</span>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>CELESTIAL STARDUST &times; TRIGONOMETRIC ARCANE RUNES</span>
                  </div>
                  <MagicArcaneStudio />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 07 / 10: THREE.JS 3D WEBGL DISASTER CANVAS */}
                {/* ========================================================================= */}
                <section id="section-07-three" className="space-y-2">
                  <div className="bg-black text-pink-400 border-2 border-pink-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-pink-600 text-white px-1.5 py-0.5">SECTION 07 / 10</span>
                    <Zap className="w-3.5 h-3.5" />
                    <span>RAW WEBGL THREE.JS DISASTER VOID &amp; GLITCH MATRIX</span>
                  </div>
                  <ThreeDisasterCanvas onAddRage={() => addRage(8)} />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 08 / 10: FRAMER MOTION KINETIC CHAOS & 3D EULER TILT SUITE */}
                {/* ========================================================================= */}
                <section id="section-08-motion" className="space-y-2">
                  <div className="bg-black text-orange-400 border-2 border-orange-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-orange-500 text-black px-1.5 py-0.5">SECTION 08 / 10</span>
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>FRAMER MOTION KINETIC TILT &amp; FLEEING MOUSE MAGNET</span>
                  </div>
                  <MotionDisasterSuite
                    onAddRage={() => addRage(10)}
                    onToggleEarthquake={setEarthquakeActive}
                  />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 09 / 10: NEXT.JS 15 & TURBOPACK HYDRATION CATASTROPHE SUITE */}
                {/* ========================================================================= */}
                <section id="section-09-nextjs" className="space-y-2">
                  <div className="bg-black text-lime-400 border-2 border-lime-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-lime-600 text-black px-1.5 py-0.5">SECTION 09 / 10</span>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>NEXT.JS 15 &times; TURBOPACK HYDRATION CATASTROPHE SUITE</span>
                  </div>
                  <NextJsDisasterPanel onAddRage={() => addRage(9)} />
                </section>

                {/* ========================================================================= */}
                {/* SECTION 10 / 10: THE WORLD'S WORST FORM & GUINNESS CRIME VAULT */}
                {/* ========================================================================= */}
                <section id="section-10-form" className="space-y-2">
                  <div className="bg-black text-red-400 border-2 border-red-400 px-3 py-1 font-mono text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                    <span className="bg-red-600 text-white px-1.5 py-0.5">SECTION 10 / 10</span>
                    <Skull className="w-3.5 h-3.5" />
                    <span>THE WORLD&apos;S WORST FORM &amp; GUINNESS SUBMISSION ENGINE</span>
                  </div>
                  <WorstForm
                    onFormAction={() => addRage(3)}
                    onSuccessSubmit={() => setShowCertificate(true)}
                  />
                </section>
              </>
            )}

            {currentPage === 'pinterest' && (
              <WorstPinterest onAddRage={() => addRage(8)} />
            )}

            {currentPage === 'halftone' && (
              <div className="space-y-6">
                <HalftoneStudio
                  onAwardXp={(gain, reason) => {
                    unlockAchievement('ach-halftone');
                    handleGainXp(gain);
                  }}
                />
              </div>
            )}

            {currentPage === 'shop' && (
              <WorstStore onAddRage={() => addRage(8)} />
            )}

            {currentPage === 'support' && (
              <WorstSupport onAddRage={() => addRage(7)} />
            )}

            {currentPage === 'unsubscribe' && (
              <WorstUnsubscribe onAddRage={() => addRage(12)} />
            )}

            {currentPage === 'records' && (
              <WorstRecords
                onAddRage={() => addRage(5)}
                onOpenCertificate={() => setShowCertificate(true)}
              />
            )}

            {currentPage === 'viral' && (
              <div className="space-y-6">
                <BangladeshViralNews
                  onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                  onGainXp={(gain) => {
                    unlockAchievement('ach-viral');
                    handleGainXp(gain);
                  }}
                />
                <GamificationShowcaseSection
                  xp={xp}
                  achievements={achievements}
                  onOpenGamificationModal={() => setShowGamificationModal(true)}
                  onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                  onGainXp={handleGainXp}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer 90s Webring & Badges */}
        <footer className="mt-12 bg-black text-lime-400 p-4 sm:p-6 border-4 border-yellow-400 shadow-[8px_8px_0px_#000] text-center font-mono space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-yellow-300">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <span>{scrambledWebring}</span>
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
          </div>

          <p className="text-[11px] text-gray-300 max-w-lg mx-auto">
            This application was engineered with maximum comedic malice to demonstrate why UX design exists. Certified by the Guinness Committee of Terrible Code.
          </p>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2 text-[10px] sm:text-[11px]">
            <button
              onClick={() => {
                playSound('coin');
                setCookieModalOpen(true);
              }}
              className="text-cyan-400 underline hover:text-white cursor-pointer"
            >
              [Open Cookie Nightmare]
            </button>
            <button
              onClick={() => {
                playSound('beep');
                setShowWarningModal(true);
              }}
              className="text-red-400 font-bold underline hover:text-white cursor-pointer"
            >
              [⚠️ চরম সতর্কবার্তা (Warning Modal)]
            </button>
            <button
              onClick={() => {
                playSound('coin');
                setShowFeedbackModal(true);
              }}
              className="text-cyan-400 font-bold underline hover:text-white cursor-pointer"
            >
              [💬 মতামত ও ফিচার রিকোয়েস্ট (Reviews)]
            </button>
            <button
              onClick={() => {
                playSound('win');
                setShowGamificationModal(true);
              }}
              className="text-lime-400 font-bold underline hover:text-white cursor-pointer"
            >
              [🏆 কষ্টের গেমিফিকেশন ({xp} XP)]
            </button>
            <button
              onClick={handleOpenCertificate}
              className="text-yellow-400 underline hover:text-white cursor-pointer"
            >
              [Claim Guinness Certificate]
            </button>
            <button
              onClick={spawnRandomPopup}
              className="text-red-400 underline hover:text-white cursor-pointer"
            >
              [Summon Spam Ad]
            </button>
            <button
              onClick={() => handleNavigation('records')}
              className="text-pink-400 underline hover:text-white cursor-pointer"
            >
              [View Hall of Atrocities]
            </button>
            <button
              onClick={() => {
                playSound('coin');
                handleNavigation('pinterest');
              }}
              className="text-[#ff4f6a] underline hover:text-white font-bold cursor-pointer"
            >
              [Browse Cursed Pinterest Pins]
            </button>
          </div>
        </footer>
      </main>

      {/* Floating Warning Toast when user clicks "ফালতু বাদ দেই" */}
      {warningToast && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100000] bg-red-600 text-yellow-300 font-mono text-xs md:text-sm font-black px-4 py-2 border-4 border-black shadow-[6px_6px_0px_#000] animate-bounce max-w-lg text-center">
          {warningToast}
        </div>
      )}

      {/* Bilingual Bangla & English Hostile Warning Modal */}
      <BanglaEnglishWarningModal
        isOpen={showWarningModal}
        onClose={handleContinueWarning}
        onLeave={handleLeaveWarning}
      />

      {/* User Feedback, Rating & Feature Request Modal */}
      <FeedbackReviewModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onReviewSubmitted={(xpGain) => {
          unlockAchievement('ach-feedback');
          unlockAchievement('ach-rabbu-mail');
          handleGainXp(xpGain);
        }}
      />

      {/* Gamification & Quests Center Modal */}
      <GamificationCenter
        isOpen={showGamificationModal}
        onClose={() => setShowGamificationModal(false)}
        xp={xp}
        achievements={achievements}
        onClaimQuest={(_questId, questXp) => {
          handleGainXp(questXp);
        }}
      />

      {/* Persistent Agony Gamification Floating HUD */}
      <GamificationFloatingHud
        xp={xp}
        onOpenGamification={() => setShowGamificationModal(true)}
        unlockedCount={achievements.filter((a) => a.isUnlocked).length}
        totalAchievements={achievements.length}
      />

      {/* Pop-up Ads Swarm */}
      <PopUpSwarm
        popups={popups}
        onClosePopup={handleClosePopup}
        onClearAll={handleClearAllPopups}
      />

      {/* Cookie Nightmare Modal */}
      <CookieNightmareModal
        isOpen={cookieModalOpen}
        onClose={() => {
          if (chaosMode && Math.random() < 0.3) {
            playSound('honk');
            addRage(10);
            setChaosAlert("🌀 CHAOS INVERSION: Closing cookies was denied! Triggered Impossible CAPTCHA instead!");
            setTimeout(() => setChaosAlert(null), 4000);
            setShowCaptcha(true);
            return;
          }
          setCookieModalOpen(false);
        }}
        onRejectEscape={() => addRage(5)}
      />

      {/* Impossible CAPTCHA Modal */}
      <FakeCaptchaModal
        isOpen={showCaptcha}
        onVerify={() => {
          setShowCaptcha(false);
          playSound('win');
        }}
        onClose={() => setShowCaptcha(false)}
      />

      {/* 1% Low Battery Panic Modal */}
      <LowBatteryModal
        isOpen={showLowBattery}
        onDismiss={() => setShowLowBattery(false)}
      />

      {/* Inactivity Alert Modal */}
      <InactivityModal
        isOpen={showInactivity}
        onConfirmActive={() => setShowInactivity(false)}
      />

      {/* Guinness Certificate Modal */}
      {showCertificate && (
        <GuinnessCertificate
          recipientName="VALIANT INTERNET SURVIVOR"
          frustrationScore={stats.frustrationScore}
          timeSpentSeconds={stats.timeSpentSeconds}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
