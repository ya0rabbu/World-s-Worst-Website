import React, { useState } from 'react';
import { Award, Trophy, Skull, Bug, Sparkles, Send, MessageSquare } from 'lucide-react';
import { playSound } from '../utils/audioSynth';
import { useHeaderScramble } from '../hooks/useHeaderScramble';

interface WorstRecordsProps {
  onAddRage: () => void;
  onOpenCertificate: () => void;
}

export const WorstRecords: React.FC<WorstRecordsProps> = ({ onAddRage, onOpenCertificate }) => {
  const scrambledTitle = useHeaderScramble('GUINNESS HALL OF ATROCITIES', 2000);
  const scrambledSub = useHeaderScramble("10 Official Records for World's Worst Digital Product", 2800);

  // Catch the Fly Game state
  const [flyPos, setFlyPos] = useState({ top: 45, left: 50 });
  const [flyCatches, setFlyCatches] = useState(0);

  // Guestbook with reverse text input
  const [guestText, setGuestText] = useState('');
  const [guestEntries, setGuestEntries] = useState<string[]>([
    "txet ym desrever etis siht !pleH",
    "kcats sseldne na otni degnahc rettels yM",
    "enots a ekil gnipoorp si elcycer ym woN",
  ]);

  const recordsList = [
    {
      num: '#01',
      title: 'Fastest Blood Pressure Spike',
      metric: '0 to 180 BPM in 4.2s',
      desc: 'Tested and verified on over 10,000 unfortunate web developers.',
    },
    {
      num: '#02',
      title: 'Slider Phone Precision Crisis',
      metric: '10 Billion Discrete Ticks',
      desc: 'Dragging a slider across 10 digits requires atomic microscopy.',
    },
    {
      num: '#03',
      title: 'Slot Machine Birthday Roulette',
      metric: '1 in 40,150 Odds',
      desc: 'Users spend average 7.3 weeks spinning reels to find their real birthday.',
    },
    {
      num: '#04',
      title: 'Predatory E-Commerce Surcharges',
      metric: '+430% Markup on Invisible Air',
      desc: 'Mandatory 150% tips and $45 Carrier Pigeon delivery fees.',
    },
    {
      num: '#05',
      title: 'Hydra Spam Ad Replication',
      metric: 'O(2^N) Popup Growth',
      desc: 'Clicking the close box spawns additional popups in random quadrants.',
    },
    {
      num: '#06',
      title: 'Linguistic Reverse-Psychology Traps',
      metric: 'Triple Negatives in Legal Terms',
      desc: 'Nobody has ever successfully understood what checking the box does.',
    },
    {
      num: '#07',
      title: 'Inverted Audio Engineering',
      metric: '0% Volume = 100% Volume',
      desc: 'Violates second law of thermodynamics to ensure zero peaceful silence.',
    },
    {
      num: '#08',
      title: 'Customer Service Karen-9000',
      metric: '0.000% Issue Resolution Rate',
      desc: 'AI model trained exclusively on dismissive manager phone calls.',
    },
    {
      num: '#09',
      title: 'The Fleeing Reject Button',
      metric: 'Speed of Light Evasion',
      desc: 'Physical evasion algorithms ensure 100% cookie tracking compliance.',
    },
    {
      num: '#10',
      title: 'Astounding Graphic Hostility',
      metric: '100% Toxic Lime & Comic Sans',
      desc: 'Officially banned by the International Design Standards Council.',
    },
  ];

  const dodgeFly = () => {
    playSound('beep');
    onAddRage();
    const top = Math.floor(Math.random() * 80) + 10;
    const left = Math.floor(Math.random() * 85) + 5;
    setFlyPos({ top, left });
  };

  const catchFly = () => {
    playSound('win');
    setFlyCatches((c) => c + 1);
    dodgeFly();
  };

  const handleGuestbookTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound('glitch');
    // Mirror reverse text typing
    const val = e.target.value;
    const reversed = val.split('').reverse().join('');
    setGuestText(reversed);
  };

  const handleAddGuestEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestText.trim()) return;
    playSound('coin');
    setGuestEntries((prev) => [guestText, ...prev]);
    setGuestText('');
  };

  return (
    <section className="bg-amber-200 border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_#000] font-['Comic_Neue',cursive]">
      {/* Header */}
      <div className="bg-yellow-400 text-black p-3 border-2 border-black flex flex-wrap items-center justify-between gap-3 mb-6 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 text-yellow-300 border-2 border-black rounded-full flex items-center justify-center animate-spin">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-red-700 leading-tight">
              {scrambledTitle}
            </h2>
            <p className="text-xs font-bold text-purple-900 mt-0.5">
              {scrambledSub}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCertificate}
          className="bg-red-600 hover:bg-red-700 text-white font-['Press_Start_2P',monospace] text-[10px] px-3 py-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
        >
          📜 CLAIM DIPLOMA
        </button>
      </div>

      {/* 10 Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {recordsList.map((rec) => (
          <div
            key={rec.num}
            className="bg-white border-2 border-black p-3 shadow-[3px_3px_0px_#000] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-['Press_Start_2P',monospace] text-[10px] text-red-600">
                  {rec.num}
                </span>
                <span className="bg-black text-yellow-300 font-mono text-[10px] px-2 py-0.5 font-bold">
                  {rec.metric}
                </span>
              </div>
              <h4 className="text-sm font-black text-purple-950 mb-1">
                {rec.title}
              </h4>
              <p className="text-xs text-gray-700">{rec.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mini-Game: Catch The Escaping Fly */}
      <div className="bg-white border-4 border-black p-4 mb-8 shadow-[6px_6px_0px_#000]">
        <div className="flex justify-between items-center border-b-2 border-dashed border-black pb-2 mb-2">
          <div className="font-['Press_Start_2P',monospace] text-xs text-red-600 flex items-center gap-2">
            <Bug className="w-4 h-4 text-lime-600 animate-spin" />
            MINI-CHALLENGE: CATCH THE ESCAPING FLY
          </div>
          <div className="bg-lime-400 font-mono text-xs font-bold px-2 py-0.5 border border-black">
            CATCHES: {flyCatches}
          </div>
        </div>

        <p className="text-xs text-gray-700 mb-2">
          Hover or click on the pesky bug before it evades your cursor. Good luck with your sanity.
        </p>

        <div className="relative h-44 bg-cyan-100 border-2 border-black overflow-hidden select-none">
          <button
            type="button"
            onMouseEnter={dodgeFly}
            onClick={catchFly}
            style={{
              top: `${flyPos.top}%`,
              left: `${flyPos.left}%`,
              transition: 'all 0.08s ease-out',
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-2 bg-yellow-300 hover:bg-yellow-400 border border-black shadow-[2px_2px_0px_#000] cursor-pointer text-xs font-bold flex items-center gap-1"
          >
            🪰 FLY
          </button>
        </div>
      </div>

      {/* Reverse Mirror Guestbook */}
      <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000]">
        <div className="flex items-center gap-2 text-xs font-bold font-['Press_Start_2P',monospace] text-purple-900 border-b pb-2 mb-3">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          REVERSE MIRROR GUESTBOOK
        </div>

        <p className="text-xs text-gray-700 mb-2">
          Leave your message for posterity. Note: All characters typed are instantly printed backwards.
        </p>

        <form onSubmit={handleAddGuestEntry} className="flex gap-2 mb-4">
          <input
            type="text"
            value={guestText}
            onChange={handleGuestbookTyping}
            placeholder="Type your review backwards..."
            className="flex-1 bg-yellow-50 border-2 border-black p-2 text-xs font-mono focus:bg-pink-50 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            SIGN GUESTBOOK
          </button>
        </form>

        <div className="bg-gray-100 border-2 border-black p-3 max-h-40 overflow-y-auto space-y-1.5 font-mono text-xs">
          {guestEntries.map((entry, i) => (
            <div key={i} className="border-b border-gray-300 pb-1 text-gray-800">
              💬 &quot;{entry}&quot;
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
