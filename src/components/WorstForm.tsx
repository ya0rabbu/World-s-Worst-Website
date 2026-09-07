import React, { useState, useEffect } from 'react';
import { Sparkles, Dices, AlertTriangle, CheckCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface WorstFormProps {
  onFormAction: () => void;
  onSuccessSubmit: () => void;
}

export const WorstForm: React.FC<WorstFormProps> = ({ onFormAction, onSuccessSubmit }) => {
  // Name state (auto-spongecased)
  const [rawName, setRawName] = useState('');

  // Phone number slider
  const [phoneNumber, setPhoneNumber] = useState<number>(5551234567);

  // Birthday slot machine
  const [birthDay, setBirthDay] = useState(1);
  const [birthMonth, setBirthMonth] = useState('Jan');
  const [birthYear, setBirthYear] = useState(2000);
  const [isSpinning, setIsSpinning] = useState(false);

  // Password state & validation rules
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Password rules validation
  const ruleLength = password.length >= 12;
  const ruleBangla = /[\u0980-\u09FF]/.test(password); // Contains Bengali character
  const ruleNoE = !/[eE]/.test(password); // No 'e' or 'E'
  const ruleEmoji = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(password); // Food/emoji
  
  // Sum of digits in password equals 42
  const numbersInPass = password.match(/\d/g)?.map(Number) || [];
  const sumOfNumbers = numbersInPass.reduce((acc, curr) => acc + curr, 0);
  const ruleSum42 = sumOfNumbers === 42;

  const allPasswordValid = ruleLength && ruleBangla && ruleNoE && ruleEmoji && ruleSum42;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound('beep');
    onFormAction();
    const val = e.target.value;
    // Spongebob case logic: alternate lower and upper randomly
    const sponge = val
      .split('')
      .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join('');
    setRawName(sponge);
  };

  const spinBirthday = () => {
    playSound('coin');
    onFormAction();
    setIsSpinning(true);
    let spins = 0;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const interval = setInterval(() => {
      setBirthDay(Math.floor(Math.random() * 31) + 1);
      setBirthMonth(months[Math.floor(Math.random() * months.length)]);
      setBirthYear(Math.floor(Math.random() * 110) + 1915);
      spins++;
      if (spins > 12) {
        clearInterval(interval);
        setIsSpinning(false);
        playSound('win');
      }
    }, 80);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound('glitch');
    onFormAction();
    setPhoneNumber(Number(e.target.value));
  };

  const adjustPhone = (delta: number) => {
    playSound('beep');
    onFormAction();
    setPhoneNumber((prev) => Math.max(0, Math.min(9999999999, prev + delta)));
  };

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('honk');
    onFormAction();
    setShowConfirmModal(true);
  };

  return (
    <section className="bg-fuchsia-200 border-4 border-black p-5 shadow-[8px_8px_0px_#000] my-6 font-['Comic_Neue',cursive]">
      <div className="bg-purple-900 text-yellow-300 p-2 border-2 border-black mb-4 flex items-center justify-between">
        <h3 className="font-['Press_Start_2P',monospace] text-xs md:text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 animate-spin" />
          THE WORLD&apos;S WORST REGISTRATION FORM
        </h3>
        <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 font-black uppercase">
          0% User Friendly
        </span>
      </div>

      <p className="text-xs font-bold text-gray-800 mb-4 bg-yellow-100 p-2 border border-black">
        ℹ️ Please fill in all fields with utmost precision. Any mistake will result in public humiliation.
      </p>

      <form onSubmit={handleSubmitAttempt} className="space-y-5">
        {/* 1. Name Input with auto-mocking case */}
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <label className="block text-xs font-bold text-black uppercase mb-1">
            1. Your Full Name (Auto-Sarcasm Enabled):
          </label>
          <input
            type="text"
            value={rawName}
            onChange={handleNameChange}
            placeholder="Type your name here..."
            className="w-full bg-yellow-50 border-2 border-black p-2 font-mono text-sm tracking-wide focus:bg-pink-100 focus:outline-none"
          />
          <p className="text-[10px] text-gray-600 mt-1 italic">
            Letters are automatically rearranged into mocking alternating case for your convenience.
          </p>
        </div>

        {/* 2. Phone Number Range Slider */}
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-black uppercase">
              2. Phone Number (Precision Range Slider):
            </label>
            <span className="bg-black text-green-400 font-mono px-2 py-0.5 text-xs font-black">
              {phoneNumber.toString().padStart(10, '0')}
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="9999999999"
            step="1"
            value={phoneNumber}
            onChange={handleSliderChange}
            className="w-full accent-red-600 cursor-pointer my-2"
          />

          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[10px] font-mono text-gray-500">Min: 0000000000</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => adjustPhone(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-black px-2 py-0.5 text-xs font-mono font-bold border border-black cursor-pointer"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => adjustPhone(+1)}
                className="bg-gray-200 hover:bg-gray-300 text-black px-2 py-0.5 text-xs font-mono font-bold border border-black cursor-pointer"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => adjustPhone(Math.floor((Math.random() - 0.5) * 50000))}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-0.5 text-xs font-bold border border-black cursor-pointer"
              >
                Random Jitter
              </button>
            </div>
            <span className="text-[10px] font-mono text-gray-500">Max: 9999999999</span>
          </div>
          <p className="text-[10px] text-red-600 mt-1 font-bold">
            ⚠️ Tip: Drag the slider until you hit your exact 10-digit number. Estimated time: 48 hours.
          </p>
        </div>

        {/* 3. Birthday Slot Machine */}
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-black uppercase">
              3. Date of Birth (Casino Slot Machine):
            </label>
            <span className="text-[10px] font-bold text-purple-700 font-mono">
              Selected: {birthDay} {birthMonth} {birthYear}
            </span>
          </div>

          <div className="flex items-center gap-3 justify-center bg-black p-3 border-2 border-yellow-400 mb-2">
            <div className="w-16 h-12 bg-white border-2 border-gray-400 flex items-center justify-center font-['Press_Start_2P',monospace] text-sm text-red-600 shadow-inner">
              {birthDay}
            </div>
            <div className="w-20 h-12 bg-white border-2 border-gray-400 flex items-center justify-center font-['Press_Start_2P',monospace] text-sm text-blue-600 shadow-inner">
              {birthMonth}
            </div>
            <div className="w-24 h-12 bg-white border-2 border-gray-400 flex items-center justify-center font-['Press_Start_2P',monospace] text-sm text-green-600 shadow-inner">
              {birthYear}
            </div>

            <button
              type="button"
              disabled={isSpinning}
              onClick={spinBirthday}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black px-4 py-2 font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#fff] cursor-pointer flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Dices className="w-4 h-4 animate-spin" />
              {isSpinning ? 'SPINNING...' : 'SPIN FOR BIRTHDAY!'}
            </button>
          </div>
          <p className="text-[10px] text-gray-600">
            Keep rolling until the universe blesses you with your actual birth date.
          </p>
        </div>

        {/* 4. Password with Ridiculous Rules */}
        <div className="bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <label className="block text-xs font-bold text-black uppercase mb-1">
            4. Ultra-Secure Password (The Impossible Gauntlet):
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => {
              playSound('beep');
              setPassword(e.target.value);
            }}
            placeholder="Type your password..."
            className="w-full bg-yellow-50 border-2 border-black p-2 font-mono text-sm tracking-widest focus:bg-lime-50 focus:outline-none mb-2"
          />

          <div className="space-y-1 font-mono text-[11px] bg-gray-50 p-2 border border-gray-300">
            <div className={`flex items-center gap-1.5 ${ruleLength ? 'text-green-700 font-bold' : 'text-red-600'}`}>
              {ruleLength ? '✓' : '✗'} Rule 1: Minimum 12 characters ({password.length}/12)
            </div>
            <div className={`flex items-center gap-1.5 ${ruleBangla ? 'text-green-700 font-bold' : 'text-red-600'}`}>
              {ruleBangla ? '✓' : '✗'} Rule 2: Must contain at least one Bengali letter (e.g., ক, খ, গ, আ)
            </div>
            <div className={`flex items-center gap-1.5 ${ruleNoE ? 'text-green-700 font-bold' : 'text-red-600'}`}>
              {ruleNoE ? '✓' : '✗'} Rule 3: Must NOT contain the letter &apos;E&apos; or &apos;e&apos; (Strictly Banned!)
            </div>
            <div className={`flex items-center gap-1.5 ${ruleEmoji ? 'text-green-700 font-bold' : 'text-red-600'}`}>
              {ruleEmoji ? '✓' : '✗'} Rule 4: Must contain at least one emoji (e.g., 🍕, 🚀, 💀)
            </div>
            <div className={`flex items-center gap-1.5 ${ruleSum42 ? 'text-green-700 font-bold' : 'text-red-600'}`}>
              {ruleSum42 ? '✓' : '✗'} Rule 5: The sum of all numbers in the password MUST equal exactly 42 (Current sum: {sumOfNumbers})
            </div>
          </div>
        </div>

        {/* 5. Terms and Conditions (Jumps away when unchecked) */}
        <div className="bg-yellow-300 p-3 border-2 border-black shadow-[3px_3px_0px_#000]">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                playSound(e.target.checked ? 'coin' : 'error');
                setAgreeTerms(e.target.checked);
              }}
              className="mt-0.5 w-4 h-4 accent-red-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-black">
              I certify that I have read the 4,200-page terms of service and hereby surrender my firstborn child, my Wi-Fi router password, and my dignity to this website.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 text-white font-['Press_Start_2P',monospace] text-xs md:text-sm py-4 px-8 border-4 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 cursor-pointer transition-transform"
          >
            🔥 SUBMIT APPLICATION TO OBLIVION 🔥
          </button>
        </div>
      </form>

      {/* Confirmation Trick Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-5 max-w-sm w-full shadow-[10px_10px_0px_#ff0055] font-['Comic_Neue',cursive]">
            <div className="bg-red-600 text-white p-2 font-bold text-center border-2 border-black mb-3">
              CONFIRMATION TRAP
            </div>
            <p className="text-sm font-bold text-black mb-4 text-center">
              Are you sure you do NOT want to abort canceling your submission? Click &quot;Cancel&quot; to submit or &quot;OK&quot; to cancel!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  playSound('win');
                  setShowConfirmModal(false);
                  onSuccessSubmit();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 font-bold border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Cancel (Submits Form)
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('error');
                  setShowConfirmModal(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 font-bold border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                OK (Cancels Everything)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
