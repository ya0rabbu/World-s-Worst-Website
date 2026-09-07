import React, { useState } from 'react';
import { Cookie, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface CookieNightmareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRejectEscape: () => void;
}

export const CookieNightmareModal: React.FC<CookieNightmareModalProps> = ({
  isOpen,
  onClose,
  onRejectEscape,
}) => {
  const [rejectPos, setRejectPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showManage, setShowManage] = useState(false);
  const [acceptedToast, setAcceptedToast] = useState(false);

  if (!isOpen) return null;

  const dodgeReject = () => {
    playSound('beep');
    const randomX = (Math.random() - 0.5) * 320;
    const randomY = (Math.random() - 0.5) * 160;
    setRejectPos({ x: randomX, y: randomY });
    onRejectEscape();
  };

  const handleAccept = () => {
    playSound('win');
    setAcceptedToast(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-yellow-200 border-4 border-black p-5 max-w-lg w-full shadow-[10px_10px_0px_#000] relative font-['Comic_Neue',cursive]">
        {/* Header */}
        <div className="bg-red-600 text-white p-2 border-2 border-black flex items-center gap-2 mb-3">
          <Cookie className="w-6 h-6 animate-spin text-yellow-300 shrink-0" />
          <h3 className="font-['Press_Start_2P',monospace] text-xs font-bold leading-tight">
            COOKIE INVASION NOTICE (MANDATORY)
          </h3>
        </div>

        {acceptedToast ? (
          <div className="bg-green-300 border-2 border-black p-4 text-center my-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-green-800 mx-auto mb-2" />
            <p className="font-bold text-lg text-green-900">
              CONGRATULATIONS!
            </p>
            <p className="text-xs text-green-800">
              You accepted 4,921 tracking cookies and transferred ownership of your left sock to us.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-bold text-black mb-3 leading-relaxed">
              We value your privacy so much that we want to track literally everything you do. By staying on this page, you agree that we may install cookies in your oven, spy on your browser history, and send your contact details to an overseas telemarketer named Steve.
            </p>

            {showManage ? (
              <div className="bg-white border-2 border-black p-2 max-h-40 overflow-y-scroll text-xs mb-3 space-y-1.5 font-mono">
                <div className="font-bold text-red-600 border-b pb-1">Essential Privacy Sacrifices:</div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked disabled className="accent-red-600" />
                  <span>Mandatory: Steal computer heat for crypto</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked disabled className="accent-red-600" />
                  <span>Mandatory: Ring your doorbell at 3:00 AM</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked disabled className="accent-red-600" />
                  <span>Mandatory: Forward browser history to your boss</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked disabled className="accent-red-600" />
                  <span>Mandatory: Send psychic thoughts to the cloud</span>
                </label>
              </div>
            ) : null}

            {/* The Running Button Playground */}
            <div className="relative min-h-[90px] border-2 border-dashed border-red-500 bg-amber-100 p-2 flex flex-wrap items-center justify-around gap-2 overflow-hidden mb-3">
              <button
                onClick={handleAccept}
                className="bg-green-500 hover:bg-green-600 text-white font-black px-4 py-2 text-sm border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                ACCEPT EVERYTHING FOREVER
              </button>

              <button
                onClick={() => setShowManage(!showManage)}
                className="bg-cyan-300 hover:bg-cyan-400 text-black font-bold px-3 py-1.5 text-xs border border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                {showManage ? 'Hide Agony' : 'Manage 9,999 Cookies'}
              </button>

              {/* The Slippery Reject Button */}
              <button
                onMouseEnter={dodgeReject}
                onClick={dodgeReject}
                style={{
                  transform: `translate(${rejectPos.x}px, ${rejectPos.y}px)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1.5 text-xs border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                Reject All (Try Me!)
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  playSound('glitch');
                  onClose();
                }}
                className="text-[10px] text-gray-700 underline hover:text-black cursor-pointer font-mono"
              >
                [×] I surrender, let me experience the terrible website anyway
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
