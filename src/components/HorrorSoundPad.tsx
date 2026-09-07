import React, { useState } from 'react';
import { Skull, Volume2, Radio, Zap, AlertTriangle, Play, Sparkles, Activity } from 'lucide-react';
import { playHorrorSound, playSound } from '../utils/audioSynth';

interface HorrorSoundPadProps {
  onHorrorTriggered?: () => void;
}

export const HorrorSoundPad: React.FC<HorrorSoundPadProps> = ({ onHorrorTriggered }) => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlayingFx, setIsPlayingFx] = useState(false);

  const trigger = (type: 'drone' | 'jumpscare' | 'heartbeat' | 'scream' | 'whisper', label: string) => {
    setActiveSound(label);
    setIsPlayingFx(true);
    playHorrorSound(type);
    onHorrorTriggered?.();

    setTimeout(() => {
      setIsPlayingFx(false);
    }, 2000);
  };

  return (
    <div
      id="horror-soundpad-card"
      className="bg-gradient-to-b from-[#11011e] via-[#08000f] to-black border-4 border-red-600 p-3 sm:p-5 shadow-[8px_8px_0px_#000] font-mono space-y-4 relative overflow-hidden"
    >
      {/* Visual Glitch Lines in Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ff0055_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-red-600 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-600 text-black border border-black shadow-[2px_2px_0px_#000]">
            <Skull className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-black text-sm uppercase tracking-wider">
                24-BIT PROCEDURAL HORROR SOUND LAB
              </span>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-600 px-1.5 py-0.5">
                HIGH RES AUDIO
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              ২৪-বিট হাই-রেজ্যুলিউশন সাইকোঅ্যাকোস্টিক হরর সাউন্ড সিন্থেসাইজার (হেডফোন পরলে শিহরণ নিশ্চিত)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-yellow-300 bg-red-950/60 border border-red-500 px-2.5 py-1">
          <Activity className="w-4 h-4 text-red-400 animate-spin" />
          <span>STATUS: {isPlayingFx ? 'ACTIVE OSCILLATION' : 'ARMED & READY'}</span>
        </div>
      </div>

      {/* Audio Waveform Simulator Bars */}
      <div className="bg-black border border-red-900/80 p-2 flex items-center justify-between gap-1 h-12">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 transition-all duration-150 ${
              isPlayingFx
                ? 'bg-gradient-to-t from-red-700 via-pink-500 to-yellow-300'
                : 'bg-red-950/40'
            }`}
            style={{
              height: isPlayingFx
                ? `${Math.max(15, Math.floor(Math.sin(i * 0.8 + Date.now() * 0.01) * 45 + 50))}%`
                : `${(i % 5 + 1) * 12}%`,
            }}
          />
        ))}
      </div>

      {/* Sound Trigger Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
        {/* Drone */}
        <button
          onClick={() => trigger('drone', 'Binaural Dark Drone')}
          className="p-3 bg-[#19042b] hover:bg-[#280745] text-left border-2 border-purple-600 hover:border-red-400 transition-all cursor-pointer group active:scale-95 shadow-[3px_3px_0px_#000]"
        >
          <div className="flex items-center justify-between text-xs text-purple-300 mb-1">
            <span className="font-black text-white group-hover:text-yellow-300">👻 DARK DRONE</span>
            <span className="text-[10px] bg-black px-1.5 py-0.5 text-purple-400">42Hz SUB</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            অশুভ ভৌতিক ডার্ক ড্রোন এবং ডেভিলস ইন্টারভাল ট্রাইটোন রেজোন্যান্স।
          </p>
        </button>

        {/* Jumpscare */}
        <button
          onClick={() => trigger('jumpscare', 'Violent Jumpscare')}
          className="p-3 bg-[#2b040e] hover:bg-[#450717] text-left border-2 border-red-600 hover:border-yellow-400 transition-all cursor-pointer group active:scale-95 shadow-[3px_3px_0px_#000]"
        >
          <div className="flex items-center justify-between text-xs text-red-300 mb-1">
            <span className="font-black text-white group-hover:text-yellow-300">⚡ JUMPSCARE</span>
            <span className="text-[10px] bg-red-600 text-black font-bold px-1.5 py-0.5">SHOCK IMPACT</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            তীব্র ধাতব বিস্ফোরণ এবং বুক কাঁপানো সাব-ড্রপ ক্ল্যাস্টার।
          </p>
        </button>

        {/* Heartbeat */}
        <button
          onClick={() => trigger('heartbeat', 'Double Heartbeat')}
          className="p-3 bg-[#14001f] hover:bg-[#220033] text-left border-2 border-pink-600 hover:border-red-400 transition-all cursor-pointer group active:scale-95 shadow-[3px_3px_0px_#000]"
        >
          <div className="flex items-center justify-between text-xs text-pink-300 mb-1">
            <span className="font-black text-white group-hover:text-yellow-300">💓 DUAL HEARTBEAT</span>
            <span className="text-[10px] bg-black px-1.5 py-0.5 text-pink-400">LUB-DUB</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            আবদ্ধ অন্ধকার ঘরের বাস্তবসম্মত জোড়া হৃদস্পন্দন থাপ্পড়।
          </p>
        </button>

        {/* Scream / Psycho */}
        <button
          onClick={() => trigger('scream', 'Psycho Screech')}
          className="p-3 bg-[#240026] hover:bg-[#3b013e] text-left border-2 border-red-500 hover:border-yellow-400 transition-all cursor-pointer group active:scale-95 shadow-[3px_3px_0px_#000]"
        >
          <div className="flex items-center justify-between text-xs text-red-300 mb-1">
            <span className="font-black text-white group-hover:text-yellow-300">🔪 PSYCHO SCREECH</span>
            <span className="text-[10px] bg-black px-1.5 py-0.5 text-red-400">2.4kHz FLUTTER</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            হ্যারোইং সাইকো থ্রিলার ভায়োলিন চিরুনী আর্তনাদ সাউন্ড।
          </p>
        </button>

        {/* Whisper */}
        <button
          onClick={() => trigger('whisper', 'Ghostly Whisper')}
          className="p-3 bg-[#0d0722] hover:bg-[#160c38] text-left border-2 border-cyan-600 hover:border-yellow-400 transition-all cursor-pointer group active:scale-95 shadow-[3px_3px_0px_#000]"
        >
          <div className="flex items-center justify-between text-xs text-cyan-300 mb-1">
            <span className="font-black text-white group-hover:text-yellow-300">🌫️ GHOST WHISPER</span>
            <span className="text-[10px] bg-black px-1.5 py-0.5 text-cyan-400">SPECTRAL SWEEP</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            কানে কানে ফিসফিস করা অতিপ্রাকৃতিক অশরীরী ব্যান্ডপাস সুইপ।
          </p>
        </button>

        {/* Dialup Screech */}
        <button
          onClick={() => {
            playSound('dialup');
            onHorrorTriggered?.();
          }}
          className="p-3 bg-[#211600] hover:bg-[#382600] text-left border-2 border-yellow-500 hover:border-yellow-300 transition-all cursor-pointer group active:scale-95 shadow-[3px_3px_0px_#000]"
        >
          <div className="flex items-center justify-between text-xs text-yellow-300 mb-1">
            <span className="font-black text-white group-hover:text-yellow-300">📠 56K DIALUP SCREECH</span>
            <span className="text-[10px] bg-black px-1.5 py-0.5 text-yellow-400">RETRO TERROR</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            নব্বই দশকের ডায়াল-আপ ইন্টারনেটের কানে তালা দেওয়া আসল কর্কশ আওয়াজ।
          </p>
        </button>
      </div>

      {/* Active notification indicator */}
      {activeSound && (
        <div className="text-center text-xs text-yellow-300 font-bold bg-red-950/80 border border-red-600 py-1.5 animate-pulse">
          🔊 Now Synthesizing: {activeSound} in High-Resolution 24-bit Web Audio Pipeline!
        </div>
      )}
    </div>
  );
};
