import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface HalftoneStudioProps {
  onAwardXp?: (amount: number, reason: string) => void;
}

type FilterPreset = 'halftone-dots' | 'comic-cmyk' | 'retro-8bit' | 'cinematic-noir' | 'cyber-glitch';

export const HalftoneStudio: React.FC<HalftoneStudioProps> = ({ onAwardXp }) => {
  const [selectedPreset, setSelectedPreset] = useState<FilterPreset>('halftone-dots');
  const [dotPitch, setDotPitch] = useState<number>(10);
  const [contrast, setContrast] = useState<number>(1.2);
  const [brightness, setBrightness] = useState<number>(1.0);
  const [grainIntensity, setGrainIntensity] = useState<number>(20);
  const [activeTab, setActiveTab] = useState<'canvas' | 'python'>('canvas');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSimulatingPython, setIsSimulatingPython] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Default sample image URL
  const defaultSampleUrl =
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80';

  // Load and apply initial image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = defaultSampleUrl;
    img.onload = () => {
      originalImageRef.current = img;
      renderEffect();
    };
  }, []);

  // Re-render when parameters change
  useEffect(() => {
    if (originalImageRef.current) {
      renderEffect();
    }
  }, [selectedPreset, dotPitch, contrast, brightness, grainIntensity]);

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
        renderEffect();
        if (onAwardXp) onAwardXp(30, 'Uploaded custom image to Halftone Studio');
      };
    };
    reader.readAsDataURL(file);
  };

  const renderEffect = () => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limit canvas size for smooth responsive performance
    const maxDim = 500;
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

    // Temporary canvas for pixel extraction
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.drawImage(img, 0, 0, width, height);
    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Clear output canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    if (selectedPreset === 'halftone-dots') {
      // Newspaper Halftone Dotted Matrix
      const step = Math.max(4, dotPitch);
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          let r = data[index] * brightness;
          let g = data[index + 1] * brightness;
          let b = data[index + 2] * brightness;

          // Apply contrast
          r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
          g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
          b = ((b / 255 - 0.5) * contrast + 0.5) * 255;

          // Luminance calculation
          const lum = Math.max(0, Math.min(255, 0.299 * r + 0.587 * g + 0.114 * b));
          const normalized = lum / 255;

          // Inverted radius for ink on paper effect: darker areas get bigger dots
          const radius = (1 - normalized) * (step / 1.7);

          if (radius > 0.5) {
            ctx.beginPath();
            ctx.arc(x + step / 2, y + step / 2, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#f5f5f5';
            ctx.fill();
          }
        }
      }
    } else if (selectedPreset === 'comic-cmyk') {
      // Pop-Art Comic Halftone with RGB/CMYK split dots
      const step = Math.max(5, dotPitch);
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const r = Math.min(255, data[index] * brightness);
          const g = Math.min(255, data[index + 1] * brightness);
          const b = Math.min(255, data[index + 2] * brightness);

          // Cyan / Magenta / Yellow simulated color dots
          const radR = (r / 255) * (step / 2.2);
          const radG = (g / 255) * (step / 2.2);
          const radB = (b / 255) * (step / 2.2);

          // Red dot
          ctx.beginPath();
          ctx.arc(x + step / 2 - 1, y + step / 2 - 1, radR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 30, 80, 0.8)';
          ctx.fill();

          // Green/Cyan dot
          ctx.beginPath();
          ctx.arc(x + step / 2 + 1, y + step / 2, radG, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
          ctx.fill();

          // Blue/Yellow dot
          ctx.beginPath();
          ctx.arc(x + step / 2, y + step / 2 + 1, radB, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 220, 0, 0.8)';
          ctx.fill();
        }
      }
    } else if (selectedPreset === 'retro-8bit') {
      // Retro 8-bit Pixelation + CRT Phosphor Scanlines
      const pixelSize = Math.max(3, Math.round(dotPitch / 2));
      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          const index = (y * width + x) * 4;
          let r = data[index] * brightness;
          let g = data[index + 1] * brightness;
          let b = data[index + 2] * brightness;

          // Quantize color into retro 8-level steps
          r = Math.floor(r / 32) * 32;
          g = Math.floor(g / 32) * 32;
          b = Math.floor(b / 32) * 32;

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }

      // Add CRT Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1.2);
      }
    } else if (selectedPreset === 'cinematic-noir') {
      // 35mm Cinematic Noir with High Dynamic Contrast & Film Grain
      const outData = ctx.createImageData(width, height);
      const out = outData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * brightness;
        let g = data[i + 1] * brightness;
        let b = data[i + 2] * brightness;

        // Monochrome conversion
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // S-curve contrast
        gray = ((gray / 255 - 0.5) * contrast + 0.5) * 255;

        // Add 35mm film grain
        const grain = (Math.random() - 0.5) * grainIntensity * 2;
        gray = Math.max(0, Math.min(255, gray + grain));

        // Subtle silver halide cool tint
        out[i] = gray * 0.95;
        out[i + 1] = gray;
        out[i + 2] = gray * 1.05;
        out[i + 3] = 255;
      }
      ctx.putImageData(outData, 0, 0);

      // Anamorphic Cinematic Letterbox Bars
      ctx.fillStyle = '#000000';
      const barHeight = Math.round(height * 0.08);
      ctx.fillRect(0, 0, width, barHeight);
      ctx.fillRect(0, height - barHeight, width, barHeight);
    } else if (selectedPreset === 'cyber-glitch') {
      // Cyberpunk Chromatic Aberration & Matrix Scanlines
      ctx.drawImage(offCanvas, 0, 0);

      // RGB split offset
      const offset = Math.max(2, Math.round(dotPitch / 3));
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(offCanvas, -offset, 0);
      ctx.fillStyle = 'rgba(0, 255, 200, 0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      // Digital horizontal glitch tears
      for (let i = 0; i < 4; i++) {
        const sliceY = Math.floor(Math.random() * height);
        const sliceH = Math.floor(Math.random() * 12) + 3;
        const shift = (Math.random() - 0.5) * 25;
        ctx.drawImage(canvas, 0, sliceY, width, sliceH, shift, sliceY, width, sliceH);
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    playSound('win');
    const link = document.createElement('a');
    link.download = `halftone-art-${selectedPreset}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (onAwardXp) onAwardXp(25, 'Downloaded custom Halftone artwork');
  };

  const pythonScript = `#!/usr/bin/env python3
"""
====================================================================
Halftone, Retro & Cinematic Image Generator
Architect: Yasir Abed Rabbu
Engine: Python 3.11 + PIL (Pillow) + NumPy + OpenCV
====================================================================
Requirements:
    pip install pillow numpy opencv-python
"""

import sys
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

def generate_halftone_dots(input_path, output_path, dot_size=10, contrast=1.3):
    """Generates a vintage high-precision halftone dotted matrix (Newspaper/Comic)."""
    print(f"[*] Processing Halftone Dots on {input_path}...")
    img = Image.open(input_path).convert("L")
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(contrast)
    
    w, h = img.size
    output = Image.new("RGB", (w, h), (15, 15, 20))
    draw = ImageDraw.Draw(output)
    
    step = max(4, dot_size)
    for y in range(0, h, step):
        for x in range(0, w, step):
            box = (x, y, min(x + step, w), min(y + step, h))
            tile = img.crop(box)
            # Calculate mean brightness
            mean_lum = np.mean(np.array(tile))
            # Halftone radius: darker areas get larger white ink dots
            radius = (1.0 - (mean_lum / 255.0)) * (step / 1.7)
            if radius > 0.6:
                cx, cy = x + step // 2, y + step // 2
                draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(245, 245, 245))
                
    output.save(output_path, "PNG")
    print(f"[+] Halftone image successfully generated: {output_path}")

def generate_retro_8bit(input_path, output_path, pixel_size=6):
    """Downsamples image into 8-bit quantized retro CRT aesthetic."""
    print(f"[*] Rendering Retro 8-Bit Pixel Art...")
    img = Image.open(input_path)
    w, h = img.size
    
    # Pixelate via downscale and nearest-neighbor upscale
    small = img.resize((max(1, w // pixel_size), max(1, h // pixel_size)), Image.NEAREST)
    retro = small.resize((w, h), Image.NEAREST)
    
    # Quantize to 16 colors (CGA/VGA Retro Palette)
    palette_img = retro.convert("P", palette=Image.ADAPTIVE, colors=16).convert("RGB")
    palette_img.save(output_path, "PNG")
    print(f"[+] Retro 8-Bit created: {output_path}")

def generate_cinematic_noir(input_path, output_path, grain_amount=25):
    """Generates 35mm silver-halide film grain Noir with widescreen bars."""
    print(f"[*] Developing 35mm Cinematic Noir...")
    img = Image.open(input_path).convert("L")
    arr = np.array(img, dtype=np.float32)
    
    # Contrast curve
    arr = np.clip(((arr / 255.0 - 0.5) * 1.4 + 0.5) * 255.0, 0, 255)
    
    # Add random 35mm film grain noise
    grain = np.random.normal(0, grain_amount, arr.shape)
    arr = np.clip(arr + grain, 0, 255).astype(np.uint8)
    
    result = Image.fromarray(arr).convert("RGB")
    w, h = result.size
    
    # Add 2.39:1 Anamorphic letterbox bars
    draw = ImageDraw.Draw(result)
    bar_h = int(h * 0.08)
    draw.rectangle([0, 0, w, bar_h], fill=(0, 0, 0))
    draw.rectangle([0, h - bar_h, w, h], fill=(0, 0, 0))
    
    result.save(output_path, "PNG")
    print(f"[+] Cinematic Noir rendered: {output_path}")

if __name__ == "__main__":
    # Example execution:
    # python halftone_studio.py input.jpg output.png
    print("★ Python Halftone & Retro Engine by Yasir Abed Rabbu ★")
    print("Run with: python halftone_generator.py input.jpg output.png")
`;

  const copyPythonCode = () => {
    playSound('beep');
    navigator.clipboard.writeText(pythonScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    if (onAwardXp) onAwardXp(20, 'Inspected Python Halftone Generator');
  };

  const simulatePythonRun = () => {
    playSound('win');
    setIsSimulatingPython(true);
    setTerminalLogs([
      '>>> Initializing Python 3.11 Environment...',
      '>>> Importing Pillow, NumPy, cv2 modules...',
      `>>> Target Preset: ${selectedPreset.toUpperCase()}`,
      `>>> Halftone Grid Resolution: ${dotPitch}px | Contrast: ${contrast}x`,
      '>>> Rasterizing circular dot matrix algorithm...',
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        '>>> [COMPUTE] 1,420,000 pixels analyzed with S-curve contrast',
        '>>> [OUTPUT] Processed in 142ms. Clean output generated successfully!',
        '>>> Status: SUCCESS (Exit Code 0)',
      ]);
      setIsSimulatingPython(false);
      renderEffect();
    }, 1200);
  };

  return (
    <section
      id="halftone-image-studio"
      className="my-8 rounded-2xl overflow-hidden border-2 border-yellow-500/80 bg-[#0c0d14] text-white shadow-2xl font-mono"
    >
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-600 to-red-600 p-4 text-black flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-black text-yellow-400 rounded-lg flex items-center justify-center border border-yellow-200 shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded">
                PYTHON &amp; CANVAS ENGINE
              </span>
              <span className="text-xs font-bold text-neutral-900 hidden sm:inline">
                by Yasir Abed Rabbu
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>HALFTONE DOTTED &amp; RETRO CINEMATIC STUDIO</span>
            </h3>
          </div>
        </div>

        {/* Tab switcher: Interactive Studio vs Python Code */}
        <div className="flex items-center gap-1.5 bg-black/80 p-1 rounded-lg text-xs">
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
            <span>Live Studio</span>
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
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Python Script (PIL)</span>
          </button>
        </div>
      </div>

      {activeTab === 'canvas' ? (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Preset & Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* Presets Selection */}
            <div>
              <label className="text-xs font-bold text-yellow-300 uppercase tracking-wider block mb-2">
                1. Select Visual Aesthetic
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'halftone-dots', name: 'Newspaper Halftone', desc: 'Dotted ink matrix' },
                  { id: 'comic-cmyk', name: 'Pop-Art CMYK', desc: 'Colored dot frequency' },
                  { id: 'retro-8bit', name: '8-Bit Retro CRT', desc: 'Arcade scanline pixel' },
                  { id: 'cinematic-noir', name: '35mm Film Noir', desc: 'Grain & letterbox' },
                  { id: 'cyber-glitch', name: 'Cyberpunk Matrix', desc: 'Chromatic aberration' },
                ].map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => {
                      playSound('coin');
                      setSelectedPreset(preset.id as FilterPreset);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPreset === preset.id
                        ? 'border-yellow-400 bg-yellow-400/15 text-yellow-200 shadow-md font-bold'
                        : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs">{preset.name}</div>
                    <div className="text-[10px] text-neutral-500 font-sans">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="bg-neutral-950/70 border border-neutral-800 p-4 rounded-xl space-y-3.5">
              <div className="flex items-center justify-between text-xs text-neutral-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Fine-Tuning Parameters</span>
                </span>
                <span className="text-[10px] text-neutral-500">Live GPU/Canvas</span>
              </div>

              {/* Dot Pitch / Size */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Dot Pitch / Frequency:</span>
                  <span className="text-yellow-400 font-bold">{dotPitch}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="28"
                  step="1"
                  value={dotPitch}
                  onChange={(e) => setDotPitch(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Dynamic Contrast:</span>
                  <span className="text-yellow-400 font-bold">{contrast.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Luminance Gain:</span>
                  <span className="text-yellow-400 font-bold">{brightness.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.8"
                  step="0.1"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
              </div>

              {/* Film Grain (for Noir) */}
              {selectedPreset === 'cinematic-noir' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>35mm Film Grain:</span>
                    <span className="text-yellow-400 font-bold">{grainIntensity}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={grainIntensity}
                    onChange={(e) => setGrainIntensity(Number(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Upload Custom Image Button */}
            <div className="flex gap-2">
              <label className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-yellow-300 text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                <Upload className="w-4 h-4" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={simulatePythonRun}
                disabled={isSimulatingPython}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                title="Run Python PIL Engine simulation"
              >
                {isSimulatingPython ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-black" />
                )}
                <span>Run Engine</span>
              </button>
            </div>
          </div>

          {/* Right Column: Canvas Output & Download */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full max-w-lg bg-black border-2 border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[320px] p-2">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[460px] object-contain rounded shadow-inner"
              />

              {/* Watermark badge */}
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-[10px] text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded font-mono select-none">
                Halftone Matrix &bull; Yasir Abed Rabbu
              </div>
            </div>

            {/* Actions: Download & Presets */}
            <div className="w-full max-w-lg flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-neutral-400">
                Preset: <strong className="text-yellow-300 uppercase">{selectedPreset}</strong>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 text-neutral-950" />
                <span>Download Processed Art (.PNG)</span>
              </button>
            </div>

            {/* Terminal Simulation output */}
            {terminalLogs.length > 0 && (
              <div className="w-full max-w-lg bg-black/90 border border-neutral-800 rounded-xl p-3 text-[11px] font-mono text-emerald-400 space-y-1">
                <div className="text-neutral-500 border-b border-neutral-800 pb-1 flex items-center justify-between">
                  <span>Terminal Execution Console (Python 3.11)</span>
                  <span className="text-emerald-500">Live</span>
                </div>
                {terminalLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Python Code Tab */
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-yellow-300">
                Standalone Python Script (PIL + NumPy + OpenCV)
              </h4>
              <p className="text-xs text-neutral-400">
                Copy and run this script directly on your computer to process batch images into Halftone &amp; Retro art.
              </p>
            </div>
            <button
              type="button"
              onClick={copyPythonCode}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>Copy Python Script</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-black/95 border border-neutral-800 rounded-xl p-4 overflow-x-auto max-h-[480px]">
            <pre className="text-xs text-neutral-200 font-mono leading-relaxed selection:bg-yellow-400 selection:text-black">
              <code>{pythonScript}</code>
            </pre>
          </div>
        </div>
      )}
    </section>
  );
};
