import React, { useState } from 'react';
import { X, Download, ShieldAlert, Smartphone, Heart, Sparkles, Check } from 'lucide-react';
import { playSound } from '../utils/audioSynth';
import { PopupAd } from '../types';

interface PopUpSwarmProps {
  popups: PopupAd[];
  onClosePopup: (id: string, spawned: boolean) => void;
  onClearAll: () => void;
}

export const PopUpSwarm: React.FC<PopUpSwarmProps> = ({ popups, onClosePopup, onClearAll }) => {
  const [ramProgress, setRamProgress] = useState(12);
  const [ramDownloading, setRamDownloading] = useState(false);

  const startRamDownload = () => {
    playSound('coin');
    setRamDownloading(true);
    let p = 12;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 8) + 1;
      if (p >= 99) {
        p = 99; // Classic meme: stuck at 99%!
        clearInterval(interval);
        playSound('error');
      }
      setRamProgress(p);
    }, 150);
  };

  return (
    <>
      {popups.map((popup) => (
        <div
          key={popup.id}
          style={{
            top: `${popup.top}px`,
            left: `${popup.left}px`,
            zIndex: popup.zIndex,
          }}
          className="fixed w-72 md:w-80 bg-cyan-100 border-4 border-black shadow-[8px_8px_0px_#000] font-['Comic_Neue',cursive] animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Windows 95 Style Window Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white px-2 py-1 flex items-center justify-between font-mono text-xs font-bold select-none cursor-move">
            <span className="truncate pr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              {popup.title}
            </span>
            <button
              onClick={() => {
                // 70% chance clicking the fake X actually spawns another or triggers a beep!
                playSound('glitch');
                onClosePopup(popup.id, true);
              }}
              className="bg-gray-300 hover:bg-red-600 hover:text-white text-black font-mono px-1.5 py-0.5 border border-black text-[10px] shadow-[1px_1px_0px_#fff] cursor-pointer"
              title="Close window (Or will it?)"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Ad Content */}
          <div className="p-3 text-black">
            {popup.type === 'iphone' && (
              <div className="text-center space-y-2">
                <div className="bg-yellow-300 border-2 border-black p-2 font-black text-xs text-red-600 animate-pulse">
                  🎉 CONGRATULATIONS USER! 🎉
                </div>
                <Smartphone className="w-12 h-12 mx-auto text-purple-700 animate-bounce" />
                <p className="text-xs font-bold">
                  You have been chosen to receive a 100% genuine Nokia 3310 Titanium Edition!
                </p>
                <button
                  onClick={() => {
                    playSound('win');
                    alert('Nokia 3310 has been dispatched via carrier pigeon to your roof.');
                    onClosePopup(popup.id, false);
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  CLAIM NOW FREE!
                </button>
              </div>
            )}

            {popup.type === 'ram' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <Download className="w-4 h-4 text-blue-600" />
                  DOWNLOAD 128MB FREE CLOUD RAM
                </div>
                <p className="text-[11px] text-gray-700">
                  Speed up your Pentium II processor instantly via broadband satellite.
                </p>
                
                <div className="w-full bg-gray-200 h-4 border border-black p-0.5">
                  <div
                    className="bg-blue-600 h-full transition-all duration-100"
                    style={{ width: `${ramProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span>Progress: {ramProgress}%</span>
                  {ramProgress === 99 && <span className="text-red-600 font-bold">STUCK AT 99% (FOREVER)</span>}
                </div>

                <button
                  onClick={startRamDownload}
                  disabled={ramDownloading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-1 text-xs border border-black cursor-pointer"
                >
                  {ramDownloading ? 'INJECTING ELECTRONS...' : 'START RAM DOWNLOAD'}
                </button>
              </div>
            )}

            {popup.type === 'singles' && (
              <div className="text-center space-y-2">
                <div className="bg-pink-300 border border-black p-1 text-[11px] font-bold text-pink-900 flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                  SINGLE ALGORITHMS IN YOUR LOCALHOST
                </div>
                <p className="text-xs font-bold text-purple-900">
                  Bubble Sort (Age 52) wants to meet quick sort in your container!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playSound('error');
                      onClosePopup(popup.id, false);
                    }}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-1 text-xs border border-black cursor-pointer"
                  >
                    Wink Back 😉
                  </button>
                  <button
                    onClick={() => {
                      playSound('honk');
                      onClosePopup(popup.id, true);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 text-xs border border-black cursor-pointer"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            )}

            {popup.type === 'antivirus' && (
              <div className="space-y-2">
                <div className="bg-red-600 text-white p-1 text-[11px] font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-yellow-300 animate-spin" />
                  CRITICAL THREAT: 9,000 BUGS FOUND!
                </div>
                <p className="text-[11px] font-bold text-gray-800">
                  Your CPU temperature has reached room temperature! Clean immediately.
                </p>
                <button
                  onClick={() => {
                    playSound('beep');
                    alert('Antivirus cleaned 0 bugs and created 4 new bugs.');
                    onClosePopup(popup.id, false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-yellow-300 font-bold py-1 text-xs border border-black cursor-pointer"
                >
                  CLEAN WITH WATER
                </button>
              </div>
            )}

            {popup.type === 'crypto' && (
              <div className="space-y-2 text-center">
                <div className="bg-yellow-400 text-black font-bold p-1 text-xs border border-black">
                  💰 MAKE $5,000,000 FROM HOME 💰
                </div>
                <p className="text-xs font-bold text-gray-900">
                  Trade dial-up coin on the 1997 stock exchange with zero effort!
                </p>
                <button
                  onClick={() => {
                    playSound('coin');
                    onClosePopup(popup.id, false);
                  }}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-1 text-xs border border-black cursor-pointer"
                >
                  INVEST MY ENTIRE SALARY
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Emergency Panic button when multiple popups are open */}
      {popups.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              playSound('win');
              onClearAll();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-black px-3 py-2 border-3 border-black shadow-[4px_4px_0px_#fff] cursor-pointer flex items-center gap-2 animate-bounce"
          >
            <ShieldAlert className="w-4 h-4 text-yellow-300" />
            PANIC: CLOSE ALL {popups.length} ADS!
          </button>
        </div>
      )}
    </>
  );
};
