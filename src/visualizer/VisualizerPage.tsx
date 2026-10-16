import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, Sun, Moon, Home, Building2, Maximize2, Undo2, Redo2,
  Video, StopCircle, MessageCircle, Info, X, Compass
} from 'lucide-react';
import { HouseScene } from './HouseScene';
import { Panel } from './Panel';
import { useVisualizerStore } from './store';
import type { RoomId } from './store';

const ROOMS: { id: RoomId; label: string; emoji: string }[] = [
  { id: 'living', label: 'Living Room', emoji: '🛋️' },
  { id: 'bedroom', label: 'Bedroom', emoji: '🛏️' },
  { id: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { id: 'kids', label: "Kids' Room", emoji: '🧸' },
];

export const VisualizerPage: React.FC = () => {
  const {
    viewMode, setViewMode, cameraMode, setCameraMode,
    currentRoom, setCurrentRoom,
    dayNight, toggleDayNight, selectedPartId, selectPart,
    isAutoRotating, toggleAutoRotate,
    undo, redo, history, historyIndex,
    showHints, dismissHints,
    beforeAfterProgress, setBeforeAfterProgress,
    clearAll,
  } = useVisualizerStore();

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [headingAngle, setHeadingAngle] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Compass heading listener for 360 panoramic view
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ angle: number }>;
      setHeadingAngle(ce.detail.angle);
    };
    window.addEventListener('viz-heading', handler);
    return () => window.removeEventListener('viz-heading', handler);
  }, []);

  const getFacingDirection = (deg: number) => {
    if (deg >= 315 || deg < 45) return 'Accent Feature Wall';
    if (deg >= 45 && deg < 135) return 'Right Wall';
    if (deg >= 135 && deg < 225) return 'Terrace Glass / Balcony';
    return 'Left Wall';
  };

  // Tooltip from Wall hover events
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ label: string | null; partId: string | null }>;
      setHoveredLabel(ce.detail.label);
    };
    window.addEventListener('viz-hover', handler);
    return () => window.removeEventListener('viz-hover', handler);
  }, []);

  // Loading screen timeout
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'z' || e.key === 'Z') { e.preventDefault(); undo(); }
      if (e.key === 'y' || e.key === 'Y') { e.preventDefault(); redo(); }
      if (e.key === 'r' || e.key === 'R') {
        window.__vizResetView?.();
      }
      if (e.key === 'Escape') selectPart(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectPart]);

  const handleClosePanel = useCallback(() => selectPart(null), [selectPart]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0B1530] font-sans">

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1530] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-5"
            >
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#9A7A20] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/30">
                <span className="text-[#0B1530] font-bold text-2xl font-serif tracking-wider">RT</span>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-serif font-bold text-[#D4AF37] tracking-wide">RAI TRADERS</h1>
                <p className="text-white/40 text-sm mt-1">3D Home Visualizer</p>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-[#D4AF37]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
              <p className="text-white/25 text-xs">Initialising 3D Scene…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-b from-[#0B1530]/90 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Back to site */}
          <a href="#/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1530]/80 backdrop-blur-md border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium hover:border-[#D4AF37]/60 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Site</span>
          </a>
          {/* Brand */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#D4AF37] font-serif font-bold text-lg">RT</span>
            <div>
              <p className="text-white text-xs font-semibold leading-tight">3D Home Visualizer</p>
              <p className="text-white/30 text-[10px] leading-tight">RAI TRADERS · Bhopal</p>
            </div>
          </div>
        </div>

        {/* Center: Compare Before / After Slider */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0B1530]/85 backdrop-blur-md border border-[#D4AF37]/30 shadow-lg">
          <button
            type="button"
            onClick={() => setBeforeAfterProgress(0)}
            className={`text-[10px] sm:text-xs uppercase font-bold tracking-wider transition-colors ${beforeAfterProgress < 50 ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white'}`}
            title="Switch to Before (Original)"
          >
            Before
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={beforeAfterProgress}
            onChange={(e) => setBeforeAfterProgress(parseInt(e.target.value, 10))}
            aria-label="Compare Before / After slider"
            className="w-16 sm:w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            title="Slide to compare Before (Original) vs After (Designed)"
          />
          <button
            type="button"
            onClick={() => setBeforeAfterProgress(100)}
            className={`text-[10px] sm:text-xs uppercase font-bold tracking-wider transition-colors ${beforeAfterProgress >= 50 ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white'}`}
            title="Switch to After (Designed)"
          >
            After
          </button>
        </div>

        {/* Undo / Redo & Reset */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button onClick={undo} disabled={historyIndex <= 0} aria-label="Undo (Z)" title="Undo (Z)"
            className="p-2 rounded-xl bg-[#0B1530]/70 backdrop-blur-md border border-white/10 text-white/50 hover:text-[#D4AF37] disabled:opacity-30 transition-colors">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} aria-label="Redo (Y)" title="Redo (Y)"
            className="p-2 rounded-xl bg-[#0B1530]/70 backdrop-blur-md border border-white/10 text-white/50 hover:text-[#D4AF37] disabled:opacity-30 transition-colors">
            <Redo2 className="w-4 h-4" />
          </button>
          <button onClick={() => { if (confirm('Reset all designs?')) clearAll(); }} title="Clear All" aria-label="Clear all designs"
            className="p-2 rounded-xl bg-[#0B1530]/70 backdrop-blur-md border border-white/10 text-white/50 hover:text-red-400 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Before indicator pill */}
      {beforeAfterProgress < 50 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1 rounded-full bg-navy-950/90 border border-gold-500/50 text-gold-400 text-[11px] font-semibold tracking-wider uppercase shadow-xl backdrop-blur-md pointer-events-none">
          Viewing Before (Original Walls)
        </div>
      )}

      {/* ── RoomSketcher 360 Panoramic Walkthrough Floating HUD ── */}
      {cameraMode === 'panorama' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none px-2 w-full max-w-xl">
          {/* Active 360 compass status pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1530]/90 border border-[#D4AF37]/50 shadow-2xl backdrop-blur-md pointer-events-auto">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#D4AF37] text-[11px] font-bold tracking-wide uppercase">
              360° Panoramic View
            </span>
            <span className="text-white/30 text-xs">|</span>
            <span className="text-white/85 text-[11px] font-medium font-mono">
              {headingAngle}° {getFacingDirection(headingAngle)}
            </span>
          </div>

          {/* Quick-Jump Vantage Point Buttons */}
          <div className="flex items-center gap-1 pointer-events-auto overflow-x-auto max-w-full py-0.5">
            {[
              { label: 'Feature Wall', yaw: 0, pitch: 0, icon: '🛋️' },
              { label: 'Terrace Glass', yaw: 180, pitch: 0, icon: '🪟' },
              { label: 'Left Wall', yaw: 270, pitch: 0, icon: '⬅️' },
              { label: 'Right Wall', yaw: 90, pitch: 0, icon: '➡️' },
              { label: 'Ceiling', yaw: 0, pitch: 48, icon: '⬆️' },
              { label: 'Floor', yaw: 0, pitch: -48, icon: '⬇️' },
            ].map((pt) => (
              <button
                key={pt.label}
                type="button"
                onClick={() => window.__vizLookDirection?.(pt.yaw, pt.pitch)}
                className="px-2.5 py-1 rounded-lg bg-[#0B1530]/85 hover:bg-[#D4AF37] hover:text-[#0B1530] border border-white/10 hover:border-[#D4AF37] text-white/75 text-[11px] font-medium backdrop-blur-md transition-all shadow-md shrink-0 whitespace-nowrap"
              >
                <span className="mr-1">{pt.icon}</span>
                <span className="hidden sm:inline">{pt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3D Canvas — fills the screen */}
      <HouseScene onReady={() => setIsLoading(false)} />

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredLabel && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-[#D4AF37] text-[#0B1530] text-xs font-bold shadow-lg pointer-events-none"
          >
            {hoveredLabel} — click to design
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint overlay */}
      <AnimatePresence>
        {showHints && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0B1530]/80 backdrop-blur-md border border-[#D4AF37]/20"
          >
            <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <p className="text-white/70 text-xs">
              {cameraMode === 'panorama' ? (
                <>
                  <span className="text-white">Drag anywhere</span> to look 360° around &nbsp;·&nbsp;
                  <span className="text-[#D4AF37]">Click any wall</span> to design &nbsp;·&nbsp;
                  <span className="text-white">360° View</span> for auto-tour
                </>
              ) : (
                <>
                  <span className="text-white">Drag</span> to rotate 360° &nbsp;·&nbsp;
                  <span className="text-white">Scroll</span> to zoom &nbsp;·&nbsp;
                  <span className="text-[#D4AF37]">Click any wall</span> to design it
                </>
              )}
            </p>
            <button onClick={dismissHints} aria-label="Dismiss hints"
              className="text-white/30 hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom control bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-2 px-4 pb-5 bg-gradient-to-t from-[#0B1530]/85 to-transparent pointer-events-none">

        {/* Exterior / Interior + Room tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 pointer-events-auto">
          {/* View mode toggle: Exterior | 3D Overview | 360° Panorama */}
          <div className="flex items-center rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#0B1530]/85 backdrop-blur-md shadow-xl">
            <button
              onClick={() => { setViewMode('exterior'); setCameraMode('orbit'); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${viewMode === 'exterior' ? 'bg-[#D4AF37] text-[#0B1530] font-bold' : 'text-white/60 hover:text-white'}`}
              title="Exterior 3D Architectural Villa"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Exterior</span>
            </button>
            <button
              onClick={() => { setViewMode('interior'); setCameraMode('orbit'); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${viewMode === 'interior' && cameraMode === 'orbit' ? 'bg-[#D4AF37] text-[#0B1530] font-bold' : 'text-white/60 hover:text-white'}`}
              title="3D Room Isometric Overview"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>3D Overview</span>
            </button>
            <button
              onClick={() => { setViewMode('interior'); setCameraMode('panorama'); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-colors ${cameraMode === 'panorama' ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0B1530] font-bold shadow-md' : 'text-white/70 hover:text-white'}`}
              title="RoomSketcher-style 360° Panoramic Walkthrough"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>360° Panorama</span>
            </button>
          </div>

          {/* Room selector — shown only in interior mode */}
          <AnimatePresence>
            {viewMode === 'interior' && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-1 overflow-hidden"
              >
                {ROOMS.map((r) => (
                  <button key={r.id} onClick={() => setCurrentRoom(r.id)}
                    aria-label={r.label}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium border backdrop-blur-md transition-colors whitespace-nowrap ${currentRoom === r.id ? 'bg-[#D4AF37] text-[#0B1530] border-[#D4AF37] font-semibold' : 'bg-[#0B1530]/70 text-white/50 border-white/10 hover:border-[#D4AF37]/30 hover:text-white'}`}
                  >
                    <span>{r.emoji}</span>
                    <span className="hidden sm:inline">{r.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom action row */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day/Night */}
          <button onClick={toggleDayNight} aria-label="Toggle day/night"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B1530]/80 backdrop-blur-md border border-white/10 text-white/60 text-xs hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-colors"
          >
            {dayNight === 'day' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden sm:inline">{dayNight === 'day' ? 'Night' : 'Day'}</span>
          </button>

          {/* Auto-rotate */}
          <button onClick={toggleAutoRotate} aria-label={isAutoRotating ? 'Stop rotation' : 'Start 360° rotation'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-medium transition-colors ${isAutoRotating ? 'bg-[#D4AF37] text-[#0B1530] border-[#D4AF37]' : 'bg-[#0B1530]/80 border-white/10 text-white/60 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]'}`}
          >
            {isAutoRotating ? <StopCircle className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAutoRotating ? 'Stop' : '360° View'}</span>
          </button>

          {/* Reset View */}
          <button onClick={() => window.__vizResetView?.()} title="Reset View (R)" aria-label="Reset view"
            className="px-3 py-2 rounded-xl bg-[#0B1530]/80 backdrop-blur-md border border-white/10 text-white/50 text-xs hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* WhatsApp */}
          <a href="#/contact"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-medium hover:bg-[#20ba59] transition-colors shadow-md"
            aria-label="Get free quote"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Get Free Quote</span>
          </a>
        </div>
      </div>

      {/* Design Panel (right side) */}
      <AnimatePresence>
        {selectedPartId && (
          <Panel key="design-panel" onClose={handleClosePanel} />
        )}
      </AnimatePresence>
    </div>
  );
};
