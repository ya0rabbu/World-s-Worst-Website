import React, { useState } from 'react';
import { playSound } from '../utils/audioSynth';
import { Terminal, RefreshCcw, AlertTriangle, Bug, Server, FileCode, CheckCircle2 } from 'lucide-react';

interface NextJsDisasterPanelProps {
  onAddRage: () => void;
}

export const NextJsDisasterPanel: React.FC<NextJsDisasterPanelProps> = ({ onAddRage }) => {
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [turbopackCompiling, setTurbopackCompiling] = useState(false);
  const [serverActionLogs, setServerActionLogs] = useState<string[]>([
    "✓ Compiled /api/cursed-data in 412ms (Turbopack)",
    "⚠ Warning: Server Component <BarnabyPuppy> tried to access window.localStorage on Mars.",
    "✓ Streaming SSR chunks 1 to 42... Suspense boundary never resolved.",
  ]);

  const triggerHydrationMismatch = () => {
    playSound('error');
    onAddRage();
    setShowHydrationModal(true);
  };

  const simulateTurbopackCompile = () => {
    playSound('glitch');
    onAddRage();
    setTurbopackCompiling(true);
    setTimeout(() => {
      playSound('honk');
      setTurbopackCompiling(false);
      setServerActionLogs((prev) => [
        `❌ Error: [Turbopack] Server Action 'throwDisaster()' crashed: Database caught on fire at line 42`,
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className="bg-black border-4 border-yellow-400 p-4 md:p-6 shadow-[8px_8px_0px_#000] text-white font-mono mb-8">
      {/* Next.js Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-gray-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white text-black font-black rounded-full flex items-center justify-center text-xs">
            ▲
          </div>
          <div>
            <h3 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-white">
              NEXT.JS 15 & TURBOPACK DISASTER SUITE
            </h3>
            <p className="text-[10px] text-gray-400">
              App Router, Server Actions, Hydration Mismatches & SSR Memory Leaks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={triggerHydrationMismatch}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 border border-white shadow-[2px_2px_0px_#fff] cursor-pointer flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Trigger Hydration Mismatch
          </button>

          <button
            onClick={simulateTurbopackCompile}
            disabled={turbopackCompiling}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 border border-white shadow-[2px_2px_0px_#fff] cursor-pointer flex items-center gap-1"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${turbopackCompiling ? 'animate-spin' : ''}`} />
            {turbopackCompiling ? 'Turbopack (84 mins)...' : 'Recompile Turbopack'}
          </button>
        </div>
      </div>

      {/* Next.js Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
        <div className="bg-gray-900 border border-gray-700 p-3">
          <div className="text-gray-400 text-[10px] uppercase">Next/Image Optimizer</div>
          <div className="text-lime-400 font-bold text-sm my-1">84 MB → 96 MB</div>
          <div className="text-[10px] text-red-400">Optimized image grew by +14% in size!</div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-3">
          <div className="text-gray-400 text-[10px] uppercase">RSC Server Streaming</div>
          <div className="text-yellow-300 font-bold text-sm my-1">&lt;Suspense&gt; (Perpetual)</div>
          <div className="text-[10px] text-gray-400">Fallback skeleton will stream until year 2042.</div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-3">
          <div className="text-gray-400 text-[10px] uppercase">Server Action State</div>
          <div className="text-cyan-300 font-bold text-sm my-1">418 I&apos;m a Teapot</div>
          <div className="text-[10px] text-gray-400">Form mutation rejected by server hamster.</div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-gray-950 border border-gray-800 rounded-sm p-3 text-[11px] space-y-1 font-mono">
        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] border-b border-gray-800 pb-1 mb-1">
          <Terminal className="w-3.5 h-3.5 text-lime-400" />
          <span>Next.js 15 Turbopack Server Console Logs:</span>
        </div>
        {serverActionLogs.map((log, idx) => (
          <div
            key={idx}
            className={
              log.includes('Error')
                ? 'text-red-400'
                : log.includes('Warning')
                ? 'text-yellow-300'
                : 'text-gray-300'
            }
          >
            {log}
          </div>
        ))}
      </div>

      {/* Authentic Next.js Red Hydration Error Modal */}
      {showHydrationModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111] border-2 border-red-600 rounded-lg p-5 max-w-xl w-full shadow-[12px_12px_0px_#ff0055] font-mono text-left">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-2 mb-3">
              <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                <Bug className="w-4 h-4 text-red-500 animate-bounce" />
                <span>Unhandled Runtime Error: Hydration failed</span>
              </div>
              <button
                onClick={() => {
                  playSound('beep');
                  setShowHydrationModal(false);
                }}
                className="text-gray-400 hover:text-white text-xs px-2 py-0.5 border border-gray-700 cursor-pointer"
              >
                ESC (Close)
              </button>
            </div>

            <div className="bg-red-950/40 border border-red-900 p-3 rounded-sm mb-3 text-red-300 text-xs leading-relaxed">
              <strong>Error:</strong> Text content does not match server-rendered HTML.
              <br />
              <span className="text-gray-400">
                Server rendered: <code className="text-yellow-300">&lt;CursedLeopardToiletSofa /&gt;</code>
              </span>
              <br />
              <span className="text-gray-400">
                Client hydrated: <code className="text-cyan-300">&lt;PepperoniServerRackBurning /&gt;</code>
              </span>
            </div>

            <p className="text-[11px] text-gray-400 mb-4">
              See more info here: <span className="text-blue-400 underline cursor-pointer">https://nextjs.org/docs/messages/react-hydration-error</span>
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  playSound('win');
                  setShowHydrationModal(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-sm cursor-pointer"
              >
                Acknowledge Framework Defeat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
