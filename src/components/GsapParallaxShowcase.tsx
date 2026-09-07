import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Layers, Compass, ArrowDown, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

gsap.registerPlugin(ScrollTrigger);

export const GsapParallaxShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Parallax scrub on layers
    const parallaxTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        setScrollProgress(Math.round(self.progress * 100));
        if (layer1Ref.current) {
          gsap.set(layer1Ref.current, { y: (self.progress - 0.5) * 80 });
        }
        if (layer2Ref.current) {
          gsap.set(layer2Ref.current, { y: (self.progress - 0.5) * -120 });
        }
        if (layer3Ref.current) {
          gsap.set(layer3Ref.current, { rotation: (self.progress - 0.5) * 45 });
        }
      },
    });

    // 2. Reveal animation for the cards
    const cardElements = cardsRef.current?.children;
    let cardsTween: gsap.core.Tween | null = null;
    if (cardElements && cardElements.length > 0) {
      cardsTween = gsap.from(cardElements, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        stagger: 0.18,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    }

    return () => {
      parallaxTrigger.kill();
      cardsTween?.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-200 border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0px_#000] text-black font-['Comic_Neue',cursive] relative overflow-hidden"
    >
      {/* Parallax Floating Background Decorators */}
      <div
        ref={layer1Ref}
        className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none"
      />
      <div
        ref={layer2Ref}
        className="absolute -bottom-10 -right-10 w-56 h-56 bg-red-500/15 rounded-full blur-2xl pointer-events-none"
      />
      <div
        ref={layer3Ref}
        className="absolute top-1/3 right-8 text-5xl opacity-20 pointer-events-none select-none font-black"
      >
        🌀
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-700 animate-bounce" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-purple-900">
              GSAP &times; SCROLLTRIGGER PARALLAX &amp; REVEAL
            </h3>
          </div>
          <p className="text-xs text-gray-800 font-mono mt-1">
            Multi-depth scrub layers, pinned parallax transitions, and staggered reveal physics
          </p>
        </div>

        <div className="bg-black text-yellow-300 font-mono text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 font-bold">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>PARALLAX SCRUB: {scrollProgress}%</span>
        </div>
      </div>

      {/* 3 Parallax Revealed Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
      >
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between transform hover:-translate-y-1 transition-transform">
          <div>
            <div className="bg-red-600 text-white text-[10px] font-bold font-mono px-2 py-0.5 inline-block mb-2">
              LAYER 01: FOREGROUND
            </div>
            <h4 className="font-bold text-sm text-red-900 font-mono">
              Velocity Scrub Parallax
            </h4>
            <p className="text-xs text-gray-700 mt-1">
              Elements shift dynamically at 1.2x relative scroll speed, creating optical illusion of deep physical space.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-[10px] font-mono text-purple-800 font-bold">
            GSAP.TWEEN &bull; DURATION: 0.8s
          </div>
        </div>

        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between transform hover:-translate-y-1 transition-transform">
          <div>
            <div className="bg-purple-600 text-yellow-300 text-[10px] font-bold font-mono px-2 py-0.5 inline-block mb-2">
              LAYER 02: MIDGROUND
            </div>
            <h4 className="font-bold text-sm text-purple-900 font-mono">
              ScrollTrigger Stagger Reveal
            </h4>
            <p className="text-xs text-gray-700 mt-1">
              Scroll intersection triggers back.out elastic spring eases on children elements with 180ms timing offsets.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-[10px] font-mono text-purple-800 font-bold">
            EASE: back.out(1.7) &bull; SCRUB: TRUE
          </div>
        </div>

        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between transform hover:-translate-y-1 transition-transform">
          <div>
            <div className="bg-emerald-600 text-white text-[10px] font-bold font-mono px-2 py-0.5 inline-block mb-2">
              LAYER 03: BACKGROUND
            </div>
            <h4 className="font-bold text-sm text-emerald-900 font-mono">
              Rotational Warp Axis
            </h4>
            <p className="text-xs text-gray-700 mt-1">
              Sub-pixel transforms maintain 60 FPS performance without triggering browser repaints or layout reflows.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-[10px] font-mono text-purple-800 font-bold">
            WILL-CHANGE: TRANSFORM
          </div>
        </div>
      </div>
    </div>
  );
};
