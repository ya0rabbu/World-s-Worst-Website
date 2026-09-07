import React, { useEffect, useState } from 'react';
import { Users, Activity, Globe, Wifi, ShieldCheck } from 'lucide-react';

interface CountryStat {
  code: string;
  flag: string;
  name: string;
  count: number;
}

export const LiveUserCounter: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<number>(1842);
  const [recentJoined, setRecentJoined] = useState<string | null>('Tanvir joined from Dhaka, BD');
  const [ping, setPing] = useState<number>(24);

  const countries: CountryStat[] = [
    { code: 'BD', flag: '🇧🇩', name: 'Bangladesh', count: 864 },
    { code: 'US', flag: '🇺🇸', name: 'United States', count: 320 },
    { code: 'JP', flag: '🇯🇵', name: 'Japan', count: 285 },
    { code: 'GB', flag: '🇬🇧', name: 'UK', count: 198 },
    { code: 'DE', flag: '🇩🇪', name: 'Germany', count: 175 },
  ];

  useEffect(() => {
    const userInterval = setInterval(() => {
      // Fluctuate user count naturally between 1750 and 2100
      setActiveUsers((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(1600, prev + delta);
      });
      // Vary ping slightly
      setPing(20 + Math.floor(Math.random() * 8));
    }, 4000);

    const locations = [
      'Rahim joined from Dhanmondi, Dhaka 🇧🇩',
      'Kenji joined from Shibuya, Tokyo 🇯🇵',
      'Alex joined from Brooklyn, NYC 🇺🇸',
      'Sadia joined from Chittagong 🇧🇩',
      'Oliver joined from London 🇬🇧',
      'Mehedi joined from Sylhet 🇧🇩',
      'Hans joined from Berlin 🇩🇪',
    ];

    const toastInterval = setInterval(() => {
      const nextLocation = locations[Math.floor(Math.random() * locations.length)];
      setRecentJoined(nextLocation);
    }, 6000);

    return () => {
      clearInterval(userInterval);
      clearInterval(toastInterval);
    };
  }, []);

  return (
    <div className="w-full bg-black/95 text-white border-b-2 border-yellow-400 font-mono text-xs select-none sticky top-0 z-[990] shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Active Online Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/80 px-2.5 py-0.5 rounded-sm font-black shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5" />
            <span className="tracking-wide">
              {activeUsers.toLocaleString()} <span className="text-[10px] font-normal text-emerald-300">ONLINE</span>
            </span>
          </div>

          {/* Location breakdown pill */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-300">
            <Globe className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-semibold text-gray-400">Live Traffic:</span>
            {countries.map((c) => (
              <span
                key={c.code}
                className="bg-gray-900 border border-gray-700 px-1.5 py-0.2 rounded text-[10px] flex items-center gap-0.5"
                title={`${c.name}: ${c.count} users`}
              >
                <span>{c.flag}</span>
                <span className="text-gray-300 font-mono">{c.code}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Center: Live joining ticker */}
        {recentJoined && (
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-yellow-300 bg-yellow-950/40 border border-yellow-500/40 px-2 py-0.5 rounded-sm">
            <Activity className="w-3 h-3 text-yellow-400 animate-pulse" />
            <span>{recentJoined}</span>
          </div>
        )}

        {/* Right: Server Ping & Verified Architect Badge */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-cyan-400">
            <Wifi className="w-3 h-3" />
            <span>{ping}ms</span>
          </div>

          <div className="flex items-center gap-1 text-yellow-300 font-bold bg-purple-950/60 border border-purple-600/60 px-2 py-0.5 rounded text-[10px]">
            <ShieldCheck className="w-3 h-3 text-yellow-400" />
            <span>Architect: Yasir Abed Rabbu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
