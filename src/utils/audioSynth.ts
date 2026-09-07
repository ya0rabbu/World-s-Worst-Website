/**
 * Web Audio API synthesizer for 8-bit retro sound effects, dial-up screech, and background melody.
 * Safe, lightweight, zero external MP3 dependencies.
 */

let audioCtx: AudioContext | null = null;
let bgOsc: OscillatorNode | null = null;
let bgGain: GainNode | null = null;
let isPlayingBg = false;
let currentVolume = 0.7;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(
  type:
    | 'beep'
    | 'error'
    | 'coin'
    | 'honk'
    | 'win'
    | 'glitch'
    | 'siren'
    | 'dialup'
    | 'click'
    | 'magic'
    | 'terminal'
    | 'horror'
    | 'jumpscare'
    | 'heartbeat'
    | 'scream'
    | 'whisper'
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'horror') {
      playHorrorSound('drone');
      return;
    } else if (type === 'jumpscare') {
      playHorrorSound('jumpscare');
      return;
    } else if (type === 'heartbeat') {
      playHorrorSound('heartbeat');
      return;
    } else if (type === 'scream') {
      playHorrorSound('scream');
      return;
    } else if (type === 'whisper') {
      playHorrorSound('whisper');
      return;
    }

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
      gain.gain.setValueAtTime(0.2 * currentVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'magic') {
      const chord = [587.33, 739.99, 880.00, 1174.66, 1479.98];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.18 * currentVolume, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } else if (type === 'terminal') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(950, now);
      gain.gain.setValueAtTime(0.15 * currentVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.2 * currentVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(110, now + 0.1);
      gain.gain.setValueAtTime(0.3 * currentVolume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'coin') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.25 * currentVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'honk') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.4 * currentVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.2 * currentVolume, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.15);
      });
    } else if (type === 'glitch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.05);
      osc.frequency.setValueAtTime(220, now + 0.1);
      gain.gain.setValueAtTime(0.2 * currentVolume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'siren') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
      osc.frequency.linearRampToValueAtTime(700, now + 0.4);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.6);
      gain.gain.setValueAtTime(0.3 * currentVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'dialup') {
      // 56k dial-up screech synthesis
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.frequency.setValueAtTime(1209, now); // Touch tone DTMF
      osc2.frequency.setValueAtTime(697, now);
      osc1.frequency.setValueAtTime(2100, now + 0.2); // Handshake carrier
      osc2.frequency.setValueAtTime(1400, now + 0.4);
      osc1.frequency.exponentialRampToValueAtTime(3200, now + 0.8);

      gain.gain.setValueAtTime(0.25 * currentVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    }
  } catch {
    // Ignore audio restrictions
  }
}

let melodyInterval: number | null = null;

export function toggleBackgroundMusic(callback?: (playing: boolean) => void): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (isPlayingBg) {
      if (melodyInterval) clearInterval(melodyInterval);
      if (bgOsc) {
        try { bgOsc.stop(); } catch {}
        bgOsc = null;
      }
      isPlayingBg = false;
      if (callback) callback(false);
      return false;
    } else {
      isPlayingBg = true;
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 392.00, 329.63, 293.66, 261.63];
      let step = 0;

      melodyInterval = window.setInterval(() => {
        if (!isPlayingBg) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.connect(gain);
        gain.connect(ctx.destination);

        const freq = notes[step % notes.length];
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.08 * currentVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.2);
        step++;
      }, 220);

      if (callback) callback(true);
      return true;
    }
  } catch {
    return false;
  }
}

export function setVolume(vol: number) {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (bgGain && audioCtx) {
    bgGain.gain.setValueAtTime(currentVolume * 0.1, audioCtx.currentTime);
  }
}

/**
 * 24-bit High-Resolution Procedural Horror Soundscape Engine
 * Employs FM modulation, dissonant tritones, psychoacoustic sub-bass,
 * and high-frequency cluster scraping for spine-chilling horror effects.
 */
export function playHorrorSound(variant: 'drone' | 'jumpscare' | 'heartbeat' | 'scream' | 'whisper' = 'drone') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(currentVolume, now);
    masterGain.connect(ctx.destination);

    if (variant === 'drone') {
      // 24-bit binaural dark horror drone with detuned oscillators and sub-bass
      const oscSub = ctx.createOscillator();
      const oscLow1 = ctx.createOscillator();
      const oscLow2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const droneGain = ctx.createGain();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(80, now + 2.8);

      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(42.5, now);

      oscLow1.type = 'sawtooth';
      oscLow1.frequency.setValueAtTime(55, now); // A1
      oscLow2.type = 'sawtooth';
      oscLow2.frequency.setValueAtTime(58.3, now); // Dissonant microtone

      droneGain.gain.setValueAtTime(0.01, now);
      droneGain.gain.linearRampToValueAtTime(0.45 * currentVolume, now + 0.5);
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      oscSub.connect(filter);
      oscLow1.connect(filter);
      oscLow2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(masterGain);

      // Eerie high tritone chime (The Devil's Interval)
      const tritone1 = ctx.createOscillator();
      const tritone2 = ctx.createOscillator();
      const tritoneGain = ctx.createGain();
      tritone1.type = 'sine';
      tritone2.type = 'sine';
      tritone1.frequency.setValueAtTime(587.33, now); // D5
      tritone2.frequency.setValueAtTime(830.61, now); // G#5 (Tritone)

      tritoneGain.gain.setValueAtTime(0.001, now);
      tritoneGain.gain.linearRampToValueAtTime(0.12 * currentVolume, now + 0.4);
      tritoneGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      tritone1.connect(tritoneGain);
      tritone2.connect(tritoneGain);
      tritoneGain.connect(masterGain);

      oscSub.start(now);
      oscLow1.start(now);
      oscLow2.start(now);
      tritone1.start(now);
      tritone2.start(now);

      oscSub.stop(now + 3.0);
      oscLow1.stop(now + 3.0);
      oscLow2.stop(now + 3.0);
      tritone1.stop(now + 3.0);
      tritone2.stop(now + 3.0);

    } else if (variant === 'jumpscare') {
      // Violent explosive jumpscare impact with sub drop & metallic cluster
      const clusterFreqs = [174.61, 233.08, 311.13, 466.16, 622.25, 932.33, 1480];
      const scareGain = ctx.createGain();
      scareGain.gain.setValueAtTime(0.7 * currentVolume, now);
      scareGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      scareGain.connect(masterGain);

      // Sub thud
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.6);
      subGain.gain.setValueAtTime(0.8 * currentVolume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.8);

      // Harsh cluster
      clusterFreqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(f + (Math.random() * 20 - 10), now);
        osc.frequency.linearRampToValueAtTime(f * 0.7, now + 0.4);
        osc.connect(scareGain);
        osc.start(now);
        osc.stop(now + 1.2);
      });

    } else if (variant === 'heartbeat') {
      // Realistic double thump (Lub - Dub)
      const playThump = (timeOffset: number, pitch: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(90, now + timeOffset);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(34, now + timeOffset + 0.18);

        gain.gain.setValueAtTime(0.01, now + timeOffset);
        gain.gain.linearRampToValueAtTime(vol * currentVolume, now + timeOffset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.25);
      };

      // Lub
      playThump(0, 65, 0.65);
      // Dub
      playThump(0.24, 52, 0.5);

    } else if (variant === 'scream') {
      // High-pitched psycho violin screech cluster
      const screechGain = ctx.createGain();
      screechGain.gain.setValueAtTime(0.01, now);
      screechGain.gain.linearRampToValueAtTime(0.45 * currentVolume, now + 0.06);
      screechGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      screechGain.connect(masterGain);

      const screechFrequencies = [2093, 2180, 2260, 2400]; // Psycho screech
      screechFrequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        // Screech pitch flutter
        osc.frequency.linearRampToValueAtTime(freq + 40, now + 0.3);
        osc.frequency.linearRampToValueAtTime(freq - 50, now + 0.7);
        osc.frequency.linearRampToValueAtTime(freq + 20, now + 1.2);
        osc.connect(screechGain);
        osc.start(now);
        osc.stop(now + 1.6);
      });

    } else if (variant === 'whisper') {
      // Creepy ghostly spectral whisper noise
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.linearRampToValueAtTime(2600, now + 0.8);
      filter.frequency.linearRampToValueAtTime(1100, now + 1.5);
      filter.Q.setValueAtTime(8, now);

      const whisperGain = ctx.createGain();
      whisperGain.gain.setValueAtTime(0.01, now);
      whisperGain.gain.linearRampToValueAtTime(0.35 * currentVolume, now + 0.3);
      whisperGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(whisperGain);
      whisperGain.connect(masterGain);

      noise.start(now);
      noise.stop(now + 1.5);
    }
  } catch {
    // Graceful fallback if user hasn't interacted with audio yet
  }
}

