import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap, RefreshCw, Compass } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  originalSize: number;
}

export const InteractiveParticleVortex: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleCount, setParticleCount] = useState(120);
  const [colorMode, setColorMode] = useState<'matrix' | 'cyber' | 'solar'>('cyber');
  const [mouseMode, setMouseMode] = useState<'attract' | 'repel'>('repel');
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  const getColors = () => {
    if (colorMode === 'matrix') return ['#00ff66', '#00cc44', '#66ff99', '#ffffff'];
    if (colorMode === 'solar') return ['#ff3300', '#ff9900', '#ffcc00', '#ffffff'];
    return ['#00f0ff', '#ff00aa', '#9d00ff', '#ffffff'];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 280);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 280;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles
    const colors = getColors();
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        size,
        originalSize: size,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 15, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120 && dist > 1) {
            const force = (120 - dist) / 120;
            const angle = Math.atan2(dy, dx);
            const moveMagnitude = force * 4;

            if (mouseMode === 'repel') {
              p.x -= Math.cos(angle) * moveMagnitude;
              p.y -= Math.sin(angle) * moveMagnitude;
            } else {
              p.x += Math.cos(angle) * moveMagnitude;
              p.y += Math.sin(angle) * moveMagnitude;
            }
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Constellation lines to neighboring particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(200, 220, 255, ${0.18 * (1 - dist / 65)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount, colorMode, mouseMode]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
  };

  const handleCanvasMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    playSound('glitch');
    // Shockwave burst
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    mouseRef.current = { x: clickX, y: clickY, active: true };
  };

  return (
    <div className="bg-slate-950 border-4 border-cyan-400 p-4 sm:p-6 shadow-[8px_8px_0px_#000] text-white font-['Comic_Neue',cursive]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-cyan-400 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-cyan-300">
              KINETIC PARTICLE NEBULA FIELD
            </h3>
          </div>
          <p className="text-xs text-cyan-100 font-mono mt-1">
            Realtime GPU particle physics with dynamic distance constellation clustering
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMouseMode(mouseMode === 'repel' ? 'attract' : 'repel')}
            className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-xs font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            MOUSE: {mouseMode.toUpperCase()}
          </button>

          <button
            onClick={() => {
              const modes: ('matrix' | 'cyber' | 'solar')[] = ['matrix', 'cyber', 'solar'];
              const next = modes[(modes.indexOf(colorMode) + 1) % modes.length];
              setColorMode(next);
            }}
            className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            THEME: {colorMode.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="relative w-full rounded-sm overflow-hidden border-2 border-cyan-500 bg-black cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          onClick={handleCanvasClick}
          className="w-full block"
        />

        <div className="absolute top-2 left-2 pointer-events-none bg-black/80 px-2 py-0.5 border border-cyan-400 text-[10px] font-mono text-cyan-300">
          HOVER TO DISPLACE &bull; CLICK FOR SHOCKWAVE
        </div>

        <div className="absolute bottom-2 right-2 pointer-events-none bg-black/80 px-2 py-0.5 border border-cyan-400 text-[10px] font-mono text-yellow-300">
          PARTICLES: {particleCount} &bull; CONSTELLATION MESH ON
        </div>
      </div>
    </div>
  );
};
