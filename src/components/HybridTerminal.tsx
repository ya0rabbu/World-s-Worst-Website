import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Sparkles,
  Zap,
  Skull,
  Play,
  CornerDownLeft,
  Maximize2,
  Minimize2,
  Trash2,
  Volume2,
  HelpCircle,
  Award,
  MessageSquare,
  Flame,
} from 'lucide-react';
import { playSound, playHorrorSound } from '../utils/audioSynth';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: string;
}

interface HybridTerminalProps {
  onTriggerChaos?: () => void;
  onTriggerMagic?: () => void;
  onAddRage?: () => void;
  onOpenFeedback?: () => void;
  onOpenGamification?: () => void;
  onTriggerHorror?: (variant: 'drone' | 'jumpscare' | 'heartbeat' | 'scream' | 'whisper') => void;
  xp?: number;
}

const INITIAL_HISTORY: TerminalLine[] = [
  {
    id: '1',
    type: 'system',
    content: 'Guinness UX Hybrid Terminal v5.2.14-release (x86_64-hostile-linux)',
  },
  {
    id: '2',
    type: 'system',
    content: 'Type "help" or click suggestion categories below to test 24-bit horror, cyber neofetch, magic, and quests.',
  },
  {
    id: '3',
    type: 'output',
    content: 'Kernel: Linux 6.9.1-guinness-atrocity | Shell: bash 5.2 | Audio: 24-bit Web Audio Pipeline Active',
  },
];

const CATEGORIZED_SUGGESTIONS = {
  horror: {
    label: '🔊 24-BIT HORROR',
    color: 'border-red-600 text-red-400 bg-red-950/40',
    commands: ['horror', 'jumpscare', 'scream', 'heartbeat', 'whisper'],
  },
  system: {
    label: '💻 SYSTEM & GUINNESS',
    color: 'border-yellow-600 text-yellow-300 bg-yellow-950/40',
    commands: ['help', 'neofetch', 'top', 'records', 'cat records.txt', 'ls'],
  },
  gamify: {
    label: '🎮 GAMIFICATION',
    color: 'border-lime-600 text-lime-400 bg-lime-950/40',
    commands: ['xp', 'quests', 'badges'],
  },
  magic: {
    label: '✨ MAGIC & CHAOS',
    color: 'border-pink-600 text-pink-300 bg-pink-950/40',
    commands: ['magic', 'matrix', 'pixi', 'chaos'],
  },
  feedback: {
    label: '✍️ REVIEWS',
    color: 'border-cyan-600 text-cyan-300 bg-cyan-950/40',
    commands: ['feedback', 'review', 'request'],
  },
};

export const HybridTerminal: React.FC<HybridTerminalProps> = ({
  onTriggerChaos,
  onTriggerMagic,
  onAddRage,
  onOpenFeedback,
  onOpenGamification,
  onTriggerHorror,
  xp = 120,
}) => {
  const [history, setHistory] = useState<TerminalLine[]>(INITIAL_HISTORY);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'horror' | 'system' | 'gamify' | 'magic' | 'feedback'>('horror');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    playSound('terminal');

    // Add to input history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const newLines: TerminalLine[] = [
      { id: `${Date.now()}-in`, type: 'input', content: `root@hostile-box:~$ ${trimmed}` },
    ];

    const lower = trimmed.toLowerCase();
    const parts = lower.split(' ');
    const cmd = parts[0];

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (cmd === 'help') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'output',
        content: `========================================================================
GUINNESS UX HYBRID TERMINAL - SUGGESTED COMMAND REFERENCE
========================================================================
[🔊 24-BIT PROCEDURAL HORROR AUDIO]
  horror            Play 24-bit binaural dark horror drone with sub-bass
  jumpscare         Trigger violent explosive horror metallic impact
  scream            Synthesize shrill psycho-violin cluster screech
  heartbeat         Realistic binaural double-thump heartbeat (lub-dub)
  whisper           Spectral bandpass ghostly whisper sweep

[💻 SYSTEM TELEMETRY & GUINNESS ARCHIVES]
  neofetch          Inspect CPU, RAM, and Guinness UX specifications
  records           Read official Guinness World Record certificate
  cat <file>        Read file (e.g., "cat records.txt", "cat cookies.txt")
  ls [-la]          List directory contents
  top               View memory-wasting processes (useless_marquee.exe)
  curl              Fetch remote hostile frustration telemetry
  whoami            Show authenticated victim profile

[🎮 GAMIFICATION & QUESTS]
  xp                Check current Agony XP and player rank
  quests            Open live survival missions and quests
  badges            Inspect unlocked achievement trophies

[✨ MAGIC & VISUAL FX]
  magic             Cast celestial stardust spell & trigonometric runes
  matrix            Toggle Cyber Green Matrix phosphor mode
  pixi              Inspect 3,000 thought particle GPU WebGL benchmark
  chaos             Toggle 30% Chaos Inversion engine

[✍️ COMMUNITY FEEDBACK]
  feedback          Open website review and suggestion modal
  review            Submit your raw review and agony rating
  request           Submit a feature request for more hostile features
========================================================================`,
      });
    } else if (cmd === 'horror') {
      playHorrorSound('drone');
      onTriggerHorror?.('drone');
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'error',
        content: `💀 [24-BIT BINAURAL HORROR DRONE ACTIVE]
Synthesizing 42.5Hz sub-bass and tritone Devil's Interval (D5/G#5)...
The darkness whispers through your speakers. Do not look behind you.`,
      });
    } else if (cmd === 'jumpscare') {
      playHorrorSound('jumpscare');
      onTriggerHorror?.('jumpscare');
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'error',
        content: `⚡ [VIOLENT JUMPSCARE IMPACT DETONATED]
Harsh dissonant cluster shock wave executed! Heart rate spike detected.`,
      });
    } else if (cmd === 'scream') {
      playHorrorSound('scream');
      onTriggerHorror?.('scream');
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'error',
        content: `🔪 [PSYCHO-VIOLIN SCREECH CLUSTER]
2,400Hz frequency flutter scraping through high-pass filters...`,
      });
    } else if (cmd === 'heartbeat') {
      playHorrorSound('heartbeat');
      onTriggerHorror?.('heartbeat');
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'error',
        content: `💓 [LUB-DUB DUAL HEARTBEAT PULSING]
Acoustic body resonance simulating 65Hz / 52Hz double systolic thump.`,
      });
    } else if (cmd === 'whisper') {
      playHorrorSound('whisper');
      onTriggerHorror?.('whisper');
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'system',
        content: `🌫️ [GHOSTLY SPECTRAL WHISPER SWEEP]
"You should have listened to the warning message..."`,
      });
    } else if (cmd === 'feedback' || cmd === 'review' || cmd === 'request') {
      playSound('win');
      onOpenFeedback?.();
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'success',
        content: `📢 Launching Community Feedback & Feature Request System!
Opening review modal... Share your honest opinion and agony rating!`,
      });
    } else if (cmd === 'xp' || cmd === 'quests' || cmd === 'badges' || cmd === 'level') {
      playSound('coin');
      onOpenGamification?.();
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'success',
        content: `🎮 [AGONY GAMIFICATION STATUS]
Total XP: ${xp} XP | Rank: Level ${Math.min(6, Math.floor(xp / 180) + 1)}
Opening Gamification Center with active quests and achievements!`,
      });
    } else if (cmd === 'neofetch' || cmd === 'uname') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'success',
        content: `       .---.       root@hostile-box
      /     \\      ----------------
     | () () |     OS: Atrocity Linux 6.9 x86_64
      \\  ^  /      Host: Intel Pentium 75MHz (Overclocked to 76MHz)
       |||||       Kernel: 6.9-hostile-guinness
       |||||       Audio: 24-Bit Procedural Web Audio Engine
                   Shell: bash 5.2.14
                   Resolution: 800x600 (CRT Strobe)
                   DE: Comic Sans 90s Geocities
                   Theme: Toxic Magenta / Neon Lime
                   CPU: 1 Core @ 99.9% Marquee Load
                   Memory: 640KB / 16MB (640K ought to be enough)
                   GPU: PixiJS & Three.js WebGL Accelerators`,
      });
    } else if (cmd === 'records' || cmd === 'guinness') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'success',
        content: `[GUINNESS WORLD RECORD CERTIFICATE #UX-9942]
Official Verdict: Certified as the single most intentionally hostile,
mathematically frustrating, and technologically over-engineered web experience.
Features: 10 certified pillars of agony, 24-bit horror audio, PixiJS swarming thoughts,
Konva scene graph, Fabric CAD canvas, and Framer Motion anti-ergonomics.`,
      });
    } else if (cmd === 'cat') {
      const file = parts[1] || '';
      if (file.includes('record') || file === 'records.txt') {
        newLines.push({
          id: `${Date.now()}-out`,
          type: 'success',
          content: `[GUINNESS WORLD RECORD CERTIFICATE #UX-9942]
Official Verdict: Certified as the single most intentionally hostile web experience.
Includes warning in Bangla & English, full review submission, 24-bit horror soundscapes,
and 3,000 thought particle swarm physics.`,
        });
      } else if (file.includes('cookie') || file === 'cookies.txt') {
        newLines.push({
          id: `${Date.now()}-out`,
          type: 'output',
          content: `[COOKIES.TXT]
- Telemetry: TRACKING EVERY MOUSE BLINK
- Slippery Reject Button: ACTIVE
- Opt-out Difficulty: O(N!) factorial computational complexity`,
        });
      } else {
        newLines.push({
          id: `${Date.now()}-out`,
          type: 'error',
          content: `cat: ${file || 'unknown'}: No such file. Try "cat records.txt" or "cat cookies.txt"`,
        });
      }
    } else if (cmd === 'ls') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'output',
        content: `drwxr-xr-x 4 root root 4096 Sep  6 22:00 .
-rwxr-xr-x 1 root root 9842 Sep  6 21:59 guinness_record.txt
-rw-r--r-- 1 root root 2048 Sep  6 21:58 horror_24bit.wav
-rw-r--r-- 1 root root 1024 Sep  6 21:57 pixi_thoughts.ts
-rw-r--r-- 1 root root 2048 Sep  6 21:56 konva_stage.json
-rw-r--r-- 1 root root 4096 Sep  6 21:55 fabric_vectors.cad
-rwxr-xr-x 1 root root  512 Sep  6 21:54 karen_support_bot.sh
-rw------- 1 root root 8192 Sep  6 21:53 cursed_cookies.sqlite
-rwxr-xr-x 1 root root 3120 Sep  6 21:52 worst_sliders.exe`,
      });
    } else if (cmd === 'pixi') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'success',
        content: `[PIXI.JS ENGINE ACCELERATION]
Seeding 3,000 hardware-accelerated particle thoughts into GPU WebGL buffer...
Scroll to the 2D Canvas Engine Triad to inspect live vortex and repulsion physics!`,
      });
    } else if (cmd === 'magic') {
      playSound('magic');
      onTriggerMagic?.();
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'success',
        content: `✨ CASTING CELESTIAL STARDUST MAGIC!
[ARCANE MANA RECHARGED: 100%]
Celestial runes shimmering with trigonometric harmonic physics.`,
      });
    } else if (cmd === 'matrix') {
      playSound('coin');
      setIsMatrixMode((prev) => !prev);
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'output',
        content: `CYBER MATRIX DISPLAY MODE: ${!isMatrixMode ? 'ACTIVATED' : 'DEACTIVATED'}`,
      });
    } else if (cmd === 'chaos') {
      playSound('glitch');
      onTriggerChaos?.();
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'output',
        content: `🌀 30% CHAOS INVERSION STATE TOGGLED! Reality inversion chance active.`,
      });
    } else if (cmd === 'top') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'output',
        content: `Tasks: 42 total, 1 running, 41 sleeping, 0 stopped
%Cpu(s): 99.4 us,  0.5 sy,  0.0 ni,  0.1 id
MiB Mem :     16.0 total,      0.2 free,     15.8 used
  PID USER      PR  NI    VIRT    RES  %CPU %MEM     TIME+ COMMAND
 1337 root      20   0  512.0M  14.2M  74.2  88.7   4:19.20 useless_marquee.exe
 9842 root      20   0  128.0M   8.1M  18.5  50.6   1:12.44 popup_hydra.daemon
  404 root      20   0   64.0M   4.0M   6.1  25.0   0:45.10 phone_slider.bin
    1 root      20   0    2.0M   0.5M   0.2   3.1   0:01.00 init`,
      });
    } else if (cmd === 'whoami') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'output',
        content: 'victim_user_#9842 (Role: Subject of Maximum Frustration Experiment | Rank: Agony Explorer)',
      });
    } else if (cmd === 'curl') {
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'output',
        content: `HTTP/1.1 200 OK
Content-Type: application/json
{
  "status": "hostile",
  "guinness_record": true,
  "frustration_index": "CRITICAL",
  "recommended_action": "DO NOT CLOSE POPUPS",
  "horror_audio": "24-BIT_ENABLED",
  "engines": ["PixiJS", "Konva.js", "Fabric.js", "Three.js", "GSAP"]
}`,
      });
    } else if (trimmed.includes('rm -rf') || trimmed.includes('delete')) {
      playSound('error');
      onAddRage?.();
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'error',
        content: `🚨 [CRITICAL KERNEL EXCEPTION #0xDEADBEEF]
sudo: rm: Cannot unlink "/": Permission denied!
THE WORLD'S WORST WEBSITE CANNOT BE DESTROYED.
System rage increased by +10%!`,
      });
    } else {
      playSound('error');
      newLines.push({
        id: `${Date.now()}-out`,
        type: 'error',
        content: `bash: ${trimmed}: command not found. Type "help" or click suggestion buttons below.`,
      });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playSound('click');

    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIdx + 1 < commandHistory.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const allCmds = Object.values(CATEGORIZED_SUGGESTIONS).flatMap((c) => c.commands);
      const match = allCmds.find((s) => s.startsWith(inputVal.trim().toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  return (
    <div
      className={`border-4 border-yellow-400 font-mono shadow-[8px_8px_0px_#000] transition-all duration-300 ${
        isMaximized ? 'fixed inset-3 z-[99999] max-h-[95vh]' : 'relative w-full'
      } ${
        isMatrixMode
          ? 'bg-black text-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.3)]'
          : 'bg-[#0e071a] text-gray-200'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-950 via-gray-900 to-black border-b-2 border-yellow-400 select-none">
        <div className="flex items-center gap-2">
          {/* Mac/Linux Window Dots */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playSound('beep');
                setHistory([]);
              }}
              title="Clear terminal buffer"
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 border border-black cursor-pointer"
            />
            <button
              onClick={() => {
                playSound('beep');
                setIsMatrixMode((m) => !m);
              }}
              title="Toggle Matrix Green Phosphor"
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 border border-black cursor-pointer"
            />
            <button
              onClick={() => {
                playSound('beep');
                setIsMaximized((m) => !m);
              }}
              title="Toggle Fullscreen Terminal"
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 border border-black cursor-pointer"
            />
          </div>

          <span className="font-bold text-xs text-yellow-300 flex items-center gap-1.5 ml-2">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            root@guinness-kernel: ~ (bash 5.2 interactive shell)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[10px] bg-black/60 border border-purple-500 px-2 py-0.5 text-cyan-300">
            24-BIT AUDIO ON
          </span>
          <button
            onClick={() => setIsMaximized((m) => !m)}
            className="p-1 hover:bg-purple-900 text-yellow-300 cursor-pointer"
            title="Toggle Size"
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Categorized Command Suggestions Tabs */}
      <div className="bg-black/90 border-b border-gray-800 p-2 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-yellow-400 font-bold text-[10px] uppercase">SUGGESTIONS:</span>
            {(Object.keys(CATEGORIZED_SUGGESTIONS) as Array<keyof typeof CATEGORIZED_SUGGESTIONS>).map((catKey) => {
              const cat = CATEGORIZED_SUGGESTIONS[catKey];
              const isSelected = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => {
                    playSound('click');
                    setActiveCategory(catKey);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-yellow-400 text-black border-yellow-400 font-black'
                      : 'bg-[#150a2b] text-gray-400 border-purple-900 hover:border-purple-500'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleCommand('help')}
            className="hidden sm:flex items-center gap-1 text-[10px] text-cyan-300 hover:text-white cursor-pointer bg-cyan-950/60 px-2 py-0.5 border border-cyan-700"
          >
            <HelpCircle className="w-3 h-3" />
            <span>HELP INDEX</span>
          </button>
        </div>

        {/* Quick Executable Chips for active category */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none pt-0.5">
          <span className="text-gray-500 text-[10px]">CLICK TO RUN:</span>
          {CATEGORIZED_SUGGESTIONS[activeCategory].commands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              className="px-2.5 py-1 bg-purple-950 hover:bg-purple-800 text-yellow-300 border border-purple-500 rounded text-[10px] font-mono cursor-pointer active:scale-95 transition-transform flex items-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <Play className="w-2.5 h-2.5 text-lime-400 fill-lime-400" />
              <span>{cmd}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shell Output Viewport */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="p-3 sm:p-4 text-xs font-mono overflow-y-auto space-y-1.5 min-h-[190px] max-h-[360px] bg-black/75 cursor-text select-text"
      >
        {history.map((line) => {
          if (line.type === 'input') {
            return (
              <div key={line.id} className="text-yellow-300 font-bold flex items-start gap-1">
                <span>{line.content}</span>
              </div>
            );
          }
          if (line.type === 'error') {
            return (
              <div key={line.id} className="text-red-400 font-semibold whitespace-pre-wrap pl-2 border-l-2 border-red-500">
                {line.content}
              </div>
            );
          }
          if (line.type === 'success') {
            return (
              <div key={line.id} className="text-lime-300 whitespace-pre-wrap pl-2 border-l-2 border-lime-400 font-mono">
                {line.content}
              </div>
            );
          }
          if (line.type === 'system') {
            return (
              <div key={line.id} className="text-cyan-400 text-[11px] italic">
                {line.content}
              </div>
            );
          }
          return (
            <div key={line.id} className="text-gray-300 whitespace-pre-wrap pl-2">
              {line.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Shell Command Input */}
      <div className="p-2 sm:p-3 bg-black border-t-2 border-yellow-400 flex items-center gap-2">
        <span className="text-lime-400 font-bold text-xs whitespace-nowrap">
          root@hostile-box:~$
        </span>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command (try 'horror', 'neofetch', 'feedback', 'xp', 'magic')..."
            className="w-full bg-transparent border-none outline-none text-xs font-mono text-yellow-300 placeholder-gray-600 focus:ring-0"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <button
          onClick={() => handleCommand(inputVal)}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-2.5 py-1 text-[11px] font-bold border border-black flex items-center gap-1 cursor-pointer"
        >
          <CornerDownLeft className="w-3 h-3" />
          <span className="hidden sm:inline">RUN</span>
        </button>
      </div>
    </div>
  );
};

