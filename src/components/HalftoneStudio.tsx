import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Download,
  Upload,
  Terminal as TerminalIcon,
  Copy,
  Check,
  Play,
  Sliders,
  Image as ImageIcon,
  Zap,
  Film,
  Camera,
  RefreshCw,
  RotateCw,
  Sun,
  Contrast as ContrastIcon,
  Layers,
  Palette,
  Eye,
  Columns,
  Cpu,
  FileCode,
  Flame,
  Radio,
  Monitor,
  Share2,
} from 'lucide-react';
import { playSound } from '../utils/audioSynth';

import sampleRickshaw from '../assets/images/bd_viral_traffic_1788758465436.jpg';
import sampleBiryani from '../assets/images/bd_viral_biryani_1788758485864.jpg';
import sampleBridge from '../assets/images/bd_viral_padma_bridge_1788758522959.jpg';
import sampleTea from '../assets/images/bd_viral_tea_stall_1788758506463.jpg';
import sampleServer from '../assets/images/cursed_server_disaster_1788755308246.jpg';

interface HalftoneStudioProps {
  onAwardXp?: (amount: number, reason: string) => void;
}

export type FilterPreset =
  | 'halftone-dots'
  | 'comic-cmyk'
  | 'retro-8bit'
  | 'cinematic-noir'
  | 'cyber-glitch'
  | 'thermal-flir'
  | 'blueprint-cyan'
  | 'ascii-matrix'
  | 'sobel-neon'
  | 'risograph-duo'
  | 'crosshatch-engraving'
  | 'bayer-dither';

export type PaletteOption =
  | 'default'
  | 'cmyk'
  | 'gameboy'
  | 'cyberpunk'
  | 'amber'
  | 'matrix'
  | 'risograph'
  | 'thermal'
  | 'sepia';

interface PresetMeta {
  id: FilterPreset;
  name: string;
  category: string;
  badge: string;
  desc: string;
}

const PRESET_LIST: PresetMeta[] = [
  {
    id: 'halftone-dots',
    name: 'Newspaper Halftone',
    category: 'Print & Dither',
    badge: 'Classic PIL',
    desc: 'Vintage rotary press dotted ink matrix with screen angle',
  },
  {
    id: 'comic-cmyk',
    name: 'Pop-Art CMYK',
    category: 'Print & Dither',
    badge: 'Lichtenstein',
    desc: 'Four-color process CMYK dot rosettes separation',
  },
  {
    id: 'bayer-dither',
    name: 'Bayer 8x8 Dither',
    category: 'Print & Dither',
    badge: 'Retro 1-Bit',
    desc: 'Ordered spatial error diffusion matrix algorithm',
  },
  {
    id: 'crosshatch-engraving',
    name: 'Currency Crosshatch',
    category: 'Print & Dither',
    badge: 'Banknote',
    desc: '19th century copperplate steel engraving lines',
  },
  {
    id: 'risograph-duo',
    name: 'Risograph Duotone',
    category: 'Print & Dither',
    badge: 'Tokyo Print',
    desc: 'Organic spot-color stencil ink offset with tooth',
  },
  {
    id: 'retro-8bit',
    name: '8-Bit Retro CRT',
    category: 'Retro & Arcade',
    badge: 'Commodore/NES',
    desc: 'Indexed palette quantization with phosphor scanlines',
  },
  {
    id: 'ascii-matrix',
    name: 'ASCII Matrix Terminal',
    category: 'Retro & Arcade',
    badge: 'VT100 Console',
    desc: 'Raster to ASCII character glyph luminance mapping',
  },
  {
    id: 'cinematic-noir',
    name: '35mm Film Noir',
    category: 'Cinema & Analog',
    badge: 'Silver Halide',
    desc: 'S-curve dynamic monochrome, film grain & letterbox',
  },
  {
    id: 'cyber-glitch',
    name: 'Cyberpunk Matrix',
    category: 'Glitch & Sci-Fi',
    badge: 'RGB Split',
    desc: 'Chromatic aberration, VHS tear slices & digital scan',
  },
  {
    id: 'thermal-flir',
    name: 'Thermal FLIR Heatmap',
    category: 'Glitch & Sci-Fi',
    badge: 'Infrared',
    desc: 'Ironbow military night-vision false color spectrum',
  },
  {
    id: 'blueprint-cyan',
    name: 'Blueprint Cyanotype',
    category: 'Architectural',
    badge: 'Prussian Blue',
    desc: '1840s sun print draft with drafting gridlines',
  },
  {
    id: 'sobel-neon',
    name: 'Sobel Neon Glow',
    category: 'Computer Vision',
    badge: 'OpenCV Sobel',
    desc: 'Mathematical gradient contour edge detection & neon emission',
  },
];

const PALETTES: { id: PaletteOption; name: string; colors: string[] }[] = [
  { id: 'default', name: 'Standard / Monochrome', colors: ['#0a0a0f', '#f5f5f5'] },
  { id: 'cmyk', name: 'Pop Comic (CMYK)', colors: ['#00FFFF', '#FF00FF', '#FFFF00', '#000000'] },
  { id: 'gameboy', name: 'Game Boy DMG-01', colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'] },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', colors: ['#050510', '#00f0ff', '#ff0077', '#ffe600'] },
  { id: 'amber', name: 'Amber Phosphor CRT', colors: ['#100a00', '#ffb000', '#ff7700'] },
  { id: 'matrix', name: 'Matrix Emerald', colors: ['#001100', '#00ff66', '#003300'] },
  { id: 'risograph', name: 'Risograph Pink & Navy', colors: ['#0a1428', '#ff2a85', '#f4ede2'] },
  { id: 'thermal', name: 'Thermal Ironbow', colors: ['#000022', '#7700ff', '#ff3300', '#ffff55'] },
  { id: 'sepia', name: '1890s Daguerreotype Sepia', colors: ['#28180c', '#b3824f', '#ebd6b5'] },
];

const SAMPLE_IMAGES = [
  { id: 'rickshaw', name: '🇧🇩 Rickshaw Art', src: sampleRickshaw },
  { id: 'biryani', name: '🍲 Kacchi Biryani', src: sampleBiryani },
  { id: 'bridge', name: '🌉 Padma Bridge', src: sampleBridge },
  { id: 'tea', name: '☕ Tong Tea Stall', src: sampleTea },
  { id: 'server', name: '💾 Retro Server', src: sampleServer },
];

export const HalftoneStudio: React.FC<HalftoneStudioProps> = ({ onAwardXp }) => {
  // Preset & Customization State
  const [selectedPreset, setSelectedPreset] = useState<FilterPreset>('halftone-dots');
  const [palette, setPalette] = useState<PaletteOption>('default');
  const [dotPitch, setDotPitch] = useState<number>(10);
  const [screenAngle, setScreenAngle] = useState<number>(45);
  const [contrast, setContrast] = useState<number>(1.2);
  const [brightness, setBrightness] = useState<number>(1.0);
  const [saturation, setSaturation] = useState<number>(1.0);
  const [grainIntensity, setGrainIntensity] = useState<number>(25);
  const [scanlineIntensity, setScanlineIntensity] = useState<number>(40);
  const [chromaticOffset, setChromaticOffset] = useState<number>(6);
  const [vignette, setVignette] = useState<number>(30);
  const [invert, setInvert] = useState<boolean>(false);
  const [letterbox, setLetterbox] = useState<'none' | 'cinematic' | 'widescreen' | 'square'>('none');
  const [paperTexture, setPaperTexture] = useState<boolean>(true);

  // UI Modes
  const [activeTab, setActiveTab] = useState<'canvas' | 'python' | 'telemetry'>('canvas');
  const [viewMode, setViewMode] = useState<'filtered' | 'original' | 'split'>('filtered');
  const [splitRatio, setSplitRatio] = useState<number>(50);

  // Backend Python Execution State
  const [isPythonRunning, setIsPythonRunning] = useState<boolean>(false);
  const [pythonStats, setPythonStats] = useState<{
    execution_time_ms: number;
    pixels_processed: number;
    python_version: string;
    algorithm: string;
  } | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Python 3.10.12 Image Kernel Engine initialized [ONLINE]',
    'Ready to compile image effects via CPU/GPU mathematical rasterizer.',
  ]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load Initial Image
  useEffect(() => {
    const img = new Image();
    img.src = sampleRickshaw;
    img.onload = () => {
      originalImageRef.current = img;
      renderCanvas();
    };
  }, []);

  // Re-render canvas when parameters change
  useEffect(() => {
    if (originalImageRef.current) {
      renderCanvas();
    }
  }, [
    selectedPreset,
    palette,
    dotPitch,
    screenAngle,
    contrast,
    brightness,
    saturation,
    grainIntensity,
    scanlineIntensity,
    chromaticOffset,
    vignette,
    invert,
    letterbox,
    paperTexture,
    viewMode,
    splitRatio,
  ]);

  const selectSample = (src: string, name: string) => {
    playSound('coin');
    const img = new Image();
    img.src = src;
    img.onload = () => {
      originalImageRef.current = img;
      renderCanvas();
      if (onAwardXp) onAwardXp(15, `Loaded sample: ${name}`);
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound('coin');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        originalImageRef.current = img;
        renderCanvas();
        if (onAwardXp) onAwardXp(30, 'Uploaded custom image to Halftone Studio');
      };
    };
    reader.readAsDataURL(file);
  };

  // Helper color transform
  const adjustRGB = (r: number, g: number, b: number) => {
    // Brightness
    let ar = r * brightness;
    let ag = g * brightness;
    let ab = b * brightness;

    // Contrast
    if (contrast !== 1.0) {
      ar = ((ar / 255 - 0.5) * contrast + 0.5) * 255;
      ag = ((ag / 255 - 0.5) * contrast + 0.5) * 255;
      ab = ((ab / 255 - 0.5) * contrast + 0.5) * 255;
    }

    // Saturation
    if (saturation !== 1.0) {
      const gray = 0.299 * ar + 0.587 * ag + 0.114 * ab;
      ar = gray + (ar - gray) * saturation;
      ag = gray + (ag - gray) * saturation;
      ab = gray + (ab - gray) * saturation;
    }

    ar = Math.max(0, Math.min(255, ar));
    ag = Math.max(0, Math.min(255, ag));
    ab = Math.max(0, Math.min(255, ab));

    let lum = 0.299 * ar + 0.587 * ag + 0.114 * ab;
    if (invert) {
      lum = 255 - lum;
      ar = 255 - ar;
      ag = 255 - ag;
      ab = 255 - ab;
    }

    return { r: ar, g: ag, b: ab, lum };
  };

  // Main Canvas Rendering Engine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scaled dimensions for smooth real-time rendering
    const maxDim = 540;
    let width = img.width;
    let height = img.height;
    if (width > height) {
      if (width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      }
    } else {
      if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;

    // Offscreen canvas for raw pixel extraction
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.drawImage(img, 0, 0, width, height);
    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // If pure "original" view mode
    if (viewMode === 'original') {
      ctx.drawImage(offCanvas, 0, 0);
      return;
    }

    // Default background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // 1. Newspaper Halftone
    if (selectedPreset === 'halftone-dots') {
      const step = Math.max(4, dotPitch);
      const radAngle = (screenAngle * Math.PI) / 180;
      const cosA = Math.cos(radAngle);
      const sinA = Math.sin(radAngle);

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const { lum } = adjustRGB(data[index], data[index + 1], data[index + 2]);
          const norm = lum / 255;
          const radius = (1 - norm) * (step / 1.7);

          if (radius > 0.5) {
            ctx.save();
            ctx.translate(x + step / 2, y + step / 2);
            ctx.rotate(radAngle);
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);

            // Palette application
            if (palette === 'gameboy') {
              ctx.fillStyle = '#8bac0f';
            } else if (palette === 'amber') {
              ctx.fillStyle = '#ffb000';
            } else if (palette === 'matrix') {
              ctx.fillStyle = '#00ff66';
            } else if (palette === 'cyberpunk') {
              ctx.fillStyle = '#00f0ff';
            } else if (palette === 'sepia') {
              ctx.fillStyle = '#ebd6b5';
            } else {
              ctx.fillStyle = '#f5f5f5';
            }
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }

    // 2. Pop-Art CMYK
    else if (selectedPreset === 'comic-cmyk') {
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, width, height);
      const step = Math.max(5, dotPitch);

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          const { r, g, b } = adjustRGB(data[idx], data[idx + 1], data[idx + 2]);

          const c = (255 - r) / 255;
          const m = (255 - g) / 255;
          const yCol = (255 - b) / 255;

          const radC = c * (step / 2.2);
          const radM = m * (step / 2.2);
          const radY = yCol * (step / 2.2);

          // Cyan dot
          if (radC > 0.4) {
            ctx.beginPath();
            ctx.arc(x + step / 2 - 1.5, y + step / 2 - 1.5, radC, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 220, 255, 0.75)';
            ctx.fill();
          }

          // Magenta dot
          if (radM > 0.4) {
            ctx.beginPath();
            ctx.arc(x + step / 2 + 1.5, y + step / 2 - 1.5, radM, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 20, 147, 0.75)';
            ctx.fill();
          }

          // Yellow dot
          if (radY > 0.4) {
            ctx.beginPath();
            ctx.arc(x + step / 2, y + step / 2 + 1.5, radY, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 220, 0, 0.75)';
            ctx.fill();
          }
        }
      }
    }

    // 3. 8-Bit Retro CRT
    else if (selectedPreset === 'retro-8bit') {
      const psize = Math.max(3, Math.round(dotPitch / 2));
      for (let y = 0; y < height; y += psize) {
        for (let x = 0; x < width; x += psize) {
          const index = (y * width + x) * 4;
          const { r, g, b } = adjustRGB(data[index], data[index + 1], data[index + 2]);

          let qr = Math.floor(r / 32) * 32;
          let qg = Math.floor(g / 32) * 32;
          let qb = Math.floor(b / 32) * 32;

          if (palette === 'gameboy') {
            const avg = (qr + qg + qb) / 3;
            if (avg < 64) {
              ctx.fillStyle = '#0f380f';
            } else if (avg < 128) {
              ctx.fillStyle = '#306230';
            } else if (avg < 192) {
              ctx.fillStyle = '#8bac0f';
            } else {
              ctx.fillStyle = '#9bbc0f';
            }
          } else {
            ctx.fillStyle = `rgb(${qr}, ${qg}, ${qb})`;
          }
          ctx.fillRect(x, y, psize, psize);
        }
      }

      // CRT Scanlines
      if (scanlineIntensity > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${scanlineIntensity / 100})`;
        for (let y = 0; y < height; y += 3) {
          ctx.fillRect(0, y, width, 1.2);
        }
      }
    }

    // 4. 35mm Film Noir
    else if (selectedPreset === 'cinematic-noir') {
      const outData = ctx.createImageData(width, height);
      const out = outData.data;

      for (let i = 0; i < data.length; i += 4) {
        const { lum } = adjustRGB(data[i], data[i + 1], data[i + 2]);
        const noise = (Math.random() - 0.5) * grainIntensity * 2;
        const val = Math.max(0, Math.min(255, lum + noise));

        if (palette === 'sepia') {
          out[i] = val * 0.9;
          out[i + 1] = val * 0.75;
          out[i + 2] = val * 0.55;
        } else {
          // Cool silver halide
          out[i] = val * 0.95;
          out[i + 1] = val;
          out[i + 2] = val * 1.06;
        }
        out[i + 3] = 255;
      }
      ctx.putImageData(outData, 0, 0);
    }

    // 5. Cyberpunk Matrix Glitch
    else if (selectedPreset === 'cyber-glitch') {
      ctx.drawImage(offCanvas, 0, 0);

      // Chromatic aberration
      const offset = Math.max(2, chromaticOffset);
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(offCanvas, -offset, 0);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(offCanvas, offset, 0);
      ctx.fillStyle = 'rgba(255, 0, 120, 0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      // Digital horizontal tears
      for (let i = 0; i < 5; i++) {
        const sy = Math.floor(Math.random() * height);
        const sh = Math.floor(Math.random() * 14) + 4;
        const shift = (Math.random() - 0.5) * 35;
        ctx.drawImage(canvas, 0, sy, width, sh, shift, sy, width, sh);
      }
    }

    // 6. Thermal FLIR Heatmap
    else if (selectedPreset === 'thermal-flir') {
      const outData = ctx.createImageData(width, height);
      const out = outData.data;

      for (let i = 0; i < data.length; i += 4) {
        const { lum } = adjustRGB(data[i], data[i + 1], data[i + 2]);
        const t = lum / 255;
        let r = 0;
        let g = 0;
        let b = 0;

        if (t < 0.2) {
          const f = t / 0.2;
          r = Math.floor(30 * f);
          g = 0;
          b = Math.floor(140 * f);
        } else if (t < 0.4) {
          const f = (t - 0.2) / 0.2;
          r = Math.floor(30 + 10 * f);
          g = Math.floor(180 * f);
          b = Math.floor(140 + 115 * f);
        } else if (t < 0.65) {
          const f = (t - 0.4) / 0.25;
          r = Math.floor(40 + 215 * f);
          g = Math.floor(180 + 40 * f);
          b = Math.floor(255 * (1 - f));
        } else if (t < 0.85) {
          const f = (t - 0.65) / 0.2;
          r = 255;
          g = Math.floor(220 * (1 - f));
          b = 0;
        } else {
          const f = (t - 0.85) / 0.15;
          r = 255;
          g = Math.floor(255 * f);
          b = Math.floor(255 * f);
        }

        out[i] = r;
        out[i + 1] = g;
        out[i + 2] = b;
        out[i + 3] = 255;
      }
      ctx.putImageData(outData, 0, 0);
    }

    // 7. Blueprint Cyanotype
    else if (selectedPreset === 'blueprint-cyan') {
      const outData = ctx.createImageData(width, height);
      const out = outData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const { lum } = adjustRGB(data[i], data[i + 1], data[i + 2]);
          const val = lum / 255;

          const isGrid = x % 20 === 0 || y % 20 === 0;
          const bonus = isGrid ? 35 : 0;

          out[i] = Math.min(255, Math.floor(15 + val * 240 + bonus));
          out[i + 1] = Math.min(255, Math.floor(40 + val * 215 + bonus));
          out[i + 2] = Math.min(255, Math.floor(95 + val * 160 + bonus));
          out[i + 3] = 255;
        }
      }
      ctx.putImageData(outData, 0, 0);
    }

    // 8. ASCII Matrix
    else if (selectedPreset === 'ascii-matrix') {
      ctx.fillStyle = '#050a05';
      ctx.fillRect(0, 0, width, height);

      const block = Math.max(6, dotPitch);
      const chars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];
      ctx.font = `bold ${block}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < height; y += block) {
        for (let x = 0; x < width; x += block) {
          let sum = 0;
          let count = 0;
          for (let dy = 0; dy < block && y + dy < height; dy++) {
            for (let dx = 0; dx < block && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              const { lum } = adjustRGB(data[idx], data[idx + 1], data[idx + 2]);
              sum += lum;
              count++;
            }
          }
          const avg = sum / (count || 1);
          const charIndex = Math.min(chars.length - 1, Math.floor((avg / 255) * chars.length));
          const char = chars[charIndex];

          if (char !== ' ') {
            if (palette === 'amber') {
              ctx.fillStyle = avg > 180 ? '#ffcc00' : '#ff8800';
            } else if (palette === 'cyberpunk') {
              ctx.fillStyle = avg > 180 ? '#00ffff' : '#ff00aa';
            } else {
              ctx.fillStyle = avg > 180 ? '#00ff66' : '#009933';
            }
            ctx.fillText(char, x + block / 2, y + block / 2);
          }
        }
      }
    }

    // 9. Sobel Neon Glow
    else if (selectedPreset === 'sobel-neon') {
      const outData = ctx.createImageData(width, height);
      const out = outData.data;

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let gx = 0;
          let gy = 0;

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              const { lum } = adjustRGB(data[idx], data[idx + 1], data[idx + 2]);
              const wx = dx * (dy === 0 ? 2 : 1);
              const wy = dy * (dx === 0 ? 2 : 1);
              gx += lum * wx;
              gy += lum * wy;
            }
          }
          const edge = Math.min(255, Math.round(Math.sqrt(gx * gx + gy * gy) * (contrast * 0.7)));
          const i = (y * width + x) * 4;

          if (palette === 'cyberpunk') {
            out[i] = Math.min(255, edge * 1.3);
            out[i + 1] = edge * 0.2;
            out[i + 2] = Math.min(255, edge * 1.5);
          } else {
            out[i] = edge * 0.2;
            out[i + 1] = Math.min(255, edge * 1.2);
            out[i + 2] = Math.min(255, edge * 1.4);
          }
          out[i + 3] = 255;
        }
      }
      ctx.putImageData(outData, 0, 0);
    }

    // 10. Risograph Duotone
    else if (selectedPreset === 'risograph-duo') {
      const outData = ctx.createImageData(width, height);
      const out = outData.data;

      for (let i = 0; i < data.length; i += 4) {
        const { lum } = adjustRGB(data[i], data[i + 1], data[i + 2]);
        const norm = lum / 255;

        // Spot Color 1 (Fluorescent Pink: 255, 42, 133) & Spot Color 2 (Tokyo Navy: 10, 20, 40)
        out[i] = Math.floor(norm * 255 + (1 - norm) * 15);
        out[i + 1] = Math.floor(norm * 42 + (1 - norm) * 35);
        out[i + 2] = Math.floor(norm * 133 + (1 - norm) * 120);
        out[i + 3] = 255;
      }
      ctx.putImageData(outData, 0, 0);
    }

    // 11. Currency Crosshatch Engraving
    else if (selectedPreset === 'crosshatch-engraving') {
      ctx.fillStyle = '#f6f3eb';
      ctx.fillRect(0, 0, width, height);
      const step = Math.max(4, dotPitch);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const { lum } = adjustRGB(data[idx], data[idx + 1], data[idx + 2]);

          let ink = false;
          if (lum < 210 && (x + y) % step === 0) ink = true;
          if (lum < 150 && (x - y) % step === 0) ink = true;
          if (lum < 95 && x % step === 0) ink = true;
          if (lum < 45 && y % step === 0) ink = true;

          if (ink) {
            ctx.fillStyle = '#1c2228';
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }

    // 12. Bayer 8x8 Ordered Dither
    else if (selectedPreset === 'bayer-dither') {
      const bayer8 = [
        [0, 32, 8, 40, 2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44, 4, 36, 14, 46, 6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [3, 35, 11, 43, 1, 33, 9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47, 7, 39, 13, 45, 5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21],
      ];

      const outData = ctx.createImageData(width, height);
      const out = outData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const { lum } = adjustRGB(data[i], data[i + 1], data[i + 2]);
          const threshold = (bayer8[y % 8][x % 8] / 64) * 255;
          const pixelVal = lum > threshold ? 255 : 0;

          if (palette === 'gameboy') {
            out[i] = pixelVal ? 155 : 15;
            out[i + 1] = pixelVal ? 188 : 56;
            out[i + 2] = pixelVal ? 15 : 15;
          } else {
            out[i] = pixelVal;
            out[i + 1] = pixelVal;
            out[i + 2] = pixelVal;
          }
          out[i + 3] = 255;
        }
      }
      ctx.putImageData(outData, 0, 0);
    }

    // Vignette Post-Process
    if (vignette > 0) {
      const cx = width / 2;
      const cy = height / 2;
      const rad = Math.sqrt(cx * cx + cy * cy);
      const grad = ctx.createRadialGradient(cx, cy, rad * (1 - vignette / 100), cx, cy, rad);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(0,0,0,${(vignette / 100) * 0.95})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Letterbox Bars
    if (letterbox === 'cinematic') {
      const barH = Math.round(height * 0.09);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, barH);
      ctx.fillRect(0, height - barH, width, barH);
    } else if (letterbox === 'widescreen') {
      const barH = Math.round(height * 0.05);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, barH);
      ctx.fillRect(0, height - barH, width, barH);
    }

    // Paper Texture grain overlay
    if (paperTexture) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < 400; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        ctx.fillRect(rx, ry, 1, 1);
      }
    }

    // Side-by-Side Split View
    if (viewMode === 'split') {
      const splitX = Math.round((width * splitRatio) / 100);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();
      ctx.drawImage(offCanvas, 0, 0);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();
    }
  }, [
    selectedPreset,
    palette,
    dotPitch,
    screenAngle,
    contrast,
    brightness,
    saturation,
    grainIntensity,
    scanlineIntensity,
    chromaticOffset,
    vignette,
    invert,
    letterbox,
    paperTexture,
    viewMode,
    splitRatio,
  ]);

  // Execute Real Python 3.10 Backend Process
  const handleRunPythonBackend = async () => {
    playSound('dialup');
    setIsPythonRunning(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    setTerminalLogs((prev) => [
      `>>> [INVOKE] Dispatching request to Python 3.10 backend kernel...`,
      `>>> Effect: ${selectedPreset} | Pitch: ${dotPitch}px | Angle: ${screenAngle}°`,
      `>>> Palette: ${palette} | Resolution: ${canvas.width}x${canvas.height}`,
    ]);

    try {
      // Extract raw RGBA bytes as base64
      const ctx = canvas.getContext('2d');
      const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      let rawB64 = '';
      if (imgData) {
        let binary = '';
        const bytes = new Uint8Array(imgData.data.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        rawB64 = btoa(binary);
      }

      const payload = {
        effect: selectedPreset,
        width: canvas.width,
        height: canvas.height,
        pixels_rgba_b64: rawB64,
        params: {
          dotPitch,
          screenAngle,
          contrast,
          brightness,
          grainIntensity,
          palette,
          invert,
          vignette: vignette / 100,
        },
      };

      const res = await fetch('/api/python/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = await res.json();
      setPythonStats({
        execution_time_ms: result.execution_time_ms,
        pixels_processed: result.pixels_processed,
        python_version: result.python_version || 'Python 3.10',
        algorithm: result.algorithm || selectedPreset,
      });

      // Load generated BMP into canvas
      if (result.bmp_data_url) {
        const bmpImg = new Image();
        bmpImg.onload = () => {
          ctx?.drawImage(bmpImg, 0, 0);
        };
        bmpImg.src = result.bmp_data_url;
      }

      setTerminalLogs((prev) => [
        ...prev,
        `>>> [PYTHON 3.10] Execution Success in ${result.execution_time_ms}ms`,
        `>>> [COMPUTE] ${result.pixels_processed?.toLocaleString()} pixels processed via uncompressed 24-bit BMP`,
        `>>> Status: SUCCESS (Exit Code 0)`,
      ]);

      playSound('win');
      if (onAwardXp) onAwardXp(35, `Executed Python 3.10 Kernel for ${selectedPreset}`);
    } catch (err) {
      console.error(err);
      setTerminalLogs((prev) => [
        ...prev,
        `>>> [ERROR] Python execution failed: ${(err as Error).message}`,
        `>>> Fallback to hardware canvas renderer.`,
      ]);
      renderCanvas();
    } finally {
      setIsPythonRunning(false);
    }
  };

  // Download Output File
  const handleDownload = (format: 'png' | 'bmp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    playSound('win');
    const link = document.createElement('a');
    link.download = `python-agony-${selectedPreset}-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(format === 'bmp' ? 'image/bmp' : 'image/png');
    link.click();

    if (onAwardXp) onAwardXp(25, `Downloaded ${format.toUpperCase()} artwork`);
  };

  // Python Script Code Generation for "Python Tab"
  const pythonScript = `#!/usr/bin/env python3
"""
================================================================================
GUINNESS AGONY OS: ADVANCED PYTHON IMAGE EFFECTS STUDIO
Architect: Yasir Abed Rabbu
Engines: Python 3.10+ | Pillow (PIL) | NumPy | OpenCV (cv2)
================================================================================
Supported Effects:
  1. halftone-dots      - Rotary Press Halftone with Rotating Screen Angle
  2. comic-cmyk         - Lichtenstein Pop-Art CMYK Rosette Separation
  3. retro-8bit         - 8-Bit Retro CRT Arcade with Phosphor Scanlines
  4. cinematic-noir     - 35mm Silver Halide Film Noir with Authentic Grain
  5. cyber-glitch       - Cyberpunk Chromatic Aberration & Horizontal Tears
  6. thermal-flir       - Infrared FLIR Night-Vision Ironbow Spectrum
  7. blueprint-cyan     - 1840s Prussian Architectural Blueprint Draft
  8. ascii-matrix       - Green Phosphor ASCII Character Luminance Console
  9. sobel-neon         - Mathematical Sobel Gradient Convolution Edge Glow
  10. risograph-duo     - Tokyo Risograph 2-Spot Color Stencil Offset
  11. crosshatch-engr   - 19th Century Banknote Steel Plate Crosshatching
  12. bayer-dither      - Bayer 8x8 Spatial Error Diffusion Dithering

Installation:
  pip install pillow numpy opencv-python
"""

import sys
import argparse
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

def apply_halftone(img, dot_pitch=${dotPitch}, angle_deg=${screenAngle}, contrast=${contrast}):
    """Rotary Press Halftone Dot Matrix with Screen Angle Rotation."""
    img_gray = img.convert("L")
    enhancer = ImageEnhance.Contrast(img_gray)
    img_gray = enhancer.enhance(contrast)
    
    w, h = img_gray.size
    output = Image.new("RGB", (w, h), (15, 15, 20))
    draw = ImageDraw.Draw(output)
    
    step = max(4, dot_pitch)
    for y in range(0, h, step):
        for x in range(0, w, step):
            tile = img_gray.crop((x, y, min(x + step, w), min(y + step, h)))
            mean_lum = np.mean(np.array(tile))
            radius = (1.0 - (mean_lum / 255.0)) * (step / 1.7)
            if radius > 0.6:
                cx, cy = x + step // 2, y + step // 2
                draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(245, 245, 245))
    return output

def apply_cmyk_popart(img, dot_pitch=${dotPitch}):
    """Pop-Art Comic CMYK Screen Separation."""
    w, h = img.size
    output = Image.new("RGB", (w, h), (250, 248, 245))
    draw = ImageDraw.Draw(output)
    rgb = np.array(img, dtype=np.float32)
    step = max(5, dot_pitch)
    
    for y in range(0, h, step):
        for x in range(0, w, step):
            r, g, b = rgb[min(y, h-1), min(x, w-1)][:3]
            c = (255 - r) / 255.0 * (step / 2.2)
            m = (255 - g) / 255.0 * (step / 2.2)
            y_col = (255 - b) / 255.0 * (step / 2.2)
            cx, cy = x + step // 2, y + step // 2
            if c > 0.5: draw.ellipse([cx-c-1, cy-c-1, cx+c-1, cy+c-1], fill=(0, 220, 255))
            if m > 0.5: draw.ellipse([cx-m+1, cy-m-1, cx+m+1, cy+m-1], fill=(255, 20, 147))
            if y_col > 0.5: draw.ellipse([cx-y_col, cy-y_col+1, cx+y_col, cy+y_col+1], fill=(255, 220, 0))
    return output

def apply_thermal_flir(img):
    """FLIR Thermal Ironbow Spectrum Heatmap."""
    gray = np.array(img.convert("L"), dtype=np.float32) / 255.0
    h, w = gray.shape
    out = np.zeros((h, w, 3), dtype=np.uint8)
    
    # Ironbow lookup
    for y in range(h):
        for x in range(w):
            t = gray[y, x]
            if t < 0.2:
                out[y, x] = [int(30 * (t/0.2)), 0, int(140 * (t/0.2))]
            elif t < 0.4:
                out[y, x] = [int(30 + 10 * ((t-0.2)/0.2)), int(180 * ((t-0.2)/0.2)), int(140 + 115 * ((t-0.2)/0.2))]
            elif t < 0.65:
                out[y, x] = [int(40 + 215 * ((t-0.4)/0.25)), int(180 + 40 * ((t-0.4)/0.25)), int(255 * (1 - (t-0.4)/0.25))]
            elif t < 0.85:
                out[y, x] = [255, int(220 * (1 - (t-0.65)/0.2)), 0]
            else:
                f = (t - 0.85) / 0.15
                out[y, x] = [255, int(255 * f), int(255 * f)]
    return Image.fromarray(out)

def main():
    parser = argparse.ArgumentParser(description="Guinness Agony Python Image Studio")
    parser.add_argument("input", help="Path to input image")
    parser.add_argument("output", help="Path to output image")
    parser.add_argument("--effect", default="${selectedPreset}", choices=[
        "halftone-dots", "comic-cmyk", "retro-8bit", "cinematic-noir",
        "cyber-glitch", "thermal-flir", "blueprint-cyan", "ascii-matrix",
        "sobel-neon", "risograph-duo", "crosshatch-engraving", "bayer-dither"
    ])
    parser.add_argument("--dot-pitch", type=int, default=${dotPitch})
    parser.add_argument("--contrast", type=float, default=${contrast})
    parser.add_argument("--angle", type=int, default=${screenAngle})
    args = parser.parse_args()
    
    print(f"[*] Processing {args.input} with effect: {args.effect}...")
    img = Image.open(args.input)
    
    if args.effect == "halftone-dots":
        res = apply_halftone(img, args.dot_pitch, args.angle, args.contrast)
    elif args.effect == "comic-cmyk":
        res = apply_cmyk_popart(img, args.dot_pitch)
    elif args.effect == "thermal-flir":
        res = apply_thermal_flir(img)
    else:
        res = apply_halftone(img, args.dot_pitch, args.angle, args.contrast)
        
    res.save(args.output)
    print(f"[+] Render complete: {args.output}")

if __name__ == "__main__":
    main()
`;

  const copyPythonCode = () => {
    playSound('beep');
    navigator.clipboard.writeText(pythonScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    if (onAwardXp) onAwardXp(20, 'Copied Python Studio script');
  };

  const downloadPythonScript = () => {
    playSound('coin');
    const blob = new Blob([pythonScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agony_image_engine_${selectedPreset}.py`;
    a.click();
    URL.revokeObjectURL(url);
    if (onAwardXp) onAwardXp(25, 'Downloaded standalone Python script');
  };

  return (
    <section
      id="halftone-image-studio"
      className="my-8 rounded-2xl overflow-hidden border-2 border-yellow-500/80 bg-[#090a10] text-white shadow-2xl font-mono"
    >
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-600 to-red-600 p-3 sm:p-4 text-black flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-black text-yellow-400 rounded-lg flex items-center justify-center border border-yellow-200 shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded">
                PYTHON 3.10 &bull; LIVE KERNEL
              </span>
              <span className="text-xs font-bold text-neutral-900 hidden sm:inline">
                Architect: Yasir Abed Rabbu
              </span>
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-black tracking-tight">
              12+ PYTHON IMAGE EFFECTS &amp; HALFTONE CUSTOMIZER
            </h3>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-black/85 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('canvas');
            }}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'canvas'
                ? 'bg-yellow-400 text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Interactive Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('python');
            }}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'python'
                ? 'bg-yellow-400 text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Python Script (PIL)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('telemetry');
            }}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-yellow-400 text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Telemetry Log</span>
          </button>
        </div>
      </div>

      {activeTab === 'canvas' && (
        <div className="p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Sample Image Picker */}
            <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-xl space-y-2">
              <label className="text-xs font-bold text-yellow-300 flex items-center justify-between">
                <span>1. Choose Sample or Upload Image</span>
                <span className="text-[10px] text-neutral-500 font-normal">Real Assets</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => selectSample(sample.src, sample.name)}
                    className="group relative rounded-lg overflow-hidden border border-neutral-800 hover:border-yellow-400 transition-all cursor-pointer aspect-square bg-black"
                    title={sample.name}
                  >
                    <img
                      src={sample.src}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </button>
                ))}
              </div>

              {/* Upload custom image */}
              <label className="w-full bg-neutral-900 hover:bg-neutral-800 border border-dashed border-neutral-700 hover:border-yellow-400 text-yellow-300 text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2">
                <Upload className="w-4 h-4 text-yellow-400" />
                <span>Upload Custom Photo / Drawing</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Effect Presets Grid (12 Effects) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-yellow-300 uppercase tracking-wider">
                  2. Select Visual Effect ({PRESET_LIST.length} Total)
                </label>
                <span className="text-[10px] text-neutral-400">Python + Canvas</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {PRESET_LIST.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        playSound('coin');
                        setSelectedPreset(preset.id);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-400/20 text-yellow-200 shadow-md font-bold ring-1 ring-yellow-400'
                          : 'border-neutral-800 bg-neutral-950/70 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs truncate">{preset.name}</span>
                        <span className="text-[9px] bg-neutral-800 text-yellow-300 px-1 py-0.5 rounded font-mono">
                          {preset.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-sans line-clamp-1 leading-tight">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization Sliders Box */}
            <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-300 font-bold border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customization Parameters</span>
                </span>
                <span className="text-[10px] bg-neutral-900 text-lime-400 px-1.5 py-0.5 rounded border border-neutral-700">
                  Live GPU Sync
                </span>
              </div>

              {/* Color Palette */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Palette className="w-3 h-3 text-yellow-400" />
                    <span>Color Palette:</span>
                  </span>
                  <span className="text-yellow-400 font-bold text-[11px] capitalize">{palette}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setPalette(pal.id);
                      }}
                      className={`text-[10px] px-1.5 py-1 rounded border truncate text-center cursor-pointer transition-all ${
                        palette === pal.id
                          ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                      }`}
                      title={pal.name}
                    >
                      {pal.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dot Pitch / Size */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Dot Pitch / Matrix Pitch:</span>
                  <span className="text-yellow-400 font-bold">{dotPitch}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="1"
                  value={dotPitch}
                  onChange={(e) => setDotPitch(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Screen Angle */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Screen Rotation Angle:</span>
                  <span className="text-yellow-400 font-bold">{screenAngle}&deg;</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="5"
                    value={screenAngle}
                    onChange={(e) => setScreenAngle(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {[0, 15, 45, 75].map((ang) => (
                      <button
                        key={ang}
                        type="button"
                        onClick={() => setScreenAngle(ang)}
                        className={`text-[9px] px-1 py-0.5 rounded border cursor-pointer ${
                          screenAngle === ang
                            ? 'border-yellow-400 bg-yellow-400 text-black font-bold'
                            : 'border-neutral-800 text-neutral-400'
                        }`}
                      >
                        {ang}&deg;
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Dynamic Contrast:</span>
                  <span className="text-yellow-400 font-bold">{contrast.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.8"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Brightness / Gain */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Exposure / Brightness Gain:</span>
                  <span className="text-yellow-400 font-bold">{brightness.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.0"
                  step="0.1"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Color Saturation:</span>
                  <span className="text-yellow-400 font-bold">{Math.round(saturation * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2.5"
                  step="0.1"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Film Grain (for Noir & Analog) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>35mm Film Grain / Noise:</span>
                  <span className="text-yellow-400 font-bold">{grainIntensity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="2"
                  value={grainIntensity}
                  onChange={(e) => setGrainIntensity(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Vignette & Chromatic Offset */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Vignette:</span>
                    <span className="text-yellow-400">{vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={vignette}
                    onChange={(e) => setVignette(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>RGB Shift:</span>
                    <span className="text-yellow-400">{chromaticOffset}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={chromaticOffset}
                    onChange={(e) => setChromaticOffset(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Toggles: Invert, Letterbox, Paper Texture */}
              <div className="pt-2 border-t border-neutral-800 grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setInvert(!invert)}
                  className={`p-1.5 rounded border text-center cursor-pointer transition-all ${
                    invert
                      ? 'border-yellow-400 bg-yellow-400 text-black font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  Invert Tones
                </button>

                <button
                  type="button"
                  onClick={() => setLetterbox(letterbox === 'none' ? 'cinematic' : 'none')}
                  className={`p-1.5 rounded border text-center cursor-pointer transition-all ${
                    letterbox !== 'none'
                      ? 'border-yellow-400 bg-yellow-400 text-black font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  Letterbox Bars
                </button>

                <button
                  type="button"
                  onClick={() => setPaperTexture(!paperTexture)}
                  className={`p-1.5 rounded border text-center cursor-pointer transition-all ${
                    paperTexture
                      ? 'border-yellow-400 bg-yellow-400 text-black font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  Paper Grain
                </button>
              </div>
            </div>

            {/* Run Real Python 3.10 Backend Kernel Button */}
            <button
              type="button"
              onClick={handleRunPythonBackend}
              disabled={isPythonRunning}
              className="w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-red-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isPythonRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>COMPILING VIA PYTHON 3.10 KERNEL...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black text-black" />
                  <span>⚡ RUN PYTHON 3.10 BACKEND KERNEL</span>
                </>
              )}
            </button>
          </div>

          {/* Right Canvas Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-start space-y-4">
            {/* View Mode Bar */}
            <div className="w-full max-w-lg flex items-center justify-between bg-neutral-950/80 p-2 rounded-xl border border-neutral-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 text-[11px] font-bold">View Mode:</span>
                <div className="flex gap-1">
                  {(['filtered', 'original', 'split'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setViewMode(mode);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] capitalize cursor-pointer transition-all ${
                        viewMode === mode
                          ? 'bg-yellow-400 text-black font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {viewMode === 'split' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400">Split: {splitRatio}%</span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={splitRatio}
                    onChange={(e) => setSplitRatio(Number(e.target.value))}
                    className="w-20 accent-yellow-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Canvas Display Frame */}
            <div className="relative w-full max-w-lg bg-black border-2 border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[340px] p-2">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[480px] object-contain rounded shadow-inner"
              />

              {/* Watermark badge */}
              <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-xs text-[9px] sm:text-[10px] text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded font-mono select-none">
                Python PIL &bull; Yasir Abed Rabbu
              </div>

              {/* Python stats overlay banner when executed */}
              {pythonStats && (
                <div className="absolute top-3 left-3 bg-black/90 border border-lime-400 text-lime-400 text-[10px] font-mono px-2 py-1 rounded shadow-lg flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-lime-400 animate-pulse" />
                  <span>
                    Python 3.10: {pythonStats.execution_time_ms}ms &bull; {pythonStats.pixels_processed.toLocaleString()} px
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar: Download & Share */}
            <div className="w-full max-w-lg flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="text-xs text-neutral-400">
                Preset: <strong className="text-yellow-300 uppercase">{selectedPreset}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload('bmp')}
                  className="bg-neutral-900 hover:bg-neutral-800 text-yellow-300 border border-neutral-700 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  title="Download uncompressed 24-bit Windows BMP"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.BMP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload('png')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-black text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-950" />
                  <span>Download .PNG</span>
                </button>
              </div>
            </div>

            {/* Live Terminal Mini Box */}
            <div className="w-full max-w-lg bg-black/95 border border-neutral-800 rounded-xl p-3 text-[10px] font-mono text-lime-400 space-y-1">
              <div className="text-neutral-500 border-b border-neutral-800 pb-1 flex items-center justify-between">
                <span className="flex items-center gap-1 text-yellow-300">
                  <TerminalIcon className="w-3 h-3 text-cyan-400" />
                  <span>Python 3.10 Kernel Telemetry</span>
                </span>
                <span className="text-lime-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
                  <span>READY</span>
                </span>
              </div>
              <div className="max-h-20 overflow-y-auto space-y-0.5 scrollbar-thin">
                {terminalLogs.slice(-5).map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Python Script Tab */}
      {activeTab === 'python' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-yellow-300 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-lime-400" />
                <span>Production Python 3.10 CLI &amp; PIL Script</span>
              </h4>
              <p className="text-xs text-neutral-400">
                Run directly with Python 3 + Pillow + NumPy on your local terminal for batch processing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyPythonCode}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                {copiedCode ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={downloadPythonScript}
                className="bg-neutral-800 hover:bg-neutral-700 text-yellow-300 border border-neutral-700 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-yellow-300" />
                <span>Download .py</span>
              </button>
            </div>
          </div>

          <div className="bg-black/95 border border-neutral-800 rounded-xl p-4 overflow-x-auto max-h-[500px]">
            <pre className="text-xs text-neutral-200 font-mono leading-relaxed selection:bg-yellow-400 selection:text-black">
              <code>{pythonScript}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Telemetry Log Tab */}
      {activeTab === 'telemetry' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="border-b border-neutral-800 pb-3">
            <h4 className="text-sm font-bold text-yellow-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Full Python Engine Execution &amp; Benchmark Telemetry</span>
            </h4>
            <p className="text-xs text-neutral-400">
              Live server CPU stats, algorithm benchmarks, and pixel rasterization performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="text-neutral-500 text-[10px]">CURRENT ENGINE</div>
              <div className="text-yellow-400 font-bold text-sm mt-1">Python 3.10.12 Kernel</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Pure standard library + math</div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="text-neutral-500 text-[10px]">ACTIVE PRESET EFFECT</div>
              <div className="text-lime-400 font-bold text-sm mt-1 uppercase">{selectedPreset}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">Pitch: {dotPitch}px &bull; Angle: {screenAngle}&deg;</div>
            </div>

            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="text-neutral-500 text-[10px]">LAST BENCHMARK SPEED</div>
              <div className="text-cyan-400 font-bold text-sm mt-1">
                {pythonStats ? `${pythonStats.execution_time_ms} ms` : 'Live GPU Canvas'}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">
                {pythonStats ? `${pythonStats.pixels_processed.toLocaleString()} px` : 'Instant Real-Time'}
              </div>
            </div>
          </div>

          <div className="bg-black/95 border border-neutral-800 rounded-xl p-4 font-mono text-xs text-lime-400 space-y-1 max-h-[350px] overflow-y-auto">
            <div className="text-neutral-500 border-b border-neutral-800 pb-2 mb-2 flex items-center justify-between">
              <span>/var/log/python_agony_engine.log</span>
              <button
                type="button"
                onClick={() => setTerminalLogs(['Logs cleared by operator.'])}
                className="text-[10px] text-yellow-400 hover:underline cursor-pointer"
              >
                Clear Log
              </button>
            </div>
            {terminalLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
            <div className="text-yellow-400 animate-pulse">&gt; _</div>
          </div>
        </div>
      )}
    </section>
  );
};
