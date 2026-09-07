import React, { useState, useEffect, useRef } from 'react';
import { Application, Container, Graphics } from 'pixi.js';
import Konva from 'konva';
import { Canvas as FabricCanvas, Rect as FabricRect, Circle as FabricCircle, FabricText } from 'fabric';
import { Sparkles, Layers, Box, Cpu, Play, Pause, RefreshCw, Zap, Flame, Compass } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

// Safeguard PixiJS v8 Application prototype against unhandled _cancelResize errors during destroy/unmount
if (typeof Application !== 'undefined' && Application.prototype) {
  if (typeof (Application.prototype as any)._cancelResize !== 'function') {
    (Application.prototype as any)._cancelResize = function () {
      if (this._resizeId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(this._resizeId);
        this._resizeId = null;
      }
    };
  }
}

const safeDestroyPixi = (pixiApp: Application | null) => {
  if (!pixiApp) return;
  try {
    if (typeof (pixiApp as any)._cancelResize !== 'function') {
      (pixiApp as any)._cancelResize = () => {};
    }
    if (pixiApp.renderer && typeof pixiApp.renderer.destroy === 'function') {
      pixiApp.destroy(true, { children: true });
    }
  } catch (err) {
    console.warn('Safe Pixi destroy suppressed error:', err);
  }
};

export const CanvasEnginesTriad: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<'pixi' | 'konva' | 'fabric'>('pixi');
  const [thoughtCount, setThoughtCount] = useState<number>(1500);
  const [fps, setFps] = useState<number>(60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pixiMode, setPixiMode] = useState<'vortex' | 'neural' | 'repulsion'>('vortex');

  // Containers
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiMountRef = useRef<HTMLDivElement>(null);
  const konvaMountRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);

  // In-view observer for lightweight execution
  const [isInView, setIsInView] = useState<boolean>(true);

  // Real-time synchronization refs to avoid recreating WebGL contexts unnecessarily
  const thoughtCountRef = useRef(thoughtCount);
  const pixiModeRef = useRef(pixiMode);
  const isInViewRef = useRef(isInView);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    thoughtCountRef.current = thoughtCount;
  }, [thoughtCount]);

  useEffect(() => {
    pixiModeRef.current = pixiMode;
  }, [pixiMode]);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // =========================================================================
  // 1. PIXI.JS ENGINE: THOUSANDS OF SWARMING THOUGHT PARTICLES
  // =========================================================================
  useEffect(() => {
    if (activeEngine !== 'pixi' || !pixiMountRef.current) return;

    let app: Application | null = null;
    let animId: number;
    let isCancelled = false;
    let isReady = false;

    const initPixi = async () => {
      const mount = pixiMountRef.current;
      if (!mount) return;

      const width = mount.clientWidth || 600;
      const height = Math.max(340, mount.clientHeight || 340);

      const newApp = new Application();
      (newApp as any)._cancelResize = () => {};

      try {
        await newApp.init({
          width,
          height,
          backgroundColor: 0x070410,
          preference: 'webgl',
          antialias: false,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });
      } catch (e) {
        console.warn('Pixi init failed:', e);
        return;
      }

      if (isCancelled || !pixiMountRef.current) {
        safeDestroyPixi(newApp);
        return;
      }

      app = newApp;
      isReady = true;

      mount.replaceChildren(app.canvas);

      // Create swarming thought particles
      const thoughtsContainer = new Container();
      app.stage.addChild(thoughtsContainer);

      const maxParticlePool = 3000;
      const particles: {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        color: number;
        angle: number;
        speed: number;
        dist: number;
      }[] = [];

      const colors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff66, 0xff3366, 0x33ccff];

      for (let i = 0; i < maxParticlePool; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (Math.min(width, height) * 0.42);
        particles.push({
          x: width / 2 + Math.cos(angle) * dist,
          y: height / 2 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle,
          speed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
          dist,
        });
      }

      const graphics = new Graphics();
      thoughtsContainer.addChild(graphics);

      let mouseX = width / 2;
      let mouseY = height / 2;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = app?.canvas?.getBoundingClientRect();
        if (!rect) return;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      };

      const handlePointerDown = () => {
        playSound('coin');
        // Supernova blast
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.vx += (dx / dist) * (Math.random() * 12 + 6);
          p.vy += (dy / dist) * (Math.random() * 12 + 6);
        }
      };

      app.canvas.addEventListener('pointermove', handlePointerMove);
      app.canvas.addEventListener('pointerdown', handlePointerDown);

      let frames = 0;
      let fpsTimer = performance.now();

      const tickerLoop = () => {
        if (isCancelled || !app || !isReady) return;

        // Skip rendering if out of viewport or paused to save 100% CPU/GPU!
        if (!isInViewRef.current || isPausedRef.current) {
          animId = requestAnimationFrame(tickerLoop);
          return;
        }

        const now = performance.now();
        frames++;
        if (now - fpsTimer >= 500) {
          setFps(Math.round((frames * 1000) / (now - fpsTimer)));
          frames = 0;
          fpsTimer = now;
        }

        graphics.clear();

        const centerX = width / 2;
        const centerY = height / 2;
        const activeCount = Math.min(particles.length, thoughtCountRef.current);
        const currentMode = pixiModeRef.current;

        for (let i = 0; i < activeCount; i++) {
          const p = particles[i];

          if (currentMode === 'vortex') {
            p.angle += p.speed;
            const targetX = centerX + Math.cos(p.angle) * p.dist;
            const targetY = centerY + Math.sin(p.angle) * p.dist;
            p.vx += (targetX - p.x) * 0.04;
            p.vy += (targetY - p.y) * 0.04;
          } else if (currentMode === 'repulsion') {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120 && d > 0) {
              const force = (120 - d) / 120;
              p.vx += (dx / d) * force * 3;
              p.vy += (dy / d) * force * 3;
            }
          }

          // Inertia & boundary damping
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;

          if (p.x < 0) {
            p.x = 0;
            p.vx *= -1;
          }
          if (p.x > width) {
            p.x = width;
            p.vx *= -1;
          }
          if (p.y < 0) {
            p.y = 0;
            p.vy *= -1;
          }
          if (p.y > height) {
            p.y = height;
            p.vy *= -1;
          }

          graphics.circle(p.x, p.y, p.radius);
          graphics.fill({ color: p.color, alpha: 0.85 });
        }

        animId = requestAnimationFrame(tickerLoop);
      };

      animId = requestAnimationFrame(tickerLoop);
    };

    initPixi();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      if (app && isReady) {
        safeDestroyPixi(app);
      }
    };
  }, [activeEngine]);

  // =========================================================================
  // 2. KONVA.JS ENGINE: SCENE GRAPH & TRANSFORMABLE THOUGHT NODES
  // =========================================================================
  useEffect(() => {
    if (activeEngine !== 'konva' || !konvaMountRef.current) return;

    const mount = konvaMountRef.current;
    const width = mount.clientWidth || 600;
    const height = Math.max(340, mount.clientHeight || 340);

    const stage = new Konva.Stage({
      container: mount,
      width,
      height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // Bounding Transformer for Interactive Transformation
    const tr = new Konva.Transformer({
      rotateEnabled: true,
      borderStroke: '#00ffcc',
      anchorStroke: '#ffff00',
      anchorFill: '#ff007f',
      anchorSize: 10,
    });
    layer.add(tr);

    // Initial Thought Nodes with Labels
    const nodesData = [
      { id: '1', title: '🧠 OVERTHINKING', color: '#ff007f', x: 80, y: 70, radius: 45 },
      { id: '2', title: '🌀 CHAOS SYNC', color: '#00e5ff', x: 280, y: 140, radius: 52 },
      { id: '3', title: '⚠️ UNRESOLVED BUG', color: '#ffd600', x: 460, y: 80, radius: 48 },
      { id: '4', title: '⚡ GUINNESS RECORD', color: '#76ff03', x: 200, y: 220, radius: 55 },
    ];

    nodesData.forEach((data) => {
      const group = new Konva.Group({
        x: data.x,
        y: data.y,
        draggable: true,
      });

      const circle = new Konva.Circle({
        radius: data.radius,
        fill: data.color,
        stroke: '#000',
        strokeWidth: 3,
        shadowColor: '#000',
        shadowBlur: 10,
        shadowOffset: { x: 5, y: 5 },
        shadowOpacity: 0.6,
      });

      const text = new Konva.Text({
        text: data.title,
        fontSize: 10,
        fontFamily: 'monospace',
        fontStyle: 'bold',
        fill: '#000',
        align: 'center',
        width: data.radius * 2,
        offsetX: data.radius,
        offsetY: 6,
      });

      group.add(circle);
      group.add(text);

      group.on('click tap', () => {
        playSound('beep');
        tr.nodes([group]);
        layer.batchDraw();
      });

      group.on('dragstart', () => {
        group.moveToTop();
        tr.moveToTop();
      });

      layer.add(group);
    });

    stage.on('click tap', (e) => {
      if (e.target === stage) {
        tr.nodes([]);
        layer.batchDraw();
      }
    });

    layer.draw();

    return () => {
      stage.destroy();
    };
  }, [activeEngine]);

  // =========================================================================
  // 3. FABRIC.JS ENGINE: OBJECT VECTOR CAD & NEON PEN CANVAS
  // =========================================================================
  useEffect(() => {
    if (activeEngine !== 'fabric' || !fabricCanvasRef.current) return;

    const canvasEl = fabricCanvasRef.current;
    const parentWidth = canvasEl.parentElement?.clientWidth || 600;
    const height = 340;

    const canvas = new FabricCanvas(canvasEl, {
      width: parentWidth,
      height,
      backgroundColor: '#0c0716',
      selectionColor: 'rgba(255, 215, 0, 0.25)',
      selectionBorderColor: '#ffd700',
      selectionLineWidth: 2,
    });

    // Add initial vector objects
    const rect = new FabricRect({
      left: 60,
      top: 60,
      fill: '#00e5ff',
      width: 110,
      height: 80,
      stroke: '#000',
      strokeWidth: 3,
      cornerColor: '#ff007f',
      cornerSize: 10,
    });

    const circle = new FabricCircle({
      left: 230,
      top: 80,
      fill: '#ff007f',
      radius: 45,
      stroke: '#ffff00',
      strokeWidth: 3,
      cornerColor: '#00ffcc',
      cornerSize: 10,
    });

    const text = new FabricText('FABRIC.JS VECTOR THOUGHT', {
      left: 120,
      top: 220,
      fontSize: 14,
      fontFamily: 'monospace',
      fill: '#ffff00',
      fontWeight: 'bold',
      backgroundColor: '#000000cc',
      padding: 6,
    });

    canvas.add(rect, circle, text);
    canvas.renderAll();

    return () => {
      canvas.dispose();
    };
  }, [activeEngine]);

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-[#0e071e] via-[#150a2b] to-black border-4 border-yellow-400 p-4 sm:p-6 shadow-[8px_8px_0px_#000] text-white space-y-4"
    >
      {/* Triad Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-yellow-400 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <h3 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm text-yellow-300">
              2D CANVAS ENGINE TRIAD: PIXIJS &times; KONVA &times; FABRIC
            </h3>
          </div>
          <p className="text-xs text-purple-200 mt-1 font-mono">
            Direct hardware GPU 2D acceleration, Scene Graph hierarchy, and Object-Oriented Vector CAD
          </p>
        </div>

        {/* Engine Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => {
              playSound('beep');
              setActiveEngine('pixi');
            }}
            className={`px-3 py-1.5 border-2 border-black font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] ${
              activeEngine === 'pixi'
                ? 'bg-cyan-400 text-black ring-2 ring-yellow-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>PixiJS (3,000 Thoughts)</span>
          </button>

          <button
            onClick={() => {
              playSound('beep');
              setActiveEngine('konva');
            }}
            className={`px-3 py-1.5 border-2 border-black font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] ${
              activeEngine === 'konva'
                ? 'bg-pink-500 text-white ring-2 ring-yellow-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Konva.js (Scene Graph)</span>
          </button>

          <button
            onClick={() => {
              playSound('beep');
              setActiveEngine('fabric');
            }}
            className={`px-3 py-1.5 border-2 border-black font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] ${
              activeEngine === 'fabric'
                ? 'bg-yellow-400 text-black ring-2 ring-yellow-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Fabric.js (Vector CAD)</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div className="relative border-2 border-purple-500 bg-black/80 min-h-[350px] overflow-hidden">
        {/* Telemetry Floating Badge */}
        <div className="absolute top-2 left-2 z-20 flex flex-wrap items-center gap-2 pointer-events-none font-mono text-[10px]">
          <div className="bg-black/85 text-lime-400 px-2 py-1 border border-lime-400 flex items-center gap-1 shadow">
            <Zap className="w-3 h-3 text-yellow-300 animate-pulse" />
            <span>GPU: {fps} FPS</span>
          </div>
          <div className="bg-black/85 text-cyan-300 px-2 py-1 border border-cyan-400 shadow">
            ACTIVE: {activeEngine.toUpperCase()}
          </div>
          {activeEngine === 'pixi' && (
            <div className="bg-black/85 text-yellow-300 px-2 py-1 border border-yellow-400 shadow">
              PARTICLES: {thoughtCount} THOUGHTS
            </div>
          )}
        </div>

        {/* 1. PixiJS Canvas Mount */}
        {activeEngine === 'pixi' && (
          <div ref={pixiMountRef} className="w-full h-[350px] cursor-crosshair" />
        )}

        {/* 2. Konva.js Canvas Mount */}
        {activeEngine === 'konva' && (
          <div ref={konvaMountRef} className="w-full h-[350px] cursor-pointer bg-[#0a0515]" />
        )}

        {/* 3. Fabric.js Canvas Mount */}
        {activeEngine === 'fabric' && (
          <div className="w-full h-[350px] flex items-center justify-center bg-[#070311]">
            <canvas ref={fabricCanvasRef} />
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="bg-purple-950/70 p-3 border border-purple-600 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        {activeEngine === 'pixi' ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-yellow-300 font-bold">THOUGHT DENSITY:</span>
              {[500, 1500, 2500].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    playSound('beep');
                    setThoughtCount(count);
                  }}
                  className={`px-2 py-1 border border-cyan-400 text-[11px] font-bold cursor-pointer ${
                    thoughtCount === count
                      ? 'bg-cyan-400 text-black'
                      : 'bg-black text-cyan-300 hover:bg-gray-800'
                  }`}
                >
                  {count} Thoughts
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-yellow-300 font-bold">PHYSICS:</span>
              {(['vortex', 'repulsion', 'neural'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    playSound('coin');
                    setPixiMode(mode);
                  }}
                  className={`px-2.5 py-1 border border-yellow-400 text-[11px] font-bold cursor-pointer uppercase ${
                    pixiMode === mode
                      ? 'bg-yellow-400 text-black'
                      : 'bg-black text-yellow-300 hover:bg-gray-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold border border-black cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </>
        ) : activeEngine === 'konva' ? (
          <div className="flex flex-wrap items-center justify-between w-full gap-2 text-[11px]">
            <span className="text-pink-300 font-bold">
              💡 Drag circles to move • Click any thought to activate Konva Transformer (scale/rotate)
            </span>
            <span className="text-gray-400">
              Layer Caching &bull; 60 FPS Canvas Scene Graph
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between w-full gap-2 text-[11px]">
            <span className="text-yellow-300 font-bold">
              📐 Select shapes &bull; Rotate handles &bull; Fabric.js Object-Oriented Canvas Architecture
            </span>
            <span className="text-gray-400">
              Interactive Bounding Boxes &amp; Serialized Vector CAD
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
