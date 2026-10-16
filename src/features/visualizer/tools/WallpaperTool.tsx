import React, { useState } from 'react';
import { WALLPAPER_CATALOG } from '../materials/proceduralTextures';
import { useVisualizerStore } from '../store/visualizerStore';

export const WallpaperTool: React.FC = () => {
  const {
    selectedPartId,
    selectedPartLabel,
    selectedPartLabelHi,
    designs,
    applyDesign,
    activeRoom,
    language,
  } = useVisualizerStore();

  const isHi = language === 'hi';
  const currentDesign = selectedPartId ? designs[selectedPartId] : undefined;

  const [selectedWpId, setSelectedWpId] = useState(
    currentDesign?.wallpaperId || 'royal-damask'
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [scale, setScale] = useState(currentDesign?.wallpaperScale || 1.0);
  const [rotation, setRotation] = useState(currentDesign?.wallpaperRotation || 0);

  const selectedWp = WALLPAPER_CATALOG.find((w) => w.id === selectedWpId) || WALLPAPER_CATALOG[0];
  const [tint, setTint] = useState(currentDesign?.wallpaperTint || selectedWp.defaultTint);

  const filtered = activeCategory === 'all'
    ? WALLPAPER_CATALOG
    : WALLPAPER_CATALOG.filter((w) => w.category === activeCategory);

  const handleApplySingle = () => {
    if (!selectedPartId) return;
    applyDesign(selectedPartId, {
      type: 'wallpaper',
      wallpaperId: selectedWpId,
      wallpaperTint: tint,
      wallpaperScale: scale,
      wallpaperRotation: rotation,
    });
  };

  const handleApplyAccent = () => {
    applyDesign(`${activeRoom}/accent-wall`, {
      type: 'wallpaper',
      wallpaperId: selectedWpId,
      wallpaperTint: tint,
      wallpaperScale: scale,
      wallpaperRotation: rotation,
    });
  };

  return (
    <div className="space-y-4 text-xs font-sans text-white/90">
      {/* Target surface info banner */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950/70 border border-gold-500/30">
        <div>
          <p className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
            {isHi ? 'चयनित वॉलपेपर सतह' : 'Selected Wallpaper Wall'}
          </p>
          <p className="text-white font-semibold text-xs mt-0.5">
            {isHi ? selectedPartLabelHi || selectedPartLabel || 'दीवार चुनें' : selectedPartLabel || 'Select a wall'}
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: isHi ? 'सभी' : 'All' },
          { id: 'luxury', label: isHi ? 'रॉयल गोल्ड' : 'Luxury Gold' },
          { id: 'geometric', label: isHi ? 'जियोमेट्रिक' : 'Geometric' },
          { id: 'floral', label: isHi ? 'फ्लोरल / लीव्स' : 'Botanical' },
          { id: 'texture', label: isHi ? 'टेक्सचर / स्लेट्स' : 'Textures' },
          { id: 'scandinavian', label: isHi ? 'स्कैंडिनेवियन' : 'Scandi' },
          { id: 'kids', label: isHi ? 'किड्स' : 'Kids' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-gold-500 text-navy-950 font-bold shadow'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Wallpapers Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
        {filtered.map((wp) => {
          const isSelected = selectedWpId === wp.id;
          return (
            <button
              key={wp.id}
              type="button"
              onClick={() => {
                setSelectedWpId(wp.id);
                setTint(wp.defaultTint);
              }}
              className={`p-2 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'border-gold-400 bg-gold-500/20 shadow-lg scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <div
                className="w-full h-14 rounded-lg shadow-inner mb-1.5 flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: wp.defaultTint === '#D4AF37' ? '#141822' : '#F6F4EE',
                  color: wp.defaultTint,
                }}
              >
                <span className="text-[11px] font-mono opacity-85">
                  {wp.name.split(' ')[0]}
                </span>
              </div>
              <p className="text-[11px] font-bold text-white truncate">
                {isHi ? wp.nameHi : wp.name}
              </p>
              <p className="text-[9px] text-white/40 uppercase font-mono">{wp.category}</p>
            </button>
          );
        })}
      </div>

      {/* Custom Tint, Scale & Rotation Controls */}
      <div className="p-3 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-3">
        {/* Tint Color */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/70">{isHi ? 'वॉलपेपर टिंट / फॉयल रंग' : 'Wallpaper Foil Tint'}:</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={tint}
              onChange={(e) => setTint(e.target.value)}
              className="w-6 h-6 rounded border border-white/20 cursor-pointer bg-transparent"
            />
            <span className="text-[10px] font-mono text-gold-400 font-bold">{tint}</span>
          </div>
        </div>

        {/* Pattern Scale Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/60">{isHi ? 'पैटर्न स्केल (रिपीट आकार)' : 'Pattern Repeat Scale'}:</span>
            <span className="text-gold-400 font-mono font-bold">{scale.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-gold-500 cursor-pointer"
          />
        </div>

        {/* Rotation Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/60">{isHi ? 'रोटेशन एंगल' : 'Pattern Rotation'}:</span>
            <span className="text-gold-400 font-mono font-bold">{rotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            step="15"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-white/20 rounded accent-gold-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={handleApplySingle}
          disabled={!selectedPartId}
          className="w-full py-2.5 rounded-xl bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {isHi ? 'इस दीवार पर वॉलपेपर लगाएं' : 'Apply Wallpaper to Wall'}
        </button>

        <button
          type="button"
          onClick={handleApplyAccent}
          className="w-full py-2 rounded-xl bg-navy-900 border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 font-bold text-xs transition-colors"
        >
          {isHi ? 'एक्सेंट फीचर वॉल पर लगाएं' : 'Set as Accent Feature Wall'}
        </button>
      </div>
    </div>
  );
};
