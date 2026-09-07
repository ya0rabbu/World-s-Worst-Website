import React, { useEffect, useState } from 'react';
import { Sparkles, Compass, Eye } from 'lucide-react';

interface ConfusingCursorProps {
  enabled?: boolean;
}

export const ConfusingCursor: React.FC<ConfusingCursorProps> = ({ enabled = false }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.body.style.cursor = 'default';
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'default';
    };
  }, [enabled, visible]);

  if (!enabled || !visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[99999] transition-transform duration-75 ease-out select-none hidden sm:block"
      style={{
        left: `${mousePos.x + 16}px`,
        top: `${mousePos.y + 16}px`,
      }}
    >
      <div className="flex items-center gap-1.5 bg-black/85 text-yellow-300 border-2 border-yellow-400 px-2 py-0.5 text-[10px] font-mono shadow-[3px_3px_0px_#000] rounded-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
        <span className="font-bold">✨ RETRO CHAOS TRAIL</span>
      </div>
    </div>
  );
};
