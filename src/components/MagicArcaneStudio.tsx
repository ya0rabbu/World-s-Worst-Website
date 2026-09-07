import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Wand2, Moon, Sun, Flame, Zap, Compass, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface StardustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
  wobble: number;
}

export const MagicArcaneStudio: React.FC = () => {
  const [spellType, setSpellType] = useState<'vortex' | 'stardust' | 'shockwave' | 'runes'>('vortex');
  const [mana, setMana] = useState(100);
  const [activeSpellName, setActiveSpellName] = useState('Cosmic Arcane Vortex');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInViewRef = useRef(true);

  // Pause rendering when offscreen for featherlight performance!
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 340);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 340;
    };
    window.addEventListener('resize', handleResize);

    const particles: StardustParticle[] = [];
    let runeRotation = 0;
    let pulseAngle = 0;

    const spawnSparks = (x: number, y: number, count = 25, hueOverride?: string) => {
      const palette = ['#ffd700', '#ff007f', '#00f0ff', '#7000ff', '#ffffff', '#00ff88'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          color: hueOverride || palette[Math.floor(Math.random() * palette.length)],
          decay: Math.random() * 0.02 + 0.012,
          wobble: Math.random() * 10,
        });
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      playSound('magic');
      spawnSparks(x, y, 40);
      setMana((m) => Math.min(100, m + 10));
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('touchstart', handlePointerDown);

    const render = () => {
      if (!isInViewRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = 'rgba(10, 4, 22, 0.28)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      runeRotation += 0.012;
      pulseAngle += 0.035;

      const pulseScale = 1 + Math.sin(pulseAngle) * 0.08;

      // 1. Arcane Concentric Magic Rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer Rune Ring
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 110 * pulseScale, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Counter-Rotating Hexagram
      ctx.rotate(runeRotation);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1.5;
      const sides = 6;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = (i * Math.PI * 2) / sides;
        const r = 90 * pulseScale;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Rotating Glyphs / Star Points
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8 - runeRotation * 1.5;
        const gx = Math.cos(a) * (110 * pulseScale);
        const gy = Math.sin(a) * (110 * pulseScale);

        ctx.fillStyle = i % 2 === 0 ? '#ff007f' : '#ffd700';
        ctx.beginPath();
        ctx.arc(gx, gy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core Glowing Arcane Eye
      const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 45);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.6)');
      grad.addColorStop(0.7, 'rgba(112, 0, 255, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 45 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 2. Ambient Continuous Stardust Orbit
      if (Math.random() > 0.4) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 120;
        particles.push({
          x: centerX + Math.cos(a) * r,
          y: centerY + Math.sin(a) * r,
          vx: -Math.sin(a) * 1.2,
          vy: Math.cos(a) * 1.2,
          size: Math.random() * 2.5 + 1,
          alpha: 1,
          color: Math.random() > 0.5 ? '#ffd700' : '#00ffff',
          decay: 0.015,
          wobble: Math.random() * 5,
        });
      }

      // 3. Stardust Particle Physics & Rendering
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('touchstart', handlePointerDown);
    };
  }, [spellType]);

  const castSpell = (type: 'vortex' | 'stardust' | 'shockwave' | 'runes') => {
    playSound('magic');
    setSpellType(type);

    const names = {
      vortex: 'Cosmic Arcane Vortex',
      stardust: 'Celestial Stardust Cascade',
      shockwave: 'Mana Shockwave Surge',
      runes: 'Golden Constellation Runes',
    };
    setActiveSpellName(names[type]);
    setMana((m) => Math.max(10, m - 15));
  };

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-[#120524] via-[#1a0836] to-black border-4 border-yellow-400 p-4 sm:p-6 shadow-[8px_8px_0px_#000] text-white space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-yellow-400 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-yellow-300 animate-spin" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-yellow-300">
              MAGIC &times; CELESTIAL STARDUST ARCANE STUDIO
            </h3>
          </div>
          <p className="text-xs text-purple-200 mt-1 font-mono">
            Trigonometric celestial runes, harmonic orbital stardust, and reactive kinetic spellcraft
          </p>
        </div>

        {/* Mana Meter */}
        <div className="bg-black/80 border border-purple-500 px-3 py-1.5 font-mono text-xs flex items-center gap-2">
          <span className="text-cyan-300 font-bold">MANA:</span>
          <div className="w-24 h-3 bg-gray-900 border border-cyan-400 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              style={{ width: `${mana}%` }}
            />
          </div>
          <span className="text-yellow-300 font-bold">{mana}%</span>
        </div>
      </div>

      {/* Canvas Display Viewport */}
      <div className="relative border-2 border-purple-500 bg-[#0a0316] overflow-hidden">
        {/* Floating Guidance Badge */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none font-mono text-[10px] bg-black/80 text-yellow-300 px-2 py-1 border border-yellow-400 shadow">
          SPELL: {activeSpellName.toUpperCase()} &bull; CLICK TO DISCHARGE STARDUST
        </div>

        <canvas ref={canvasRef} className="w-full h-[340px] cursor-crosshair block" />
      </div>

      {/* Spellbook Controls */}
      <div className="bg-purple-950/60 p-3 border border-purple-600 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-yellow-300 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            CAST SPELL:
          </span>
          <button
            onClick={() => castSpell('vortex')}
            className={`px-2.5 py-1 border-2 border-black font-bold cursor-pointer shadow-[2px_2px_0px_#000] ${
              spellType === 'vortex' ? 'bg-cyan-400 text-black' : 'bg-gray-800 text-gray-300'
            }`}
          >
            🔮 Arcane Vortex
          </button>
          <button
            onClick={() => castSpell('stardust')}
            className={`px-2.5 py-1 border-2 border-black font-bold cursor-pointer shadow-[2px_2px_0px_#000] ${
              spellType === 'stardust' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300'
            }`}
          >
            ✨ Stardust Shower
          </button>
          <button
            onClick={() => castSpell('shockwave')}
            className={`px-2.5 py-1 border-2 border-black font-bold cursor-pointer shadow-[2px_2px_0px_#000] ${
              spellType === 'shockwave' ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            ⚡ Shockwave Surge
          </button>
        </div>

        <button
          onClick={() => {
            playSound('magic');
            setMana(100);
          }}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
        >
          💎 RECHARGE MANA
        </button>
      </div>
    </div>
  );
};
