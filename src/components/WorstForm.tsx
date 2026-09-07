import React, { useState, useId } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  ArrowRight,
  RefreshCw,
  Award,
  Globe,
  Zap,
} from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface WorstFormProps {
  onFormAction: () => void;
  onSuccessSubmit: () => void;
}

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dial: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dial: '+880' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dial: '+1' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dial: '+81' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial: '+44' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dial: '+49' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dial: '+971' },
];

export const WorstForm: React.FC<WorstFormProps> = ({ onFormAction, onSuccessSubmit }) => {
  const formId = useId();

  // Mode toggle: Creative UI/UX Masterpiece (Default) vs Nostalgic Chaos
  const [designMode, setDesignMode] = useState<'creative' | 'retro'>('creative');

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [preferredRole, setPreferredRole] = useState('Senior UI/UX Architect');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);

  // Retro Chaos mode legacy states
  const [rawChaosName, setRawChaosName] = useState('');
  const [chaosPhone, setChaosPhone] = useState<number>(5551234567);

  // Calculate password strength mathematically
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 15;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return Math.min(100, score);
  };

  const passwordScore = calculatePasswordStrength(password);
  const getStrengthLabel = (score: number) => {
    if (score === 0) return { text: 'Empty', color: 'bg-gray-700 text-gray-400' };
    if (score < 40) return { text: 'Weak', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (score < 75) return { text: 'Balanced', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    return { text: 'Cryptographic Grade', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const strengthMeta = getStrengthLabel(passwordScore);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('beep');
    onFormAction();
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    playSound('win');
    onFormAction();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionCompleted(true);
      setTimeout(() => {
        onSuccessSubmit();
      }, 900);
    }, 1200);
  };

  const handleSimulateBiometric = () => {
    playSound('coin');
    onFormAction();
    setBiometricVerified(true);
  };

  return (
    <section
      id="creative-registration-showcase"
      className="relative my-8 rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-b from-[#0e0f17] via-[#121422] to-[#0a0a10] text-neutral-100 shadow-2xl transition-all duration-300"
    >
      {/* Ambient subtle glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Creative UI/UX Badge & Mode Toggle */}
      <div className="border-b border-neutral-800/80 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-neutral-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[1.5px] shadow-md">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest font-black text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Award-Winning Craft
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Designed by Yasir Abed Rabbu
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>The Creative UI / UX Registration Experience</span>
            </h3>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-neutral-950/80 border border-neutral-800 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setDesignMode('creative');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              designMode === 'creative'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Studio</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('glitch');
              setDesignMode('retro');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              designMode === 'retro'
                ? 'bg-red-700 text-yellow-300 font-mono font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Classic Chaos</span>
          </button>
        </div>
      </div>

      {designMode === 'retro' ? (
        /* Retro Chaos Fallback with Bad Sliders for Nostalgia */
        <div className="p-6 bg-fuchsia-950/50 border-t border-red-500 font-mono text-xs space-y-4">
          <div className="p-3 bg-red-900/60 border border-red-500 text-red-200">
            ⚠️ <strong>NOSTALGIC CHAOS MODE ACTIVE:</strong> You are experiencing the unoptimized slider version. Switch back to &quot;Creative Studio&quot; for the professional UI/UX design.
          </div>
          <div>
            <label className="block text-yellow-300 font-bold mb-1">
              Sarcastic Name Input:
            </label>
            <input
              type="text"
              value={rawChaosName}
              onChange={(e) => {
                setRawChaosName(
                  e.target.value
                    .split('')
                    .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
                    .join('')
                );
              }}
              placeholder="Type name here..."
              className="w-full bg-neutral-900 border border-yellow-500 p-2 text-yellow-300 font-mono"
            />
          </div>
          <div>
            <div className="flex justify-between text-yellow-300 mb-1">
              <span>Phone Slider:</span>
              <span className="font-bold">{chaosPhone}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9999999999"
              value={chaosPhone}
              onChange={(e) => setChaosPhone(Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('win');
              onSuccessSubmit();
            }}
            className="w-full py-2 bg-yellow-400 text-black font-bold border border-black cursor-pointer shadow-md"
          >
            Submit in Chaos Mode
          </button>
        </div>
      ) : (
        /* Award-Winning Creative UI/UX Form Layout */
        <div className="p-4 sm:p-8 space-y-6">
          {/* Multi-Step Indicator */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl border text-left transition-all ${
                  currentStep === 1
                    ? 'border-amber-400/80 bg-amber-500/10 text-white'
                    : currentStep > 1
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-900/30 text-neutral-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 1
                      ? 'bg-amber-400 text-neutral-950'
                      : currentStep > 1
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold">Identity</div>
                  <div className="text-[10px] text-neutral-400">Profile & Role</div>
                </div>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl border text-left transition-all ${
                  currentStep === 2
                    ? 'border-amber-400/80 bg-amber-500/10 text-white'
                    : currentStep > 2
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                    : 'border-neutral-800 bg-neutral-900/30 text-neutral-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 2
                      ? 'bg-amber-400 text-neutral-950'
                      : currentStep > 2
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold">Contact</div>
                  <div className="text-[10px] text-neutral-400">Phone & DOB</div>
                </div>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl border text-left transition-all ${
                  currentStep === 3
                    ? 'border-amber-400/80 bg-amber-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-900/30 text-neutral-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === 3
                      ? 'bg-amber-400 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  3
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold">Security</div>
                  <div className="text-[10px] text-neutral-400">Credentials</div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleNextStep} className="max-w-2xl mx-auto space-y-6">
            {/* STEP 1: IDENTITY & PROFILE */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-neutral-800 pb-3">
                  <h4 className="text-sm font-semibold text-neutral-200">Personal Identity &amp; Aesthetic Persona</h4>
                  <p className="text-xs text-neutral-400">Provide your verified credentials to enter the official registry.</p>
                </div>

                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor={`${formId}-name`} className="block text-xs font-medium text-neutral-300">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      id={`${formId}-name`}
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        onFormAction();
                        setFullName(e.target.value);
                      }}
                      placeholder="e.g. Yasir Abed Rabbu"
                      className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>

                {/* Professional Role Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Primary Creative Specialization
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Principal UI/UX Designer',
                      'Full-Stack Systems Architect',
                      'Chaos Experience Critic',
                      'Digital Typography Enthusiast',
                    ].map((role) => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => {
                          playSound('click');
                          setPreferredRole(role);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          preferredRole === role
                            ? 'border-amber-400 bg-amber-500/10 text-amber-200 font-semibold shadow-xs'
                            : 'border-neutral-800 bg-neutral-950/50 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <span>{role}</span>
                        {preferredRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CONTACT & LOCATION */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-neutral-800 pb-3">
                  <h4 className="text-sm font-semibold text-neutral-200">Contact Channels &amp; Verification</h4>
                  <p className="text-xs text-neutral-400">Streamlined international routing with zero friction.</p>
                </div>

                {/* Phone Number with International Country Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Mobile Direct Terminal
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const found = COUNTRIES.find((c) => c.code === e.target.value);
                        if (found) setSelectedCountry(found);
                      }}
                      className="bg-neutral-950/70 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-neutral-900 text-white">
                          {c.flag} {c.code} ({c.dial})
                        </option>
                      ))}
                    </select>

                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="tel"
                        required
                        value={phoneDigits}
                        onChange={(e) => {
                          onFormAction();
                          setPhoneDigits(e.target.value.replace(/[^\d]/g, ''));
                        }}
                        placeholder="1712-345678"
                        className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Routing: {selectedCountry.dial} {phoneDigits || '...'}
                  </span>
                </div>

                {/* Date of Birth Picker */}
                <div className="space-y-1.5">
                  <label htmlFor={`${formId}-dob`} className="block text-xs font-medium text-neutral-300">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      id={`${formId}-dob`}
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => {
                        onFormAction();
                        setBirthDate(e.target.value);
                      }}
                      className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SECURITY & BIOMETRIC CONFIRMATION */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-neutral-800 pb-3">
                  <h4 className="text-sm font-semibold text-neutral-200">Cryptographic Security &amp; Biometrics</h4>
                  <p className="text-xs text-neutral-400">Enterprise-grade credentials with live entropy evaluation.</p>
                </div>

                {/* Password Input with live strength */}
                <div className="space-y-2">
                  <label htmlFor={`${formId}-password`} className="block text-xs font-medium text-neutral-300">
                    Master Encryption Key / Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      id={`${formId}-password`}
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        onFormAction();
                        setPassword(e.target.value);
                      }}
                      placeholder="Minimum 12 characters, symbols, numbers"
                      className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Security Entropy</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${strengthMeta.color}`}>
                        {strengthMeta.text} ({passwordScore}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 transition-all duration-300 rounded-full"
                        style={{ width: `${passwordScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Biometric Scan Simulation */}
                <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                        biometricVerified
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                      }`}
                    >
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Biometric Passkey Validation</div>
                      <div className="text-[11px] text-neutral-400">
                        {biometricVerified ? 'Verified instantly via client hardware key' : 'Tap to simulate WebAuthn passkey'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateBiometric}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      biometricVerified
                        ? 'bg-emerald-500 text-neutral-950 font-bold border-emerald-400'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                    }`}
                  >
                    {biometricVerified ? 'Verified ✓' : 'Scan Fingerprint'}
                  </button>
                </div>

                {/* Terms agreement */}
                <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 accent-amber-400"
                  />
                  <span>
                    I accept the creative design standards and certify survival of this website.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation / Action Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-all cursor-pointer"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting || submissionCompleted}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Credentials...</span>
                  </>
                ) : submissionCompleted ? (
                  <>
                    <Award className="w-4 h-4 text-neutral-950" />
                    <span>Certified! Opening Diploma...</span>
                  </>
                ) : currentStep < 3 ? (
                  <>
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete &amp; Claim Guinness Certificate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
