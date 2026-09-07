import React from 'react';
import { Award, CheckCircle2, Flame, Share2, Sparkles, Printer } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface GuinnessCertificateProps {
  recipientName: string;
  frustrationScore: number;
  timeSpentSeconds: number;
  onClose: () => void;
}

export const GuinnessCertificate: React.FC<GuinnessCertificateProps> = ({
  recipientName,
  frustrationScore,
  timeSpentSeconds,
  onClose,
}) => {
  const handlePrint = () => {
    playSound('win');
    alert('Certificate successfully saved into your mental trauma archives!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-amber-50 border-8 border-yellow-600 p-6 max-w-xl w-full shadow-[12px_12px_0px_#000] relative font-serif text-center">
        {/* Certificate Header Banner */}
        <div className="border-4 border-double border-yellow-700 p-4 relative">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center shadow-md">
            <Award className="w-8 h-8 text-red-600 animate-spin" />
          </div>

          <p className="font-mono text-xs text-yellow-800 tracking-widest uppercase font-bold mt-3">
            ★ OFFICIAL DIPLOMA OF PAIN ★
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-red-700 tracking-tight font-['Press_Start_2P',monospace] my-2">
            GUINNESS WORLD RECORD
          </h2>
          <p className="text-xs text-gray-700 font-bold uppercase tracking-widest border-b-2 border-yellow-600 pb-2">
            CERTIFICATE OF ENDURANCE & SURVIVAL
          </p>

          <p className="text-sm italic text-gray-800 my-3">
            This solemnly certifies that the valiant internet user known as:
          </p>

          <div className="text-xl md:text-2xl font-black font-['Comic_Neue',cursive] text-purple-900 bg-yellow-200 border-2 border-black py-1 px-4 inline-block mx-auto shadow-[3px_3px_0px_#000]">
            {recipientName || 'ANONYMOUS INTERNET VICTIM'}
          </div>

          <p className="text-xs md:text-sm text-gray-800 mt-3 max-w-md mx-auto leading-relaxed">
            has willingly subjected themselves to the catastrophic layout, hostile sliders, impossible password logic, and unyielding popups of the <strong className="text-red-600">World&apos;s Worst Website</strong>, achieving a peak agony score of:
          </p>

          <div className="my-3 flex justify-center gap-4 text-xs font-mono font-bold">
            <div className="bg-red-100 border border-red-500 px-3 py-1 text-red-700">
              Frustration: {Math.floor(frustrationScore)}%
            </div>
            <div className="bg-blue-100 border border-blue-500 px-3 py-1 text-blue-700">
              Survived: {timeSpentSeconds} seconds
            </div>
          </div>

          {/* Official Creator & Architect Credits */}
          <div className="my-3 py-2 px-3 bg-amber-100/80 border-2 border-yellow-700/80 rounded shadow-inner text-center font-mono">
            <div className="flex items-center justify-center gap-1.5 text-xs text-yellow-900 font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-pulse" />
              <span>OFFICIAL ARCHITECT &amp; MASTER CREDENTIALS</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-pulse" />
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-xs font-serif font-bold text-gray-900">
              <span className="bg-yellow-300/80 px-2.5 py-0.5 border border-yellow-700 rounded shadow-xs">
                🎨 Design by <span className="text-red-900 font-black underline">Yasir Abed Rabbu</span>
              </span>
              <span className="bg-yellow-300/80 px-2.5 py-0.5 border border-yellow-700 rounded shadow-xs">
                💻 Developed by <span className="text-purple-900 font-black underline">Yasir Abed Rabbu</span>
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t-2 border-dashed border-yellow-700 text-xs text-gray-800">
            <div>
              <div className="font-['Comic_Neue',cursive] font-black text-base text-blue-900 italic underline tracking-wide">
                Yasir Abed Rabbu
              </div>
              <div className="text-[10px] uppercase font-mono font-bold text-yellow-900">
                Design by Yasir Abed Rabbu
              </div>
              <div className="text-[9px] text-gray-600 font-mono">Executive UI / UX Director</div>
            </div>
            <div>
              <div className="font-['Comic_Neue',cursive] font-black text-base text-purple-900 italic underline tracking-wide">
                Yasir
              </div>
              <div className="text-[10px] uppercase font-mono font-bold text-yellow-900">
                Developed by Yasir
              </div>
              <div className="text-[9px] text-gray-600 font-mono">Lead Core Systems Architect</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center font-['Comic_Neue',cursive]">
          <button
            onClick={handlePrint}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Save to Trauma Memories
          </button>
          <button
            onClick={() => {
              playSound('honk');
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            Back to Agony
          </button>
        </div>
      </div>
    </div>
  );
};
