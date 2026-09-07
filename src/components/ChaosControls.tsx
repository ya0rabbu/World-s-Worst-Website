import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, Sparkles, Star, RotateCcw, Zap, Shuffle } from 'lucide-react';
import { playSound, setVolume, toggleBackgroundMusic } from '../utils/audioSynth';

interface ChaosControlsProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isTilted: boolean;
  onToggleTilt: () => void;
  sparklesActive: boolean;
  onToggleSparkles: () => void;
  onRateAction: () => void;
  chaosMode: boolean;
  onToggleChaosMode: () => void;
}

export const ChaosControls: React.FC<ChaosControlsProps> = ({
  currentTheme,
  onThemeChange,
  isTilted,
  onToggleTilt,
  sparklesActive,
  onToggleSparkles,
  onRateAction,
  chaosMode,
  onToggleChaosMode,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [fakeVolume, setFakeVolume] = useState(80);
  const [starRatingMessage, setStarRatingMessage] = useState('');
  const [starDodgeOffset, setStarDodgeOffset] = useState({ x: 0, y: 0 });

  const handleToggleMusic = () => {
    const nextState = toggleBackgroundMusic((playing) => {
      setIsPlayingMusic(playing);
    });
    if (nextState) {
      playSound('coin');
    }
  };

  const handleVolumeSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFakeVolume(val);
    // Reverse/chaotic volume: 0% slider sets volume to max!
    if (val <= 10) {
      playSound('honk');
      setVolume(1.0);
      alert('SAFETY DIRECTIVE: Audio muted? We detected silent sadness and raised volume to 100%!');
      setFakeVolume(100);
    } else {
      setVolume(val / 100);
    }
  };

  const dodgeBadStars = () => {
    playSound('beep');
    setStarDodgeOffset({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 30,
    });
  };

  const handleRate5Stars = () => {
    playSound('win');
    setStarRatingMessage('★ 5 Stars Received! Automatically routed into our /dev/null shredder.');
    onRateAction();
  };

  return (
    <section className="bg-orange-200 border-4 border-black p-4 shadow-[6px_6px_0px_#000] my-6 font-['Comic_Neue',cursive]">
      <div className="bg-blue-800 text-yellow-300 p-2 border-2 border-black mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-['Press_Start_2P',monospace] text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          CHAOS EXPERIMENTATION LAB
        </h3>
        <button
          onClick={onToggleChaosMode}
          className={`px-3 py-1 font-mono text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5 transition-colors ${
            chaosMode
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-gray-300 text-gray-800'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>CHAOS MODE (30% INVERSION): {chaosMode ? 'ENABLED [CURSED]' : 'OFF'}</span>
        </button>
      </div>

      {chaosMode && (
        <div className="bg-red-600 text-white p-2 border-2 border-black mb-3 font-mono text-xs flex items-center justify-between animate-bounce">
          <span className="font-bold">
            ⚠️ ACTIVE: Every button click has a 30% chance to trigger the exact opposite outcome!
          </span>
          <span className="text-[10px] bg-yellow-300 text-black px-1.5 py-0.5 font-black">
            30% COIN FLIP
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Broken Audio Player */}
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900 uppercase">
              1. 8-Bit MIDI Engine:
            </span>
            <button
              onClick={handleToggleMusic}
              className={`px-2 py-1 text-xs font-bold font-mono border border-black cursor-pointer flex items-center gap-1 ${
                isPlayingMusic ? 'bg-green-400 text-black' : 'bg-red-400 text-white'
              }`}
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {isPlayingMusic ? 'PLAYING 8-BIT' : 'START MUSIC'}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span>Volume: {fakeVolume}%</span>
              <span className="text-red-600 font-bold">(Inverted Physics)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fakeVolume}
              onChange={handleVolumeSlide}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[10px] text-gray-500 italic">
              Slide to 0% at your own risk.
            </p>
          </div>
        </div>

        {/* 2. Visual Distortion Controls */}
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="text-xs font-bold text-purple-900 uppercase mb-2">
            2. Visual Assault Modes:
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => onThemeChange('toxic')}
              className={`px-2 py-1 text-xs font-bold border border-black cursor-pointer ${
                currentTheme === 'toxic' ? 'bg-lime-400 ring-2 ring-black' : 'bg-gray-100'
              }`}
            >
              Toxic Lime
            </button>
            <button
              onClick={() => onThemeChange('geocities')}
              className={`px-2 py-1 text-xs font-bold border border-black cursor-pointer ${
                currentTheme === 'geocities' ? 'bg-fuchsia-400 ring-2 ring-black' : 'bg-gray-100'
              }`}
            >
              Geocities &apos;96
            </button>
            <button
              onClick={() => onThemeChange('stealth')}
              className={`px-2 py-1 text-xs font-bold border border-black cursor-pointer ${
                currentTheme === 'stealth' ? 'bg-yellow-200 ring-2 ring-black' : 'bg-gray-100'
              }`}
            >
              Stealth White
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-gray-300">
            <button
              onClick={onToggleTilt}
              className="bg-yellow-300 hover:bg-yellow-400 text-black px-2 py-1 text-xs font-bold border border-black cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {isTilted ? 'Untilt 3°' : 'Tilt Screen 3°'}
            </button>

            <button
              onClick={onToggleSparkles}
              className="bg-pink-300 hover:bg-pink-400 text-black px-2 py-1 text-xs font-bold border border-black cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {sparklesActive ? 'Stop Cursor Trail' : 'Sparkle Trail'}
            </button>
          </div>
        </div>

        {/* 3. Rating Widget with dodging low stars */}
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="text-xs font-bold text-purple-900 uppercase mb-1">
            3. Rate This Masterpiece:
          </div>
          <p className="text-[11px] text-gray-700 mb-2">
            Leave honest feedback below:
          </p>

          <div className="flex items-center gap-2 mb-2 relative">
            {/* Dodging 1-4 stars */}
            <div
              onMouseEnter={dodgeBadStars}
              style={{
                transform: `translate(${starDodgeOffset.x}px, ${starDodgeOffset.y}px)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="flex gap-1 cursor-not-allowed opacity-75"
              title="1-4 stars rejected by server"
            >
              {[1, 2, 3, 4].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={dodgeBadStars}
                  className="text-gray-400 hover:text-red-500 cursor-not-allowed"
                >
                  <Star className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* 5 Stars Button (the only reachable one) */}
            <button
              type="button"
              onClick={handleRate5Stars}
              className="text-yellow-500 hover:scale-125 transition-transform cursor-pointer"
              title="5 Stars (Only accepted review)"
            >
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-600" />
            </button>
          </div>

          {starRatingMessage ? (
            <div className="text-[10px] text-green-700 font-bold bg-green-50 p-1 border border-green-300 animate-in fade-in">
              {starRatingMessage}
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 italic">
              Notice: Negative ratings physically evade your cursor.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
