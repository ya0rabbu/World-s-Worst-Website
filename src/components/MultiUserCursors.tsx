import React, { useEffect, useState } from 'react';
import { MousePointer2, Users, ExternalLink, Smile } from 'lucide-react';
import { presenceManager, RemoteUser, PresenceState } from '../utils/presenceClient';
import { playSound } from '../utils/audioSynth';

export const MultiUserCursors: React.FC = () => {
  const [presence, setPresence] = useState<PresenceState>(presenceManager.getState());
  const [showEmojiBar, setShowEmojiBar] = useState<boolean>(false);
  const [localBlast, setLocalBlast] = useState<{ x: number; y: number; emoji: string } | null>(null);

  useEffect(() => {
    const unsubscribe = presenceManager.subscribe((newState) => {
      setPresence(newState);
    });
    return () => unsubscribe();
  }, []);

  const remoteUsersList = Array.from(presence.remoteUsers.values());

  const handleEmojiBlast = (emoji: string) => {
    playSound('beep');
    presenceManager.blastEmoji(emoji);
    setLocalBlast({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      emoji,
    });
    setTimeout(() => setLocalBlast(null), 1500);
  };

  const handleOpenSecondTab = () => {
    playSound('coin');
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Real Live Remote Users' Cursors (Only renders when real users are connected) */}
      {remoteUsersList.map((user) => {
        const posX = user.xRatio * (typeof window !== 'undefined' ? window.innerWidth : 1000);
        const posY = user.yRatio * (typeof window !== 'undefined' ? window.innerHeight : 800);

        return (
          <div
            key={user.id}
            className="absolute transition-all duration-75 ease-out flex flex-col items-start select-none"
            style={{
              left: `${posX}px`,
              top: `${posY}px`,
              transform: 'translate(-2px, -2px)',
            }}
          >
            {/* Cursor SVG with User's Color */}
            <div className="relative">
              <MousePointer2
                className={`w-6 h-6 drop-shadow-md transition-transform ${
                  user.clicking ? 'scale-75 translate-x-0.5 translate-y-0.5' : 'scale-100'
                }`}
                style={{
                  color: user.color,
                  fill: user.color,
                }}
              />

              {/* Click Ripple Indicator */}
              {user.clicking && (
                <span
                  className="absolute -top-1 -left-1 w-8 h-8 rounded-full border-2 animate-ping pointer-events-none"
                  style={{ borderColor: user.color }}
                />
              )}
            </div>

            {/* Remote User Label Pill */}
            <div
              className="mt-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-tight text-black shadow-lg flex items-center gap-1.5 whitespace-nowrap"
              style={{
                backgroundColor: user.color,
              }}
            >
              <span>{user.flag || '🇧🇩'}</span>
              <span>{user.name}</span>
              {user.page && user.page !== 'home' && (
                <span className="text-[9px] bg-black/20 px-1 rounded uppercase">
                  {user.page}
                </span>
              )}
            </div>

            {/* Floating Emoji Reaction from this user */}
            {user.emoji && (
              <div className="mt-1 text-2xl animate-bounce drop-shadow-lg">
                {user.emoji}
              </div>
            )}
          </div>
        );
      })}

      {/* Local Emoji Blast Animation */}
      {localBlast && (
        <div
          className="absolute text-4xl animate-bounce pointer-events-none select-none z-50 drop-shadow-xl"
          style={{
            left: `${localBlast.x}px`,
            top: `${localBlast.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {localBlast.emoji}
        </div>
      )}

      {/* Floating Real-Time Presence Indicator & Tab Tester (Bottom-right corner) */}
      <div className="fixed bottom-14 right-3 sm:bottom-4 sm:right-4 pointer-events-auto flex flex-col items-end gap-1.5 z-40">
        {/* Floating Emoji Bar Toggle */}
        <div className="flex items-center gap-1 bg-black/90 border border-yellow-400/80 p-1 rounded-full shadow-xl">
          <button
            type="button"
            onClick={() => setShowEmojiBar(!showEmojiBar)}
            className="w-7 h-7 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            title="React live to other users"
          >
            <Smile className="w-4 h-4" />
          </button>

          {showEmojiBar && (
            <div className="flex items-center gap-1 px-1">
              {['🔥', '🇧🇩', '😱', '💩', '💀', '🎉'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => handleEmojiBlast(em)}
                  className="w-7 h-7 text-sm hover:scale-125 transition-transform flex items-center justify-center cursor-pointer"
                  title={`Blast ${em}`}
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Status Card */}
        <div className="bg-black/95 text-white border-2 border-yellow-400 p-2.5 rounded-xl shadow-2xl max-w-xs font-mono text-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5 font-black text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>REAL-TIME MULTI-USER</span>
            </div>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
              {presence.onlineCount} {presence.onlineCount === 1 ? 'Person' : 'People'}
            </span>
          </div>

          <div className="text-[11px] text-neutral-300 mb-2 leading-tight">
            {presence.remoteUsers.size === 0 ? (
              <span>
                You are currently the <strong className="text-yellow-400">only live visitor</strong>.
                Open another tab to see real synchronized cursors!
              </span>
            ) : (
              <span className="text-emerald-300">
                ⚡ Connected with{' '}
                <strong className="text-yellow-400">{presence.remoteUsers.size}</strong> other live peer
                {presence.remoteUsers.size > 1 ? 's' : ''}! Look at their cursors moving in real-time.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenSecondTab}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-[11px] shadow-md transition-all active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open 2nd Tab to Test Live Cursors</span>
          </button>
        </div>
      </div>
    </div>
  );
};
