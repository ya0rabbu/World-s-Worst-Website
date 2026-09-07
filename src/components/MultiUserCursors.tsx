import React, { useEffect, useState } from 'react';
import { MousePointer2, Users } from 'lucide-react';

interface SimulatedUser {
  id: string;
  name: string;
  country: string;
  flag: string;
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  lastClickTime: number;
  clicking: boolean;
  message?: string;
}

const INITIAL_USERS: SimulatedUser[] = [
  {
    id: 'user-yasir',
    name: 'Yasir (Architect)',
    country: 'Dhaka, BD',
    flag: '🇧🇩',
    color: '#FACC15', // Yellow
    x: 200,
    y: 350,
    targetX: 400,
    targetY: 500,
    speed: 0.04,
    lastClickTime: 0,
    clicking: false,
    message: 'Inspecting UI/UX 🎨',
  },
  {
    id: 'user-tanvir',
    name: 'Tanvir (Victim)',
    country: 'Mirpur, BD',
    flag: '🇧🇩',
    color: '#4ADE80', // Green
    x: 600,
    y: 200,
    targetX: 300,
    targetY: 600,
    speed: 0.035,
    lastClickTime: 0,
    clicking: false,
  },
  {
    id: 'user-kenji',
    name: 'Kenji',
    country: 'Tokyo, JP',
    flag: '🇯🇵',
    color: '#22D3EE', // Cyan
    x: 800,
    y: 400,
    targetX: 700,
    targetY: 250,
    speed: 0.03,
    lastClickTime: 0,
    clicking: false,
  },
  {
    id: 'user-sarah',
    name: 'Sarah UX',
    country: 'NYC, US',
    flag: '🇺🇸',
    color: '#F472B6', // Pink
    x: 450,
    y: 700,
    targetX: 850,
    targetY: 450,
    speed: 0.045,
    lastClickTime: 0,
    clicking: false,
  },
  {
    id: 'user-emma',
    name: 'Emma Dev',
    country: 'London, UK',
    flag: '🇬🇧',
    color: '#A78BFA', // Purple
    x: 300,
    y: 500,
    targetX: 500,
    targetY: 300,
    speed: 0.032,
    lastClickTime: 0,
    clicking: false,
  },
];

interface MultiUserCursorsProps {
  enabled?: boolean;
}

export const MultiUserCursors: React.FC<MultiUserCursorsProps> = ({ enabled = true }) => {
  const [users, setUsers] = useState<SimulatedUser[]>(INITIAL_USERS);
  const [isVisible, setIsVisible] = useState(enabled);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          // Move towards target
          let dx = u.targetX - u.x;
          let dy = u.targetY - u.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          let newTargetX = u.targetX;
          let newTargetY = u.targetY;
          let clicking = false;

          // If reached target, pick a new target within viewport
          if (dist < 20 || Math.random() < 0.02) {
            const maxX = Math.max(320, window.innerWidth - 80);
            const maxY = Math.max(480, window.innerHeight - 80);
            newTargetX = Math.floor(Math.random() * maxX) + 40;
            newTargetY = Math.floor(Math.random() * maxY) + 40;
            clicking = Math.random() < 0.4;
          }

          const newX = u.x + (newTargetX - u.x) * u.speed;
          const newY = u.y + (newTargetY - u.y) * u.speed;

          return {
            ...u,
            x: newX,
            y: newY,
            targetX: newTargetX,
            targetY: newTargetY,
            clicking,
          };
        })
      );
    }, 45);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-3 left-3 z-[9995] bg-black/80 hover:bg-black text-white text-[10px] font-mono border border-lime-400 px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_#000] cursor-pointer"
        title="Show multi-user live cursors"
      >
        <Users className="w-3 h-3 text-lime-400" />
        <span>Live Cursors: Off</span>
      </button>
    );
  }

  return (
    <>
      {/* Floating Toggle in corner */}
      <button
        onClick={() => setIsVisible(false)}
        className="fixed bottom-3 left-3 z-[9995] bg-black/85 hover:bg-black text-lime-300 text-[10px] font-mono border-2 border-lime-400 px-2.5 py-1 flex items-center gap-1.5 shadow-[3px_3px_0px_#000] cursor-pointer select-none"
        title="Hide simulated multi-user cursors"
      >
        <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping inline-block" />
        <Users className="w-3 h-3 text-lime-400" />
        <span>{users.length} Live Cursors Active</span>
      </button>

      {/* Simulated Ghost Cursors Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden select-none">
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              transform: `translate3d(${user.x}px, ${user.y}px, 0)`,
              transition: 'transform 0.06s linear',
            }}
            className="absolute top-0 left-0 flex flex-col items-start will-change-transform"
          >
            {/* Custom Colored Cursor Arrow */}
            <div className="relative">
              <MousePointer2
                className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                style={{
                  color: user.color,
                  fill: user.color,
                  transform: user.clicking ? 'scale(0.85) rotate(-5deg)' : 'scale(1)',
                  transition: 'transform 0.1s ease',
                }}
              />

              {/* Click ripple animation */}
              {user.clicking && (
                <div
                  className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 animate-ping"
                  style={{ borderColor: user.color }}
                />
              )}
            </div>

            {/* User Label Badge */}
            <div
              className="mt-0.5 ml-3.5 px-2 py-0.5 text-[10px] font-mono font-bold text-black rounded-md flex items-center gap-1 shadow-[2px_2px_4px_rgba(0,0,0,0.5)] border border-black/40 whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              <span>{user.flag}</span>
              <span>{user.name}</span>
            </div>

            {/* Optional Activity Message */}
            {user.message && (
              <div className="ml-3.5 mt-0.5 bg-black/90 text-white text-[9px] font-mono px-1.5 py-0.2 border border-white/20 rounded shadow-xs">
                {user.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
