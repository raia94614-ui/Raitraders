import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Undo2, Redo2, RotateCcw, Download, MessageCircle, Save, Trash2, Palette, WallpaperIcon, Layers } from 'lucide-react';
import type { PartDesign } from './store';
import { useVisualizerStore, saveDesignToLocal, loadSavedDesigns, loadDesignById, deleteSavedDesign } from './store';
import type { SavedDesign } from './store';
import { COLOR_GROUPS, FINISH_OPTIONS } from './data/colors';
import type { FinishId } from './data/colors';
import { WALLPAPER_PATTERNS, PATTERN_CATEGORIES } from './data/patterns';
import { VISUALIZER_CONFIG } from './config';

const TEXTURE_EFFECTS = [
  { id: 'stucco', name: 'Venetian Stucco', code: 'TX-101', desc: 'Italian plaster finish' },
  { id: 'brick', name: 'Exposed Brick', code: 'TX-102', desc: 'Raw brick & mortar' },
  { id: 'concrete', name: 'Concrete Loft', code: 'TX-103', desc: 'Raw industrial concrete' },
  { id: 'wood', name: 'Wood Panel', code: 'TX-104', desc: 'Warm timber cladding' },
];

interface PanelProps {
  onClose: () => void;
}

export const Panel: React.FC<PanelProps> = ({ onClose }) => {
  const {
    selectedPartId, panelTab, setPanelTab,
    designs, applyDesign, applyToAllWalls, applyToWholeRoom, resetPart,
    undo, redo, historyIndex, history, currentRoom,
  } = useVisualizerStore();

  const currentDesign: PartDesign = selectedPartId ? (designs[selectedPartId] ?? { type: 'none' }) : { type: 'none' };

  // Paint state
  const [selectedColor, setSelectedColor] = useState(currentDesign.colorHex ?? '#F5F0EB');
  const [selectedColorName, setSelectedColorName] = useState(currentDesign.colorName ?? '');
  const [selectedColorCode, setSelectedColorCode] = useState(currentDesign.colorCode ?? '');
  const [customHex, setCustomHex] = useState(currentDesign.colorHex ?? '#F5F0EB');
  const [selectedFinish, setSelectedFinish] = useState<FinishId>(currentDesign.finish ?? 'matt');

  // Wallpaper state
  const [selectedPattern, setSelectedPattern] = useState(currentDesign.patternId ?? '');
  const [patternTint, setPatternTint] = useState(currentDesign.tintHex ?? '#D4AF37');
  const [patternScale, setPatternScale] = useState(currentDesign.patternScale ?? 1);
  const [patternRotation, setPatternRotation] = useState(currentDesign.patternRotation ?? 0);
  const [patternCategory, setPatternCategory] = useState(PATTERN_CATEGORIES[0]);

  // Texture state
  const [selectedTexture, setSelectedTexture] = useState(currentDesign.textureId ?? '');

  // Saved designs
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  // Sync state when selected part changes
  useEffect(() => {
    if (!selectedPartId) return;
    const d = designs[selectedPartId] ?? { type: 'none' };
    setSelectedColor(d.colorHex ?? '#F5F0EB');
    setSelectedColorName(d.colorName ?? '');
    setSelectedColorCode(d.colorCode ?? '');
    setCustomHex(d.colorHex ?? '#F5F0EB');
    setSelectedFinish(d.finish ?? 'matt');
    setSelectedPattern(d.patternId ?? '');
    setPatternTint(d.tintHex ?? '#D4AF37');
    setPatternScale(d.patternScale ?? 1);
    setPatternRotation(d.patternRotation ?? 0);
    setSelectedTexture(d.textureId ?? '');
  }, [selectedPartId, designs]);

  const buildPaintDesign = useCallback((): PartDesign => ({
    type: 'color',
    colorHex: selectedColor,
    colorName: selectedColorName,
    colorCode: selectedColorCode,
    finish: selectedFinish,
  }), [selectedColor, selectedColorName, selectedColorCode, selectedFinish]);

  const buildWallpaperDesign = useCallback((): PartDesign => {
    const pat = WALLPAPER_PATTERNS.find((p) => p.id === selectedPattern);
    return {
      type: 'wallpaper',
      patternId: selectedPattern,
      patternName: pat?.name ?? '',
      patternCode: pat?.code ?? '',
      tintHex: patternTint,
      patternScale,
      patternRotation,
    };
  }, [selectedPattern, patternTint, patternScale, patternRotation]);

  const buildTextureDesign = useCallback((): PartDesign => {
    const tex = TEXTURE_EFFECTS.find((t) => t.id === selectedTexture);
    return {
      type: 'texture',
      textureId: selectedTexture,
      textureName: tex?.name ?? '',
    };
  }, [selectedTexture]);

  const handleApply = () => {
    if (!selectedPartId) return;
    if (panelTab === 'paint') applyDesign(selectedPartId, buildPaintDesign());
    else if (panelTab === 'wallpaper') applyDesign(selectedPartId, buildWallpaperDesign());
    else applyDesign(selectedPartId, buildTextureDesign());
  };

  const handleApplyAllWalls = () => {
    if (panelTab === 'paint') applyToAllWalls(buildPaintDesign());
    else if (panelTab === 'wallpaper') applyToAllWalls(buildWallpaperDesign());
    else applyToAllWalls(buildTextureDesign());
  };

  const handleApplyWholeRoom = () => {
    if (panelTab === 'paint') applyToWholeRoom(buildPaintDesign());
    else if (panelTab === 'wallpaper') applyToWholeRoom(buildWallpaperDesign());
    else applyToWholeRoom(buildTextureDesign());
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveDesignToLocal(saveName.trim());
    setSavedDesigns(loadSavedDesigns());
    setSaveDialogOpen(false);
    setSaveName('');
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `rai-traders-design-${Date.now()}.png`;
    a.click();
  };

  const handleWhatsApp = () => {
    const lines = ['*Rai Traders — My 3D Home Design Summary*', ''];
    Object.entries(designs).forEach(([partId, d]) => {
      let desc = '';
      if (d.type === 'color') desc = `🎨 Paint: ${d.colorName ?? ''} (${d.colorCode ?? ''}) — Hex: ${d.colorHex ?? ''} | Finish: ${d.finish ?? 'matt'}`;
      else if (d.type === 'wallpaper') desc = `🪞 Wallpaper: ${d.patternName ?? ''} (${d.patternCode ?? ''})`;
      else if (d.type === 'texture') desc = `🧱 Texture: ${d.textureName ?? ''}`;
      if (desc) lines.push(`• ${partId.replace('/', ' → ')}: ${desc}`);
    });
    lines.push('', 'Please contact me for a free on-site quotation in Bhopal!');
    const text = lines.join('\n');
    window.open(`https://wa.me/${VISUALIZER_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  useEffect(() => {
    setSavedDesigns(loadSavedDesigns());
  }, []);

  const partLabel = selectedPartId?.replace(`${currentRoom}/`, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: typeof window !== 'undefined' && window.innerWidth < 640 ? 80 : 0, x: typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 40 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: typeof window !== 'undefined' && window.innerWidth < 640 ? 80 : 0, x: typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="absolute bottom-0 sm:bottom-auto sm:top-0 right-0 w-full sm:w-[360px] h-[75vh] sm:h-full bg-[#0B1530]/95 backdrop-blur-xl border-t sm:border-t-0 sm:border-l border-[#D4AF37]/25 rounded-t-2xl sm:rounded-none flex flex-col z-20 shadow-2xl overflow-hidden"
    >
      {/* Mobile pull indicator */}
      <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1" />
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/15">
        <div>
          <p className="text-[10px] text-[#D4AF37]/70 uppercase tracking-widest">Designing</p>
          <h3 className="text-sm font-semibold text-white">{partLabel || 'Select a wall'}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => undo()} disabled={historyIndex <= 0} title="Undo (Z)" aria-label="Undo"
            className="p-1.5 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37]/70 hover:text-[#D4AF37] disabled:opacity-30 transition-colors">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => redo()} disabled={historyIndex >= history.length - 1} title="Redo (Y)" aria-label="Redo"
            className="p-1.5 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37]/70 hover:text-[#D4AF37] disabled:opacity-30 transition-colors">
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClose} aria-label="Close panel"
            className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#D4AF37]/10">
        {([
          { id: 'paint', label: 'Paint', Icon: Palette },
          { id: 'wallpaper', label: 'Wallpaper', Icon: WallpaperIcon },
          { id: 'texture', label: 'Texture', Icon: Layers },
        ] as { id: 'paint' | 'wallpaper' | 'texture'; label: string; Icon: React.FC<{ className?: string }> }[]).map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setPanelTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ${panelTab === id ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-white/40 hover:text-white/70'}`}
          >
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-5">

        {/* ── PAINT TAB ── */}
        {panelTab === 'paint' && (
          <>
            {COLOR_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-widest mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedColor(c.hex); setCustomHex(c.hex); setSelectedColorName(c.name); setSelectedColorCode(c.code); }}
                      title={`${c.name} ${c.code}`}
                      aria-label={`${c.name} ${c.code}`}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c.hex ? 'border-[#D4AF37] scale-110 shadow-lg shadow-[#D4AF37]/30' : 'border-white/10'}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Custom color */}
            <div>
              <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-widest mb-2">Custom Color</p>
              <div className="flex items-center gap-3">
                <input type="color" value={customHex}
                  onChange={(e) => { setCustomHex(e.target.value); setSelectedColor(e.target.value); setSelectedColorName('Custom'); setSelectedColorCode('RT-CUSTOM'); }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-[#D4AF37]/20 bg-transparent"
                  aria-label="Custom color picker"
                />
                <input type="text" value={customHex}
                  onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) { setCustomHex(e.target.value); if (e.target.value.length === 7) setSelectedColor(e.target.value); } }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]/50"
                  placeholder="#D4AF37"
                  aria-label="Hex color input"
                />
              </div>
            </div>

            {/* Selected color preview */}
            {selectedColorName && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-[#D4AF37]/10">
                <div className="w-10 h-10 rounded-lg border border-white/20" style={{ background: selectedColor }} />
                <div>
                  <p className="text-xs font-semibold text-white">{selectedColorName}</p>
                  <p className="text-[10px] text-[#D4AF37]">{selectedColorCode}</p>
                </div>
              </div>
            )}

            {/* Finish selector */}
            <div>
              <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-widest mb-2">Finish</p>
              <div className="flex gap-2">
                {FINISH_OPTIONS.map((f) => (
                  <button key={f.id} onClick={() => setSelectedFinish(f.id as FinishId)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${selectedFinish === f.id ? 'bg-[#D4AF37] text-[#0B1530] border-[#D4AF37]' : 'bg-white/5 text-white/60 border-white/10 hover:border-[#D4AF37]/40'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── WALLPAPER TAB ── */}
        {panelTab === 'wallpaper' && (
          <>
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
              {PATTERN_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setPatternCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${patternCategory === cat ? 'bg-[#D4AF37] text-[#0B1530] border-[#D4AF37]' : 'bg-white/5 text-white/50 border-white/10 hover:border-[#D4AF37]/30'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Pattern grid */}
            <div className="grid grid-cols-3 gap-2">
              {WALLPAPER_PATTERNS.filter((p) => p.category === patternCategory).map((p) => (
                <button key={p.id} onClick={() => setSelectedPattern(p.id)}
                  className={`rounded-xl overflow-hidden border-2 aspect-square flex flex-col items-center justify-center transition-all ${selectedPattern === p.id ? 'border-[#D4AF37] scale-105' : 'border-white/10 hover:border-[#D4AF37]/40'}`}
                  title={`${p.name} ${p.code}`}
                  aria-label={`${p.name} ${p.code}`}
                >
                  <PatternPreview pattern={p} tint={patternTint} />
                </button>
              ))}
            </div>

            {/* Tint color */}
            <div>
              <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-widest mb-2">Background Tint</p>
              <div className="flex items-center gap-2">
                <input type="color" value={patternTint} onChange={(e) => setPatternTint(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-[#D4AF37]/20 bg-transparent"
                  aria-label="Pattern tint color"
                />
                <span className="text-xs text-white/40 font-mono">{patternTint}</span>
              </div>
            </div>

            {/* Scale & Rotation */}
            <div>
              <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-widest mb-2">Pattern Scale: {patternScale.toFixed(1)}x</p>
              <input type="range" min="0.3" max="3" step="0.1" value={patternScale}
                onChange={(e) => setPatternScale(parseFloat(e.target.value))}
                className="w-full accent-[#D4AF37]" aria-label="Pattern scale"
              />
            </div>
            <div>
              <p className="text-[10px] text-[#D4AF37]/60 uppercase tracking-widest mb-2">Rotation: {patternRotation}°</p>
              <input type="range" min="0" max="360" step="5" value={patternRotation}
                onChange={(e) => setPatternRotation(parseInt(e.target.value))}
                className="w-full accent-[#D4AF37]" aria-label="Pattern rotation"
              />
            </div>

            {/* Selected pattern info */}
            {selectedPattern && (() => {
              const pat = WALLPAPER_PATTERNS.find((p) => p.id === selectedPattern);
              return pat ? (
                <div className="p-3 rounded-xl bg-white/5 border border-[#D4AF37]/10">
                  <p className="text-xs font-semibold text-white">{pat.name}</p>
                  <p className="text-[10px] text-[#D4AF37]">{pat.code} · {pat.category}</p>
                </div>
              ) : null;
            })()}
          </>
        )}

        {/* ── TEXTURE TAB ── */}
        {panelTab === 'texture' && (
          <div className="space-y-3">
            {TEXTURE_EFFECTS.map((tex) => (
              <button key={tex.id} onClick={() => setSelectedTexture(tex.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${selectedTexture === tex.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-white/3 hover:border-[#D4AF37]/30'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 ${tex.id === 'stucco' ? 'bg-[#C8B99A]' : tex.id === 'brick' ? 'bg-[#8B4513]' : tex.id === 'concrete' ? 'bg-[#808080]' : 'bg-[#8B6914]'}`} />
                <div>
                  <p className="text-xs font-semibold text-white">{tex.name}</p>
                  <p className="text-[10px] text-white/40">{tex.desc}</p>
                  <p className="text-[10px] text-[#D4AF37] mt-0.5">{tex.code}</p>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 pt-3 border-t border-[#D4AF37]/10 space-y-2">
        {selectedPartId && (
          <button onClick={handleApply}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C09A20] text-[#0B1530] font-bold text-sm hover:brightness-110 transition-all"
          >
            Apply to This Wall
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={handleApplyAllWalls}
            className="py-2 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/10 transition-colors"
          >
            All Walls
          </button>
          <button onClick={handleApplyWholeRoom}
            className="py-2 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/10 transition-colors"
          >
            Whole Room
          </button>
        </div>
        {selectedPartId && (
          <button onClick={() => resetPart(selectedPartId)}
            className="w-full py-1.5 rounded-xl border border-red-500/20 text-red-400/70 text-xs hover:border-red-500/40 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" /> Reset This Part
          </button>
        )}

        {/* Save & Share */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button onClick={() => setSaveDialogOpen(true)} title="Save Design" aria-label="Save Design"
            className="py-2 rounded-xl border border-white/10 text-white/50 text-xs flex items-center justify-center gap-1 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-colors">
            <Save className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDownload} title="Download Preview" aria-label="Download Preview"
            className="py-2 rounded-xl border border-white/10 text-white/50 text-xs flex items-center justify-center gap-1 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-colors">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleWhatsApp} title="Send to WhatsApp" aria-label="Send to WhatsApp"
            className="py-2 rounded-xl border border-green-500/20 text-green-400/70 text-xs flex items-center justify-center gap-1 hover:border-green-500/40 hover:text-green-400 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Saved designs */}
        <button onClick={() => { setShowSaved((v) => !v); setSavedDesigns(loadSavedDesigns()); }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/3 border border-white/10 text-white/50 text-xs hover:border-[#D4AF37]/20 transition-colors"
        >
          <span>My Saved Designs ({savedDesigns.length})</span>
          {showSaved ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <AnimatePresence>
          {showSaved && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-1.5"
            >
              {savedDesigns.length === 0 ? (
                <p className="text-center text-[10px] text-white/30 py-2">No saved designs yet</p>
              ) : savedDesigns.map((d) => (
                <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/3 border border-white/8">
                  <button onClick={() => loadDesignById(d.id)}
                    className="flex-1 text-left text-xs text-white/70 hover:text-white transition-colors truncate">
                    {d.name}
                  </button>
                  <button onClick={() => { deleteSavedDesign(d.id); setSavedDesigns(loadSavedDesigns()); }}
                    aria-label="Delete saved design"
                    className="text-red-400/40 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save dialog */}
      <AnimatePresence>
        {saveDialogOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 px-6"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0F1E40] border border-[#D4AF37]/30 rounded-2xl p-6 w-full shadow-2xl"
            >
              <h4 className="text-sm font-semibold text-white mb-3">Save Design</h4>
              <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="My Living Room Design"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50 mb-3"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaveDialogOpen(false); }}
              />
              <div className="flex gap-2">
                <button onClick={() => setSaveDialogOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 text-xs hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!saveName.trim()}
                  className="flex-1 py-2 rounded-xl bg-[#D4AF37] text-[#0B1530] text-xs font-bold disabled:opacity-40 hover:brightness-110 transition-all">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/** Mini canvas preview for wallpaper pattern buttons */
const PatternPreview: React.FC<{ pattern: typeof WALLPAPER_PATTERNS[0]; tint: string }> = ({ pattern, tint }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 80, 80);
    try { pattern.draw(ctx, tint, 0.5, 0); } catch { /* ignore */ }
  }, [pattern, tint]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} width={80} height={80} className="w-full h-full object-cover" />
      <p className="text-[8px] text-center text-white/50 px-1 pb-1 truncate">{pattern.name}</p>
    </div>
  );
};
