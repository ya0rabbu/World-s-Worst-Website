import React, { useState, useEffect } from 'react';
import { BatteryWarning, Zap, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface LowBatteryModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const LowBatteryModal: React.FC<LowBatteryModalProps> = ({ isOpen, onDismiss }) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (!isOpen) return;
    playSound('siren');
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          playSound('honk');
          return 15; // Loop the agony
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-red-600 border-8 border-yellow-400 p-6 max-w-sm w-full shadow-[12px_12px_0px_#000] text-white font-['Comic_Neue',cursive] text-center animate-pulse">
        <BatteryWarning className="w-16 h-16 text-yellow-300 mx-auto animate-bounce mb-2" />
        
        <h2 className="font-['Press_Start_2P',monospace] text-base text-yellow-300 mb-2">
          1% BATTERY REMAINING!
        </h2>

        <p className="text-sm font-bold text-white mb-3">
          CRITICAL SYSTEM IMPLOSION IN:
        </p>

        <div className="text-4xl font-black font-mono text-yellow-300 bg-black py-2 px-4 border-2 border-white inline-block mb-4">
          00:{countdown.toString().padStart(2, '0')}
        </div>

        <p className="text-xs text-yellow-100 mb-4">
          Warning: If your battery reaches 0%, our web server will delete your browser history and inform your grandma.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => {
              playSound('coin');
              alert('Successfully charged +0.0001% using psychic energy from the monitor!');
              onDismiss();
            }}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-2 px-4 text-xs border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-1"
          >
            <Zap className="w-4 h-4 text-red-600" />
            PLUG IN POTATO CHARGER
          </button>

          <button
            onClick={() => {
              playSound('glitch');
              onDismiss();
            }}
            className="text-[11px] text-yellow-200 underline font-mono cursor-pointer block mx-auto"
          >
            [Ignore and risk immediate doom]
          </button>
        </div>
      </div>
    </div>
  );
};
