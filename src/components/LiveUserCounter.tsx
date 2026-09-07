import React, { useEffect, useState } from 'react';
import { Users, Activity, Wifi, ShieldCheck, Edit3, Check, Globe, RotateCcw } from 'lucide-react';
import { presenceManager, PresenceState } from '../utils/presenceClient';
import { playSound } from '../utils/audioSynth';

interface LiveUserCounterProps {
  onTriggerLoading?: () => void;
}

export const LiveUserCounter: React.FC<LiveUserCounterProps> = ({ onTriggerLoading }) => {
  const [presence, setPresence] = useState<PresenceState>(presenceManager.getState());
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  useEffect(() => {
    let prevUsersCount = presence.remoteUsers.size;

    const unsubscribe = presenceManager.subscribe((newState) => {
      // If someone new joined
      if (newState.remoteUsers.size > prevUsersCount) {
        const newest = Array.from(newState.remoteUsers.values()).pop();
        if (newest) {
          setRecentNotification(`🎉 ${newest.name} joined the site!`);
          playSound('coin');
          setTimeout(() => setRecentNotification(null), 5000);
        }
      } else if (newState.remoteUsers.size < prevUsersCount) {
        setRecentNotification(`👋 A peer disconnected.`);
        setTimeout(() => setRecentNotification(null), 3000);
      }
      prevUsersCount = newState.remoteUsers.size;
      setPresence(newState);
    });

    return () => unsubscribe();
  }, [presence.remoteUsers.size]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      presenceManager.setNickname(tempName.trim());
      playSound('beep');
    }
    setIsEditingName(false);
  };

  const remoteUsersList = Array.from(presence.remoteUsers.values());

  return (
    <div className="w-full bg-black/95 text-white border-b-2 border-yellow-400 font-mono text-xs select-none sticky top-0 z-[990] shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Real Online Counter Badge */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm font-black shadow-xs border ${
              presence.onlineCount > 1
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                : 'bg-neutral-900 text-yellow-400 border-yellow-500/80'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  presence.onlineCount > 1 ? 'bg-emerald-400' : 'bg-yellow-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  presence.onlineCount > 1 ? 'bg-emerald-500' : 'bg-yellow-500'
                }`}
              />
            </span>
            <Users className="w-3.5 h-3.5" />
            <span className="tracking-wide">
              {presence.onlineCount} {presence.onlineCount === 1 ? 'LIVE (YOU)' : 'USERS LIVE'}
            </span>
          </div>

          {/* User Self Identity Tag */}
          <div className="flex items-center gap-1 text-[11px] bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: presence.selfColor }}
            />
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  defaultValue={presence.selfName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-black text-yellow-300 border border-yellow-400 px-1 py-0 text-[10px] w-28 rounded outline-none"
                />
                <button
                  type="submit"
                  className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-neutral-400">You:</span>
                <strong className="text-yellow-300">{presence.selfName}</strong>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(presence.selfName);
                    setIsEditingName(true);
                  }}
                  className="text-neutral-500 hover:text-yellow-400 ml-1 cursor-pointer"
                  title="Change your live nickname"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Peers / Notification ticker */}
        <div className="hidden md:flex items-center gap-2 text-[11px]">
          {recentNotification ? (
            <div className="flex items-center gap-1.5 text-yellow-300 bg-yellow-950/60 border border-yellow-500/50 px-2 py-0.5 rounded-sm animate-pulse">
              <Activity className="w-3.5 h-3.5 text-yellow-400" />
              <span>{recentNotification}</span>
            </div>
          ) : remoteUsersList.length > 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-sm">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Peers online:</span>
              <div className="flex items-center gap-1">
                {remoteUsersList.slice(0, 4).map((u) => (
                  <span
                    key={u.id}
                    className="px-1.5 py-0.2 rounded text-[10px] text-black font-bold flex items-center gap-0.5"
                    style={{ backgroundColor: u.color }}
                  >
                    <span>{u.flag}</span>
                    <span>{u.name.split(' ')[0]}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-neutral-400 flex items-center gap-1 text-[11px]">
              <span className="text-neutral-500">No other visitors currently.</span>
              <span className="text-yellow-400/90 font-medium">
                Live sync engine ready for new arrivals.
              </span>
            </div>
          )}
        </div>

        {/* Right: Network Status & Architect */}
        <div className="flex items-center gap-2.5 text-[11px]">
          <div className="flex items-center gap-1 text-cyan-400">
            <Wifi className="w-3 h-3" />
            <span>{presence.isConnected ? 'SSE Synced' : 'Local Channel'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-yellow-300 font-bold bg-purple-950/60 border border-purple-600/60 px-2 py-0.5 rounded text-[10px]">
            <ShieldCheck className="w-3 h-3 text-yellow-400" />
            <span>Architect: Yasir Abed Rabbu</span>
          </div>

          {onTriggerLoading && (
            <button
              type="button"
              onClick={() => {
                playSound('beep');
                onTriggerLoading();
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1 text-[10px] transition-transform active:translate-x-0.5 active:translate-y-0.5"
              title="Re-run Guinness Hostile Boot Loading Screen"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>লোডিং স্ক্রিন</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
