import React, { useState } from 'react';
import { UserX, HeartCrack, AlertTriangle, CheckSquare, Sparkles, Smile, Frown } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface WorstUnsubscribeProps {
  onAddRage: () => void;
}

export const WorstUnsubscribe: React.FC<WorstUnsubscribeProps> = ({ onAddRage }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [confusingCheckbox, setConfusingCheckbox] = useState(false);
  const [fleeButtonPos, setFleeButtonPos] = useState({ x: 0, y: 0 });
  const [retentionDone, setRetentionDone] = useState(false);

  const dodgeFleeButton = () => {
    playSound('beep');
    onAddRage();
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 80;
    setFleeButtonPos({ x, y });
  };

  const handleNextStep = () => {
    playSound('coin');
    setStep((s) => s + 1);
  };

  const handleFinalCancelAttempt = () => {
    playSound('honk');
    onAddRage();
    setRetentionDone(true);
  };

  return (
    <section className="bg-pink-100 border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_#000] font-['Comic_Neue',cursive] max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-red-600 text-white p-3 border-2 border-black flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HeartCrack className="w-6 h-6 text-yellow-300 animate-bounce" />
          <h2 className="font-['Press_Start_2P',monospace] text-xs md:text-sm leading-tight">
            THE 12-STAGE GUILT UNSUBSCRIBE MAZE
          </h2>
        </div>
        <span className="bg-yellow-400 text-black font-mono text-[10px] px-2 py-0.5 font-bold">
          STAGE {step} OF 99
        </span>
      </div>

      {retentionDone ? (
        <div className="bg-yellow-300 border-4 border-black p-6 text-center space-y-3 animate-in zoom-in-95">
          <h3 className="font-['Press_Start_2P',monospace] text-sm text-red-600">
            🚫 UNSUBSCRIBE REQUEST DENIED!
          </h3>
          <p className="text-sm font-bold text-black">
            Our algorithmic empathy module detected severe grief in your click behavior. As a customer retention courtesy, we have upgraded your subscription to our <strong>SUPER PLATINUM DIAMOND TIER ($499.00/month)</strong> and subscribed your email to 142 daily affiliate newsletters!
          </p>
          <div className="p-2 bg-white border border-black font-mono text-xs text-green-700 font-bold">
            Confirmation code: NEVER-GONNA-LET-YOU-GO-42
          </div>
          <button
            onClick={() => {
              playSound('win');
              setRetentionDone(false);
              setStep(1);
            }}
            className="bg-black text-white px-4 py-2 text-xs font-mono font-bold cursor-pointer"
          >
            Try Again (Pointless)
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step 1: The Guilt Trip */}
          {step === 1 && (
            <div className="bg-white border-2 border-black p-5 text-center space-y-4 shadow-[4px_4px_0px_#000]">
              <div className="text-6xl animate-bounce">🐶😢💔</div>
              <h3 className="font-bold text-lg text-red-600">
                You are about to make Barnaby the Office Puppy cry!
              </h3>
              <p className="text-xs text-gray-700 max-w-md mx-auto leading-relaxed">
                Barnaby personally packages every spam email we send you with his tiny golden retriever paws. If you unsubscribe, Barnaby will lose his job and be forced to learn COBOL.
              </p>

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    playSound('win');
                    alert('Barnaby thanks you! You will receive 40 additional emails today.');
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-black px-6 py-3 text-sm border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  I LOVE BARNABY! KEEP ME SUBSCRIBED
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-3 py-1 text-[11px] border border-black cursor-pointer"
                >
                  I have a heart of stone, proceed to step 2 &gt;
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Hostile Reason Picker */}
          {step === 2 && (
            <div className="bg-white border-2 border-black p-5 space-y-4 shadow-[4px_4px_0px_#000]">
              <h3 className="font-bold text-sm text-purple-900 uppercase border-b pb-1">
                Step 2: Please tell us why you are committing this betrayal:
              </h3>

              <div className="space-y-2 text-xs font-bold">
                {[
                  'Your emails are too interesting and my brain is overloaded',
                  'I am being held hostage by a dial-up modem',
                  'I hate discounts, happiness, and puppy hugs',
                  'I mistakenly thought my inbox was meant for actual humans',
                ].map((reason, idx) => (
                  <label
                    key={idx}
                    className={`block p-2 border-2 border-black cursor-pointer ${
                      selectedReason === reason ? 'bg-yellow-300' : 'bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reasons"
                      checked={selectedReason === reason}
                      onChange={() => {
                        playSound('beep');
                        setSelectedReason(reason);
                      }}
                      className="mr-2 accent-red-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-700 underline font-mono cursor-pointer"
                >
                  &lt; Back to Barnaby the Puppy
                </button>
                <button
                  disabled={!selectedReason}
                  onClick={handleNextStep}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-bold px-4 py-2 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Confirm Reason & Continue &gt;
                </button>
              </div>
            </div>
          )}

          {/* Step 3: The Double Negative Logic Trap */}
          {step === 3 && (
            <div className="bg-white border-2 border-black p-5 space-y-4 shadow-[4px_4px_0px_#000]">
              <div className="bg-purple-900 text-yellow-300 p-2 text-xs font-mono font-bold">
                PHD LEVEL LINGUISTIC REVERSE-PSYCHOLOGY TEST
              </div>

              <p className="text-xs font-bold text-gray-800 leading-relaxed bg-yellow-100 p-3 border border-black">
                Please read the following sentence carefully:
                <br />
                <span className="italic text-purple-950 font-black">
                  &quot;Uncheck this box if you do NOT wish to NOT prevent us from failing to discontinue un-cancelling your subscription.&quot;
                </span>
              </p>

              <label className="flex items-center gap-2 cursor-pointer bg-pink-50 p-2 border border-black">
                <input
                  type="checkbox"
                  checked={confusingCheckbox}
                  onChange={(e) => {
                    playSound('glitch');
                    setConfusingCheckbox(e.target.checked);
                  }}
                  className="w-5 h-5 accent-red-600"
                />
                <span className="text-xs font-bold text-red-700">
                  {confusingCheckbox ? '✓ You have confused the algorithm!' : '✗ Box currently un-checked'}
                </span>
              </label>

              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-blue-700 underline font-mono cursor-pointer"
                >
                  &lt; Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-4 py-2 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  Proceed to Final Confirmation &gt;
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Visual Hierarchy Sabotage */}
          {step === 4 && (
            <div className="bg-white border-2 border-black p-5 space-y-4 text-center shadow-[4px_4px_0px_#000]">
              <h3 className="font-['Press_Start_2P',monospace] text-xs text-red-600">
                FINAL CHANCE TO SAVE YOUR SOUL
              </h3>

              <p className="text-xs text-gray-700">
                Choose wisely. One of these buttons will retain your access to eternal joy, and the other will physically dodge your click attempts:
              </p>

              {/* Giant attractive button that cancels the unsubscribe */}
              <div>
                <button
                  onClick={() => {
                    playSound('win');
                    alert('WISE CHOICE! You are re-subscribed forever.');
                    setStep(1);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-['Press_Start_2P',monospace] text-xs md:text-sm py-5 px-6 border-4 border-black shadow-[6px_6px_0px_#000] cursor-pointer animate-pulse"
                >
                  🌟 FORGET EVERYTHING & STAY SUBSCRIBED 🌟
                </button>
              </div>

              {/* The slippery miniature cancel button */}
              <div className="relative min-h-[60px] flex items-center justify-center">
                <button
                  onMouseEnter={dodgeFleeButton}
                  onClick={handleFinalCancelAttempt}
                  style={{
                    transform: `translate(${fleeButtonPos.x}px, ${fleeButtonPos.y}px)`,
                    transition: 'transform 0.12s ease-out',
                  }}
                  className="text-[9px] text-gray-400 hover:text-red-600 border border-gray-300 px-2 py-0.5 font-mono cursor-pointer"
                >
                  [Unsubscribe permanently (Try clicking)]
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
