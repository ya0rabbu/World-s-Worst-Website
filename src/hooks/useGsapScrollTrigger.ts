import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playSound } from '../utils/audioSynth';

gsap.registerPlugin(ScrollTrigger);

interface GsapScrollOptions {
  enabled?: boolean;
  onSnapback?: () => void;
  onAddRage?: () => void;
}

export function useGsapScrollTrigger({
  enabled = true,
  onSnapback,
  onAddRage,
}: GsapScrollOptions = {}) {
  const [scrollSpeedMultiplier, setScrollSpeedMultiplier] = useState<number>(1);
  const [snapbackCount, setSnapbackCount] = useState<number>(0);
  const lastSnapbackTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    // 1. Setup ScrollTrigger watcher on body
    const triggers: ScrollTrigger[] = [];

    // Subtle scroll velocity telemetry
    const speedInterval = setInterval(() => {
      const speeds = [1.0, 1.2, 1.5, 0.9, 1.1];
      const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
      setScrollSpeedMultiplier(randomSpeed);
    }, 4000);

    // 2. ScrollTrigger progress tracking
    const trigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Smooth scroll progress
      },
    });
    triggers.push(trigger);

    return () => {
      clearInterval(speedInterval);
      triggers.forEach((t) => t.kill());
      ScrollTrigger.refresh();
    };
  }, [enabled, onSnapback, onAddRage]);

  return {
    scrollSpeedMultiplier,
    snapbackCount,
  };
}
