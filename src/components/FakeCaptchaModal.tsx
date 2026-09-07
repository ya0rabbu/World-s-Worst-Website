import React, { useState } from 'react';
import { playSound } from '../utils/audioSynth';
import { ShieldAlert, RefreshCw, CheckCircle2, Skull } from 'lucide-react';

interface FakeCaptchaModalProps {
  isOpen: boolean;
  onVerify: () => void;
  onClose: () => void;
}

export const FakeCaptchaModal: React.FC<FakeCaptchaModalProps> = ({ isOpen, onVerify, onClose }) => {
  const [checkboxPos, setCheckboxPos] = useState({ x: 0, y: 0 });
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const squares = [
    { id: 1, text: 'A lonely potato in cold space' },
    { id: 2, text: 'Unread email from 2014' },
    { id: 3, text: 'Windows Vista updating at 3 AM' },
    { id: 4, text: 'A traffic light on Mars' },
    { id: 5, text: 'Your unfinished homework' },
    { id: 6, text: 'Cold soggy french fry' },
  ];

  const dodgeCheckbox = () => {
    playSound('beep');
    const x = (Math.random() - 0.5) * 240;
    const y = (Math.random() - 0.5) * 120;
    setCheckboxPos({ x, y });
  };

  const toggleSquare = (id: number) => {
    playSound('coin');
    setSelectedSquares((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleVerifySquares = () => {
    playSound('error');
    setAttempts((a) => a + 1);
    alert('CAPTCHA REJECTED: You selected too much existential sorrow. Please consult a philosopher and try again.');
    setSelectedSquares([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-amber-100 border-4 border-black p-5 max-w-md w-full shadow-[8px_8px_0px_#ff0055] font-['Comic_Neue',cursive]">
        {/* Header */}
        <div className="bg-blue-800 text-white p-2 border-2 border-black flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-300 animate-bounce" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs">
              MANDATORY AGONY CAPTCHA
            </h3>
          </div>
          <span className="text-[10px] bg-red-600 px-1 font-mono">v9.99</span>
        </div>

        <p className="text-xs font-bold text-gray-900 mb-2">
          Select all squares that contain <strong>GENUINE SPIRITUAL DEFEAT</strong>:
        </p>

        {/* 6 Grid Squares */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {squares.map((sq) => {
            const isSelected = selectedSquares.includes(sq.id);
            return (
              <button
                key={sq.id}
                type="button"
                onClick={() => toggleSquare(sq.id)}
                className={`p-2 border-2 border-black text-[11px] font-bold h-20 flex items-center justify-center text-center cursor-pointer transition-colors ${
                  isSelected ? 'bg-red-500 text-white shadow-inner' : 'bg-white hover:bg-yellow-200 text-black'
                }`}
              >
                {sq.text}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center mb-3">
          <button
            type="button"
            onClick={() => {
              playSound('glitch');
              setSelectedSquares([]);
            }}
            className="text-[11px] font-mono text-blue-700 underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Get New Impossible Images
          </button>
          <button
            type="button"
            onClick={handleVerifySquares}
            className="bg-green-600 hover:bg-green-700 text-white font-black px-4 py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            VERIFY (WILL FAIL)
          </button>
        </div>

        {/* The Running "I am not a robot" Checkbox Playground */}
        <div className="border-2 border-dashed border-red-500 bg-yellow-200 p-3 relative overflow-hidden min-h-[90px] flex flex-col items-center justify-center mb-3">
          <div className="text-[10px] font-mono font-bold text-gray-700 mb-1">
            OR: Click the peaceful checkbox to bypass:
          </div>

          <div
            onMouseEnter={dodgeCheckbox}
            onClick={dodgeCheckbox}
            style={{
              transform: `translate(${checkboxPos.x}px, ${checkboxPos.y}px)`,
              transition: 'transform 0.12s ease-out',
            }}
            className="bg-white border-2 border-black p-2 flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000] select-none"
          >
            <input type="checkbox" readOnly checked={false} className="w-4 h-4 accent-red-600" />
            <span className="text-xs font-bold text-black font-mono">I am definitely not a toaster</span>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              playSound('win');
              onVerify();
            }}
            className="text-[11px] text-gray-700 hover:text-black font-mono underline cursor-pointer"
          >
            [Mercy Skip: I admit this website broke my spirit]
          </button>
        </div>
      </div>
    </div>
  );
};
