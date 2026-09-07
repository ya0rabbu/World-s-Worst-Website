import React, { useState } from 'react';
import { AlertTriangle, Globe, Volume2, ShieldAlert, X, ArrowRight, Skull, ThumbsDown } from 'lucide-react';
import { playSound, playHorrorSound } from '../utils/audioSynth';

interface BanglaEnglishWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => void;
}

export const BanglaEnglishWarningModal: React.FC<BanglaEnglishWarningModalProps> = ({
  isOpen,
  onClose,
  onLeave,
}) => {
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  if (!isOpen) return null;

  return (
    <div
      id="bangla-english-warning-overlay"
      className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        id="bangla-english-warning-card"
        className="relative w-full max-w-2xl bg-[#0a000f] border-4 border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.8),12px_12px_0px_#000] text-gray-100 font-sans p-4 sm:p-7 space-y-5 rounded-none"
      >
        {/* Flashing Warning Header Tape */}
        <div className="bg-red-600 text-yellow-300 font-black font-mono text-xs sm:text-sm px-3 py-1.5 flex items-center justify-between border-2 border-black tracking-wider uppercase select-none">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>CRITICAL WARNING &bull; চরম সতর্কবার্তা</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Skull className="w-4 h-4 text-white" />
            <span className="text-[11px] bg-black text-white px-2 py-0.5">MOST WORST WEBSITE</span>
          </div>
        </div>

        {/* Language Switcher Toggle */}
        <div className="flex items-center justify-between bg-purple-950/80 border-2 border-purple-500 p-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-purple-200">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">LANGUAGE / ভাষা নির্বাচন:</span>
          </div>

          <div className="flex items-center gap-1 bg-black p-1 border border-purple-400">
            <button
              id="btn-lang-bangla"
              onClick={() => {
                playSound('beep');
                setLanguage('bn');
              }}
              className={`px-3 py-1 font-bold text-xs transition-all cursor-pointer ${
                language === 'bn'
                  ? 'bg-red-600 text-yellow-300 shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              🇧🇩 বাংলা
            </button>
            <button
              id="btn-lang-english"
              onClick={() => {
                playSound('beep');
                setLanguage('en');
              }}
              className={`px-3 py-1 font-bold text-xs transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-red-600 text-yellow-300 shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Dynamic Warning Message */}
        <div className="bg-black/90 border-2 border-red-500/60 p-4 sm:p-5 space-y-4">
          {language === 'bn' ? (
            <div className="space-y-3 font-sans">
              <div className="flex items-start gap-2.5 text-red-400">
                <ShieldAlert className="w-6 h-6 flex-shrink-0 text-red-500 mt-1" />
                <h2 className="text-lg sm:text-xl font-black text-red-500 tracking-wide">
                  এখানে আপনারা যেই ওয়েবসাইট দেখছেন এটা একটা Most Worst Website!
                </h2>
              </div>

              <div className="text-sm sm:text-base leading-relaxed text-yellow-100/90 font-medium bg-red-950/30 p-3.5 border-l-4 border-red-500">
                <p>
                  এখানে আপনারা যাওয়ার আগে বলে নেই এটা একটা <strong>ফালতু ওয়েবসাইট</strong> যা সবার দেখার দরকার নাই। যারা ভয় পান তারপর <strong>ফালতু UI দেখতে পছন্দ করেন না</strong> তারা এখানে ঢুকবেন না।
                </p>
                <p className="mt-2.5">
                  এখানে এই full website টা enjoy করলে বুঝবেন <strong>এখানে কি নেই—এখানে সব কিছু আছে!</strong> আপনারা যা চান তা চাইলেই এখানে <strong>request করতে পারবেন</strong> আর দেখে জানান এবং <strong>মতামত প্রকাশ করুন</strong>।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-red-300 font-mono">
                <span className="bg-red-900/60 border border-red-600 px-2 py-0.5">⚠️ হার্ট দুর্বল হলে দূরে থাকুন</span>
                <span className="bg-yellow-900/60 border border-yellow-600 px-2 py-0.5 text-yellow-300">🔊 24-bit হরর সাউন্ড অন্তর্ভুক্ত</span>
                <span className="bg-purple-900/60 border border-purple-600 px-2 py-0.5 text-purple-300">👾 3,000 ক্যানভাস থটস</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-sans">
              <div className="flex items-start gap-2.5 text-red-400">
                <ShieldAlert className="w-6 h-6 flex-shrink-0 text-red-500 mt-1" />
                <h2 className="text-lg sm:text-xl font-black text-red-500 tracking-wide">
                  What you are seeing here is one of the Most Worst Websites in existence!
                </h2>
              </div>

              <div className="text-sm sm:text-base leading-relaxed text-yellow-100/90 font-medium bg-red-950/30 p-3.5 border-l-4 border-red-500">
                <p>
                  Before you proceed, let us warn you: this is a completely <strong>hostile and absurd website</strong> that not everyone needs to see! If you get scared easily or <strong>despise atrocious and confusing UI</strong>, please do not enter.
                </p>
                <p className="mt-2.5">
                  If you endure and explore this full website, you will realize <strong>what isn't here—everything is here!</strong> You can easily <strong>request whatever features or agony you want</strong> right here, test everything out, and <strong>share your feedback and reviews</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-red-300 font-mono">
                <span className="bg-red-900/60 border border-red-600 px-2 py-0.5">⚠️ Severe UX Agony</span>
                <span className="bg-yellow-900/60 border border-yellow-600 px-2 py-0.5 text-yellow-300">🔊 24-Bit Horror Audio</span>
                <span className="bg-purple-900/60 border border-purple-600 px-2 py-0.5 text-purple-300">👾 Swarming PixiJS Triad</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick 24-bit Horror Sound Sampler in Warning */}
        <div className="bg-purple-950/40 border border-purple-600/60 p-2.5 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-purple-300">
            <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>24-bit Horror Preview:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => playHorrorSound('heartbeat')}
              className="px-2 py-1 bg-black hover:bg-red-950 text-red-400 border border-red-600 text-[11px] cursor-pointer"
            >
              💓 Heartbeat
            </button>
            <button
              onClick={() => playHorrorSound('drone')}
              className="px-2 py-1 bg-black hover:bg-purple-950 text-purple-300 border border-purple-500 text-[11px] cursor-pointer"
            >
              👻 Dark Drone
            </button>
          </div>
        </div>

        {/* Action Buttons: Continue vs ফালতু বাদ দেই */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 font-mono">
          {/* Dismiss / Leave Button (ফালতু বাদ দেই) */}
          <button
            id="btn-warning-leave"
            onClick={() => {
              playSound('honk');
              onLeave();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 border-2 border-gray-600 font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-[3px_3px_0px_#000]"
          >
            <ThumbsDown className="w-4 h-4 text-red-400" />
            <span>{language === 'bn' ? 'ফালতু বাদ দেই (বেরিয়ে যান)' : 'Skip / Leave This Rubbish'}</span>
          </button>

          {/* Continue Button */}
          <button
            id="btn-warning-continue"
            onClick={() => {
              playSound('win');
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-black border-2 border-black font-black text-xs sm:text-sm uppercase cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-[4px_4px_0px_#000]"
          >
            <span>{language === 'bn' ? 'Continue (সাইটে প্রবেশ করুন)' : 'Continue (Enter at Your Own Risk)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
