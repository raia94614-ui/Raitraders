import React, { useState, useEffect, Suspense } from 'react';
import {
  useVisualizerStore,
  ROOMS_METADATA,
  type LightingTime,
  type RoomId,
} from '../store/visualizerStore';

const INTERIOR_ROOMS = ROOMS_METADATA.filter(
  (r) => r.id !== 'exterior'
);
import { VisualizerCanvas } from '../scene/VisualizerCanvas';
import { FloatingWallToolbar } from './FloatingWallToolbar';
import { GuidedTourModal } from './GuidedTourModal';
import { QuoteLeadModal } from './QuoteLeadModal';
import { FloorplanMinimap } from '../rooms/FloorplanMinimap';
import { PaintTool } from '../tools/PaintTool';
import { WallpaperTool } from '../tools/WallpaperTool';
import { SmartPaletteTool } from '../tools/SmartPaletteTool';
import { ProjectsTool } from '../tools/ProjectsTool';
import { PhotoRoomPainter } from '../tools/PhotoRoomPainter';
import { encodeDesignToUrlHash, decodeDesignFromUrlHash } from '../store/persistence';
import {
  Paintbrush,
  Sparkles,
  Layers,
  Camera,
  FolderKanban,
  RotateCcw,
  Undo2,
  Redo2,
  Compass,
  Sun,
  Sunset,
  Moon,
  Smartphone,
  HelpCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sliders,
  Check,
} from 'lucide-react';

type SidebarTab = 'paint' | 'wallpaper' | 'palettes' | 'projects';

export const VisualizerView: React.FC = () => {
  const {
    activeRoom,
    setActiveRoom,
    cameraMode,
    setCameraMode,
    lightingTime,
    setLightingTime,
    isAutoRotating,
    toggleAutoRotate,
    gyroEnabled,
    designs,
    history,
    historyIndex,
    undo,
    redo,
    resetCurrentRoom,
    beforeAfterProgress,
    setBeforeAfterProgress,
    photoUploadActive,
    setPhotoUploadActive,
    setGuidedTourOpen,
    setQuoteModalOpen,
    language,
    toggleLanguage,
    loadDesignsState,
  } = useVisualizerStore();

  const isHi = false; // Always English UI per user request
  const [lastInteriorRoom, setLastInteriorRoom] = useState<RoomId>('living');
  const [activeTab, setActiveTab] = useState<SidebarTab>('paint');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [compassHeading, setCompassHeading] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPhotoCapturing, setIsPhotoCapturing] = useState(false);

  // Keep track of the last interior room visited
  useEffect(() => {
    if (activeRoom !== 'exterior') {
      setLastInteriorRoom(activeRoom);
    }
  }, [activeRoom]);

  // Check URL hash for shared design on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const decoded = decodeDesignFromUrlHash(window.location.hash);
      if (decoded) {
        loadDesignsState(decoded.designs, decoded.room);
      }
    }
  }, [loadDesignsState]);

  // Listen to 360 compass heading event
  useEffect(() => {
    const handleHeading = (e: Event) => {
      const detail = (e as CustomEvent<{ angle: number }>).detail;
      if (detail && typeof detail.angle === 'number') {
        setCompassHeading(detail.angle);
      }
    };
    window.addEventListener('viz-heading', handleHeading);
    return () => window.removeEventListener('viz-heading', handleHeading);
  }, []);

  const handleShareLink = () => {
    const hash = encodeDesignToUrlHash(designs, activeRoom);
    const fullUrl = `${window.location.origin}${window.location.pathname}#/visualizer${hash}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCaptureScreenshot = () => {
    setIsPhotoCapturing(true);
    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.__vizCanvas) {
          const dataUrl = window.__vizCanvas.toDataURL('image/png', 1.0);
          const link = document.createElement('a');
          link.download = `RAI-Traders-${activeRoom}-design.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch (e) {
        console.warn('Screenshot error:', e);
      }
      setIsPhotoCapturing(false);
    }, 150);
  };

  const handleDirectionClick = (yawDeg: number, pitchDeg = 0) => {
    if (typeof window !== 'undefined' && window.__vizLookDirection) {
      window.__vizLookDirection(yawDeg, pitchDeg);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-navy-950 font-sans select-none flex flex-col">
      {/* ════════════════════════════════════════════════════════════════
          TOP NAVIGATION BAR (Well-maintained, clean, 100% English)
      ════════════════════════════════════════════════════════════════ */}
      <header className="h-16 bg-navy-950/95 border-b border-gold-500/30 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 gap-2">
        {/* Left: Brand Logo & Back to Home */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#/"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-300 transition-colors pr-2 border-r border-navy-800"
            title="Back to Home"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-serif font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
              RAI TRADERS
            </span>
            <span className="hidden lg:inline-flex items-center text-[10px] uppercase font-bold tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full">
              Bhopal 3D Studio
            </span>
          </div>
        </div>

        {/* Center: Main Exterior vs Interior Segmented Switcher */}
        <div className="bg-navy-900/90 border border-gold-500/30 rounded-2xl p-1 flex items-center gap-1 shadow-inner shrink-0">
          <button
            onClick={() => setActiveRoom('exterior')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoom === 'exterior'
                ? 'bg-gradient-to-r from-gold-500 via-amber-400 to-gold-400 text-navy-950 shadow-md shadow-gold-500/20'
                : 'text-gray-300 hover:text-white hover:bg-navy-800'
            }`}
            title="Villa Exterior 360° Panorama"
          >
            <span>🏡</span>
            <span>Exterior</span>
          </button>
          <button
            onClick={() => {
              if (activeRoom === 'exterior') {
                setActiveRoom(lastInteriorRoom || 'living');
              }
            }}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeRoom !== 'exterior'
                ? 'bg-gradient-to-r from-gold-500 via-amber-400 to-gold-400 text-navy-950 shadow-md shadow-gold-500/20'
                : 'text-gray-300 hover:text-white hover:bg-navy-800'
            }`}
            title="Explore Interior Rooms"
          >
            <span>🛋️</span>
            <span>Interior</span>
          </button>
        </div>

        {/* Right: Camera Mode, Lighting & Instant Doorstep Quote CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 360 Walkthrough vs Dollhouse Toggle */}
          <div className="bg-navy-900 border border-gold-500/30 rounded-xl p-0.5 hidden sm:flex items-center">
            <button
              onClick={() => setCameraMode('inside_360')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                cameraMode === 'inside_360'
                  ? 'bg-gold-500 text-navy-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Inside 360° Panoramic Walkthrough"
            >
              <span>🔄</span>
              <span>360° Walk</span>
            </button>
            <button
              onClick={() => setCameraMode('dollhouse')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                cameraMode === 'dollhouse'
                  ? 'bg-gold-500 text-navy-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Dollhouse Cutaway 3D Overview"
            >
              <span>🏠</span>
              <span>3D Overview</span>
            </button>
          </div>

          {/* Lighting Mode Toggle (Day / Evening / Night) */}
          <div className="bg-navy-900 border border-navy-800 rounded-xl p-0.5 flex items-center">
            {(['day', 'evening', 'night'] as LightingTime[]).map((time) => {
              const isActive = lightingTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setLightingTime(time)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    isActive ? 'bg-navy-800 text-gold-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title={`${time.charAt(0).toUpperCase() + time.slice(1)} lighting`}
                >
                  {time === 'day' && <Sun className="w-3.5 h-3.5" />}
                  {time === 'evening' && <Sunset className="w-3.5 h-3.5" />}
                  {time === 'night' && <Moon className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Guided Tour (?) */}
          <button
            onClick={() => setGuidedTourOpen(true)}
            className="p-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-800 text-gray-400 hover:text-gold-300 transition-colors"
            title="Guided Tour"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Instant Doorstep Quote CTA */}
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 shadow-md shadow-gold-500/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>💬</span>
            <span className="whitespace-nowrap">Get Quote</span>
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          SECONDARY DEDICATED SUB-BAR (Rooms or Exterior Bar)
      ════════════════════════════════════════════════════════════════ */}
      {activeRoom !== 'exterior' ? (
        <div className="bg-navy-950/95 border-b border-gold-500/20 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar shrink-0 z-20">
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-gold-400 font-bold uppercase tracking-wider">
            <span>🛋️</span>
            <span className="hidden sm:inline">Rooms:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {INTERIOR_ROOMS.map((r) => {
              const isActive = r.id === activeRoom;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRoom(r.id);
                    setLastInteriorRoom(r.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-navy-950 font-bold shadow-md shadow-gold-500/20 scale-[1.02]'
                      : 'bg-navy-900/80 text-gray-300 hover:text-white hover:bg-navy-800 border border-navy-800'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setActiveRoom('exterior')}
            className="hidden md:flex items-center gap-1 text-[11px] text-gray-400 hover:text-gold-300 transition-colors shrink-0 pl-2 border-l border-navy-800"
            title="Switch back to Exterior Villa"
          >
            <span>🏡</span>
            <span>Back to Exterior</span>
          </button>
        </div>
      ) : (
        <div className="bg-navy-950/95 border-b border-gold-500/20 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar shrink-0 z-20">
          <div className="flex items-center gap-2 text-xs text-gold-300 font-semibold shrink-0">
            <span>🏡</span>
            <span>Contemporary Villa Exterior</span>
            <span className="hidden sm:inline-block text-[10px] text-gray-400 bg-navy-900 px-2 py-0.5 rounded-full border border-navy-800">
              360° Interactive View &middot; Drag cursor to inspect from all angles
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-gray-400 hidden lg:inline">Quick Jump Inside:</span>
            <button
              onClick={() => {
                setActiveRoom('living');
                setLastInteriorRoom('living');
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 transition-colors flex items-center gap-1"
            >
              <span>🛋️</span>
              <span>Living Room</span>
            </button>
            <button
              onClick={() => {
                setActiveRoom('master_bedroom');
                setLastInteriorRoom('master_bedroom');
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 transition-colors flex items-center gap-1"
            >
              <span>🛏️</span>
              <span>Master Bedroom</span>
            </button>
            <button
              onClick={() => {
                setActiveRoom('kitchen');
                setLastInteriorRoom('kitchen');
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 transition-colors flex items-center gap-1"
            >
              <span>🍳</span>
              <span>Modular Kitchen</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MAIN 3D CANVAS & OVERLAYS CONTAINER
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Three.js 3D Viewport with Suspense Fallback */}
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-navy-950 text-white gap-4">
              <div className="w-16 h-16 border-4 border-gold-500/20 border-t-gold-400 rounded-full animate-spin shadow-lg" />
              <div className="text-center">
                <p className="text-lg font-serif font-bold text-gold-300">
                  Crafting 3D Architecture...
                </p>
                <p className="text-xs text-gray-400">RAI TRADERS, Zone-1 MP Nagar, Bhopal</p>
              </div>
            </div>
          }
        >
          <VisualizerCanvas />
        </Suspense>

        {/* Floating Wall Contextual Quick Actions */}
        <FloatingWallToolbar
          onOpenPaintTab={() => {
            setActiveTab('paint');
            setSidebarOpen(true);
          }}
          onOpenWallpaperTab={() => {
            setActiveTab('wallpaper');
            setSidebarOpen(true);
          }}
        />

        {/* 2D Floorplan Minimap (Bottom Left) */}
        <div className="absolute bottom-16 left-4 z-20 hidden md:block">
          <FloorplanMinimap />
        </div>

        {/* 360 Cardinal Direction & Compass Overlay (Top Left) */}
        {cameraMode === 'inside_360' && (
          <div className="absolute top-4 left-4 z-20 flex flex-col items-center gap-1.5 bg-navy-950/80 border border-gold-500/30 rounded-2xl p-2 backdrop-blur-md shadow-xl text-white">
            <div className="flex items-center gap-1 text-[10px] text-gold-400 font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{compassHeading}°</span>
            </div>

            {/* Cardinal Jump Buttons */}
            <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold">
              <span />
              <button
                onClick={() => handleDirectionClick(0, 0)}
                className="w-7 h-7 rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 flex items-center justify-center transition-colors"
                title="North / Front Wall"
              >
                N
              </button>
              <button
                onClick={() => handleDirectionClick(0, 75)}
                className="w-7 h-7 rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 flex items-center justify-center transition-colors text-[9px]"
                title="Look at Ceiling"
              >
                UP
              </button>

              <button
                onClick={() => handleDirectionClick(270, 0)}
                className="w-7 h-7 rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 flex items-center justify-center transition-colors"
                title="West / Left Wall"
              >
                W
              </button>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.__vizResetView) {
                    window.__vizResetView();
                  }
                }}
                className="w-7 h-7 rounded-lg bg-gold-500/20 hover:bg-gold-500/40 text-gold-300 border border-gold-500/40 flex items-center justify-center transition-colors text-[9px]"
                title="Center Reset"
              >
                ●
              </button>
              <button
                onClick={() => handleDirectionClick(90, 0)}
                className="w-7 h-7 rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 flex items-center justify-center transition-colors"
                title="East / Right Wall"
              >
                E
              </button>

              <span />
              <button
                onClick={() => handleDirectionClick(180, 0)}
                className="w-7 h-7 rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 flex items-center justify-center transition-colors"
                title="South / Back Wall"
              >
                S
              </button>
              <button
                onClick={() => handleDirectionClick(0, -75)}
                className="w-7 h-7 rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-navy-800 flex items-center justify-center transition-colors text-[9px]"
                title="Look at Floor"
              >
                DN
              </button>
            </div>
          </div>
        )}

        {/* Before / After Slider Control (Top Center Floating) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-navy-950/85 border border-gold-500/30 rounded-2xl px-4 py-2 backdrop-blur-md shadow-xl flex items-center gap-3">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            Original
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={beforeAfterProgress}
            onChange={(e) => setBeforeAfterProgress(Number(e.target.value))}
            className="w-24 sm:w-36 h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
            title="Before / After Compare Slider"
          />
          <span className="text-[10px] text-gold-300 uppercase tracking-wider font-semibold">
            New Design
          </span>
        </div>

        {/* Bottom Quick Action Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-navy-950/90 border border-gold-500/30 rounded-2xl px-3 py-1.5 backdrop-blur-md shadow-2xl flex items-center gap-1.5 sm:gap-2">
          {/* Undo */}
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`p-2 rounded-xl transition-colors ${
              historyIndex <= 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-gold-300 hover:bg-navy-900'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-xl transition-colors ${
              historyIndex >= history.length - 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 hover:text-gold-300 hover:bg-navy-900'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-navy-800" />

          {/* Auto-Rotate 360 */}
          <button
            onClick={toggleAutoRotate}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isAutoRotating
                ? 'bg-gold-500/20 border border-gold-500/50 text-gold-300 animate-pulse'
                : 'text-gray-300 hover:text-white hover:bg-navy-900'
            }`}
            title="Auto-rotate 360°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">360° Spin</span>
          </button>

          {/* Gyroscope (on supported devices) */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.__vizRequestGyro) {
                window.__vizRequestGyro();
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              gyroEnabled
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                : 'text-gray-300 hover:text-white hover:bg-navy-900'
            }`}
            title="Motion Gyroscope Tracking"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gyro</span>
          </button>

          <div className="h-5 w-px bg-navy-800" />

          {/* Upload Room Photo Tool */}
          <button
            onClick={() => setPhotoUploadActive(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-gold-300 hover:bg-navy-900 transition-colors flex items-center gap-1.5"
            title="Upload customer's actual room photo"
          >
            <Camera className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden md:inline">Upload Photo</span>
          </button>

          {/* Share Design Link */}
          <button
            onClick={handleShareLink}
            className="p-2 rounded-xl text-gray-300 hover:text-gold-300 hover:bg-navy-900 transition-colors relative"
            title="Copy shareable design link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* HD Screenshot Capture */}
          <button
            onClick={() => handleCaptureScreenshot()}
            disabled={isPhotoCapturing}
            className="p-2 rounded-xl text-gray-300 hover:text-gold-300 hover:bg-navy-900 transition-colors"
            title="Download HD Room Screenshot"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Reset Room */}
          <button
            onClick={resetCurrentRoom}
            className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-navy-900 transition-colors"
            title="Reset current room finishes"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT SLIDE-OUT DESIGN WORKBENCH SIDEBAR
        ════════════════════════════════════════════════════════════════ */}
        <div
          className={`absolute top-0 right-0 h-full w-84 sm:w-96 bg-navy-950/95 border-l border-gold-500/30 backdrop-blur-xl z-20 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Collapse / Expand Tab Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-1/2 -left-8 -translate-y-1/2 w-8 h-16 bg-navy-950/90 border-y border-l border-gold-500/30 rounded-l-2xl text-gold-400 flex items-center justify-center shadow-xl hover:text-white transition-colors"
            title={sidebarOpen ? 'Collapse Tools' : 'Open Tools'}
          >
            {sidebarOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Sidebar Tab Header */}
          <div className="p-3 border-b border-navy-800/80 bg-navy-900/60 flex items-center justify-between gap-1">
            <button
              onClick={() => setActiveTab('paint')}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                activeTab === 'paint'
                  ? 'bg-gold-500/20 border border-gold-500/40 text-gold-300 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Paint</span>
            </button>

            <button
              onClick={() => setActiveTab('wallpaper')}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                activeTab === 'wallpaper'
                  ? 'bg-gold-500/20 border border-gold-500/40 text-gold-300 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Wallpaper</span>
            </button>

            <button
              onClick={() => setActiveTab('palettes')}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                activeTab === 'palettes'
                  ? 'bg-gold-500/20 border border-gold-500/40 text-gold-300 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Palettes</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                activeTab === 'projects'
                  ? 'bg-gold-500/20 border border-gold-500/40 text-gold-300 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </button>
          </div>

          {/* Sidebar Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'paint' && <PaintTool />}
            {activeTab === 'wallpaper' && <WallpaperTool />}
            {activeTab === 'palettes' && <SmartPaletteTool />}
            {activeTab === 'projects' && <ProjectsTool />}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODALS & OVERLAYS
      ════════════════════════════════════════════════════════════════ */}
      <GuidedTourModal />
      <QuoteLeadModal />

      {/* Photo Room Painter Overlay */}
      {photoUploadActive && (
        <PhotoRoomPainter
          onClose={() => setPhotoUploadActive(false)}
          isHi={false}
        />
      )}
    </div>
  );
};
