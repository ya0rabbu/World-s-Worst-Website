import React, { useState, useEffect } from 'react';
import { Eye, Coffee, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface InactivityModalProps {
  isOpen: boolean;
  onConfirmActive: () => void;
}

export const InactivityModal: React.FC<InactivityModalProps> = ({ isOpen, onConfirmActive }) => {
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const dodgeBtn = () => {
    playSound('beep');
    setBtnOffset({
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 80,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="bg-yellow-300 border-4 border-black p-5 max-w-sm w-full shadow-[8px_8px_0px_#000] text-center font-['Comic_Neue',cursive]">
        <Eye className="w-12 h-12 mx-auto text-purple-900 animate-spin mb-2" />
        <h3 className="font-['Press_Start_2P',monospace] text-xs text-red-700 mb-2">
          ARE YOU SLEEPING?
        </h3>
        <p className="text-xs font-bold text-gray-900 mb-4">
          You haven&apos;t clicked anything in 12 seconds. To prevent your soul from leaving your physical body, please verify consciousness.
        </p>

        <div className="relative min-h-[80px] flex items-center justify-center">
          <button
            onMouseEnter={dodgeBtn}
            onClick={() => {
              playSound('win');
              onConfirmActive();
            }}
            style={{
              transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
              transition: 'transform 0.12s ease-out',
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2 text-xs border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            I AM AWAKE AND SUFFERING
          </button>
        </div>
      </div>
    </div>
  );
};
