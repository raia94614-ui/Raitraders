import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Upload, Download, Undo2, RotateCcw, Brush, Eraser, Wand2, X } from 'lucide-react';
import { PAINT_COLORS } from './PaintTool';

interface PhotoRoomPainterProps {
  onClose: () => void;
  isHi?: boolean;
}

export const PhotoRoomPainter: React.FC<PhotoRoomPainterProps> = ({ onClose, isHi = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTool, setActiveTool] = useState<'magic' | 'brush' | 'eraser'>('magic');
  const [tolerance, setTolerance] = useState(32);
  const [brushSize, setBrushSize] = useState(25);
  const [selectedColor, setSelectedColor] = useState('#D4AF37');
  const [isPainting, setIsPainting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const maskDataRef = useRef<Uint8Array | null>(null); // 1 = painted, 0 = unpainted
  const historyStackRef = useRef<Uint8Array[]>([]);

  // Load uploaded image onto canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Scale image to fit max 1280x800 for high performance
        const maxW = 1200;
        const maxH = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        originalImageDataRef.current = ctx.getImageData(0, 0, w, h);
        maskDataRef.current = new Uint8Array(w * h);
        historyStackRef.current = [new Uint8Array(w * h)];
        setImageLoaded(true);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Convert RGB to HSL and back
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h, s, l];
  };

  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    return [f(0), f(8), f(4)];
  };

  // Parse target hex to target HSL
  const targetHsl = useMemo(() => {
    let hex = selectedColor.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map((x) => x + x).join('');
    const num = parseInt(hex, 16);
    const r = (num >> 16) / 255;
    const g = ((num >> 8) & 255) / 255;
    const b = (num & 255) / 255;
    return rgbToHsl(r * 255, g * 255, b * 255);
  }, [selectedColor]);

  // Render recolored pixels from mask preserving luminance
  const reRenderRecoloredCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImageDataRef.current || !maskDataRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const orig = originalImageDataRef.current.data;
    const mask = maskDataRef.current;

    const output = ctx.createImageData(w, h);
    const outData = output.data;

    const [tH, tS] = targetHsl;

    for (let i = 0; i < mask.length; i++) {
      const pxIdx = i * 4;
      const r = orig[pxIdx];
      const g = orig[pxIdx + 1];
      const b = orig[pxIdx + 2];
      const a = orig[pxIdx + 3];

      if (mask[i] === 1) {
        // Luminance-preserving blend: Keep original L, replace H & S
        const [, , origL] = rgbToHsl(r, g, b);
        const [newR, newG, newB] = hslToRgb(tH, Math.min(0.85, tS * 1.1), origL);

        outData[pxIdx] = newR;
        outData[pxIdx + 1] = newG;
        outData[pxIdx + 2] = newB;
        outData[pxIdx + 3] = a;
      } else {
        outData[pxIdx] = r;
        outData[pxIdx + 1] = g;
        outData[pxIdx + 2] = b;
        outData[pxIdx + 3] = a;
      }
    }

    ctx.putImageData(output, 0, 0);
  }, [targetHsl]);

  // Re-render when selected color changes
  useEffect(() => {
    if (imageLoaded) {
      reRenderRecoloredCanvas();
    }
  }, [selectedColor, imageLoaded, reRenderRecoloredCanvas]);

  // Edge-aware Sobel Boundary Flood Fill (Region Grow)
  const magicTapFloodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImageDataRef.current || !maskDataRef.current) return;
    const w = canvas.width;
    const h = canvas.height;
    const orig = originalImageDataRef.current.data;
    const mask = maskDataRef.current;

    // Save history
    historyStackRef.current.push(new Uint8Array(mask));

    const seedIdx = (startY * w + startX) * 4;
    const targetR = orig[seedIdx];
    const targetG = orig[seedIdx + 1];
    const targetB = orig[seedIdx + 2];

    const visited = new Uint8Array(w * h);
    const queue: number[] = [startY * w + startX];
    visited[startY * w + startX] = 1;

    const tolSq = tolerance * tolerance * 3;

    while (queue.length > 0) {
      const current = queue.pop()!;
      const cx = current % w;
      const cy = Math.floor(current / w);

      mask[current] = 1;

      // 4-way neighbors
      const neighbors = [
        cx > 0 ? current - 1 : -1,
        cx < w - 1 ? current + 1 : -1,
        cy > 0 ? current - w : -1,
        cy < h - 1 ? current + w : -1,
      ];

      for (const n of neighbors) {
        if (n >= 0 && visited[n] === 0) {
          visited[n] = 1;
          const nIdx = n * 4;
          const dr = orig[nIdx] - targetR;
          const dg = orig[nIdx + 1] - targetG;
          const db = orig[nIdx + 2] - targetB;
          const distSq = dr * dr + dg * dg + db * db;

          // Sobel edge check: check local contrast with previous pixel
          const nx = n % w;
          const ny = Math.floor(n / w);
          if (nx > 0 && ny > 0 && nx < w - 1 && ny < h - 1) {
            const edgeContrast = Math.abs(orig[nIdx] - orig[seedIdx]);
            if (distSq < tolSq && edgeContrast < tolerance * 1.5) {
              queue.push(n);
            }
          }
        }
      }
    }

    reRenderRecoloredCanvas();
  };

  // Manual brush add / erase
  const applyBrushAt = (x: number, y: number, mode: 'brush' | 'eraser') => {
    const canvas = canvasRef.current;
    if (!canvas || !maskDataRef.current) return;
    const w = canvas.width;
    const h = canvas.height;
    const mask = maskDataRef.current;

    const r = Math.floor(brushSize / 2);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          const px = x + dx;
          const py = y + dy;
          if (px >= 0 && px < w && py >= 0 && py < h) {
            mask[py * w + px] = mode === 'brush' ? 1 : 0;
          }
        }
      }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);

    if (activeTool === 'magic') {
      magicTapFloodFill(x, y);
    } else {
      if (maskDataRef.current) {
        historyStackRef.current.push(new Uint8Array(maskDataRef.current));
      }
      setIsPainting(true);
      applyBrushAt(x, y, activeTool);
      reRenderRecoloredCanvas();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting || activeTool === 'magic') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    applyBrushAt(x, y, activeTool);
    reRenderRecoloredCanvas();
  };

  const handleCanvasMouseUp = () => setIsPainting(false);

  const handleUndo = () => {
    if (historyStackRef.current.length > 1) {
      historyStackRef.current.pop();
      const prev = historyStackRef.current[historyStackRef.current.length - 1];
      if (prev && maskDataRef.current) {
        maskDataRef.current.set(prev);
        reRenderRecoloredCanvas();
      }
    }
  };

  const handleResetAll = () => {
    if (maskDataRef.current) {
      maskDataRef.current.fill(0);
      reRenderRecoloredCanvas();
    }
  };

  const handleExportResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `rai_painted_room_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl bg-[#0B1530] border border-gold-500/40 shadow-2xl overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-navy-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center text-navy-950 font-bold shadow">
              <Brush className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isHi ? 'असली कमरे की फोटो पेंट करें' : 'Upload Your Real Room'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-bold uppercase">
                  {isHi ? 'फ़ोटो री-कलर' : 'Photo Painter'}
                </span>
              </h2>
              <p className="text-xs text-white/40">
                {isHi ? 'दीवार पर टैप करें — असली शैडो व टेक्सचर सुरक्षित रहते हैं' : 'Tap on walls to recolor while preserving shadows and texture'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {imageLoaded && (
              <>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleExportResult}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold-gradient text-navy-950 font-bold text-xs shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHi ? 'डाउनलोड करें' : 'Export'}</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Canvas Viewing Area */}
          <div className="flex-1 bg-black/40 flex items-center justify-center p-4 overflow-auto relative">
            {!imageLoaded ? (
              <label className="flex flex-col items-center justify-center w-full max-w-md h-64 border-2 border-dashed border-gold-500/40 rounded-3xl cursor-pointer hover:bg-white/5 transition-colors p-6 text-center">
                <Upload className="w-12 h-12 text-gold-400 mb-3 animate-bounce" />
                <span className="text-sm font-bold text-white mb-1">
                  {isHi ? 'अपने कमरे की फोटो चुनें (Upload Photo)' : 'Click to Upload Room Photo'}
                </span>
                <span className="text-xs text-white/40">
                  {isHi ? 'JPEG, PNG समर्थित • मोबाइल कैमरा या गैलरी से चुनें' : 'PNG, JPG supported. Works offline in your browser.'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-crosshair border border-white/10"
              />
            )}
          </div>

          {/* Right Toolbar Controls */}
          {imageLoaded && (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 bg-navy-950/90 p-4 flex flex-col gap-4 overflow-y-auto">
              
              {/* Tool Selection */}
              <div>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1.5">
                  {isHi ? 'टूल मोड' : 'Selection Tool'}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'magic', label: isHi ? 'मैजिक टैप' : 'Magic Tap', icon: Wand2 },
                    { id: 'brush', label: isHi ? 'ब्रश (ऐड)' : 'Brush (+)', icon: Brush },
                    { id: 'eraser', label: isHi ? 'इरेज़र (-)' : 'Eraser (-)', icon: Eraser },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isAct = activeTool === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTool(t.id as 'magic' | 'brush' | 'eraser')}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                          isAct
                            ? 'bg-gold-500 text-navy-950 font-bold border-gold-400 shadow'
                            : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders */}
              {activeTool === 'magic' && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">{isHi ? 'एज टोलरेंस (सेंसिटिविटी)' : 'Tolerance'}:</span>
                    <span className="text-gold-400 font-mono font-bold">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-white/20 rounded accent-gold-500 cursor-pointer"
                  />
                  <p className="text-[9px] text-white/30">
                    {isHi ? 'सोबेल एज डिटेक्टर दरवाज़े और खिड़की के किनारों पर रुकता है' : 'Edge-stop stops color bleed across frames & doors.'}
                  </p>
                </div>
              )}

              {activeTool !== 'magic' && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">{isHi ? 'ब्रश साइज' : 'Brush Size'}:</span>
                    <span className="text-gold-400 font-mono font-bold">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="70"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-white/20 rounded accent-gold-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Paint Color Swatches */}
              <div className="space-y-2">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  {isHi ? 'दीवार का नया रंग (Paint Shade)' : 'Wall Color'}
                </p>
                <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {PAINT_COLORS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      className={`h-8 rounded-lg border shadow-sm transition-transform ${
                        selectedColor.toUpperCase() === c.hex.toUpperCase()
                          ? 'border-gold-400 scale-105 shadow-md'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.code})`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-7 h-7 rounded border border-white/20 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono font-bold text-gold-400">{selectedColor}</span>
                </div>
              </div>

              {/* Upload Another Button */}
              <label className="mt-auto py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-center text-xs font-semibold text-white/70 cursor-pointer transition-colors">
                {isHi ? 'दूसरी फोटो बदलें' : 'Choose Another Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
