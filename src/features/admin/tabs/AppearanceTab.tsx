import React from 'react';
import { Palette, Type } from 'lucide-react';
import { useDraftStore } from '../../../store/draftStore';
import { useUiStore } from '../../../store/uiStore';

const COLOR_PRESETS = [
  { name: 'Royal Gold (Signature)', hex: '#D6A34D' },
  { name: 'Imperial Amber', hex: '#E6A122' },
  { name: 'Champagne Warmth', hex: '#C5A059' },
  { name: 'Emerald Regal', hex: '#2A7B62' },
  { name: 'Copper Bronze', hex: '#C86D51' },
];

export const AppearanceTab: React.FC = () => {
  const { draft, updateDraft } = useDraftStore();
  const showToast = useUiStore((s) => s.showToast);

  const appearance = draft.appearance;

  const handleColorChange = (hex: string) => {
    updateDraft((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        accentColor: hex,
      },
    }));
    document.documentElement.style.setProperty('--accent', hex);
    showToast(`Accent color updated to ${hex}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-[#FAF7F2]">
          Appearance, Luxury Palette & Typography
        </h2>
        <p className="text-xs text-[#A89F91]">
          Fine-tune royal brand colors, typography pairings, and micro-animation speeds.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        
        {/* Accent Color Preset Selector */}
        <div className="p-6 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-4">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[var(--accent)]" />
            <span>Signature Accent Color</span>
          </label>

          <div className="space-y-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => handleColorChange(preset.hex)}
                className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  appearance.accentColor === preset.hex
                    ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-white font-bold'
                    : 'border-[#2C241B] hover:border-[#3D3224] text-[#A89F91]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border border-black/30 shadow-inner"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span>{preset.name}</span>
                </div>
                <code className="text-[11px] text-[var(--accent)]">{preset.hex}</code>
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <span className="text-[11px] text-[#A89F91]">Custom Hex:</span>
            <input
              type="color"
              value={appearance.accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-9 h-9 rounded cursor-pointer border border-[#2C241B] bg-transparent"
            />
            <input
              type="text"
              value={appearance.accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-28 px-2 py-1 rounded border border-[#2C241B] bg-[#0D0B09] text-white"
            />
          </div>
        </div>

        {/* Typography Pairing */}
        <div className="p-6 rounded-2xl border border-[#2C241B] bg-[#14100C] space-y-4">
          <label className="font-semibold text-white flex items-center gap-1.5">
            <Type className="w-4 h-4 text-[var(--accent)]" />
            <span>Typography System</span>
          </label>

          <div className="space-y-3 text-[11px] text-[#C8BFB2]">
            <div className="p-3 rounded-xl bg-[#1A1612] border border-[#2C241B] space-y-1">
              <strong className="text-white block font-heading text-base">Cormorant Garamond (English)</strong>
              <p className="text-[11px] text-[#A89F91]">
                High-contrast serif inspired by 16th-century Italian craftsmanship, tailored for interior design excellence.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#1A1612] border border-[#2C241B] space-y-1">
              <strong className="text-white block font-serif text-base">Noto Serif Devanagari (हिन्दी)</strong>
              <p className="text-[11px] text-[#A89F91]">
                Traditional Devanagari typography paired perfectly for Hindi headlines and emotional resonance.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#1A1612] border border-[#2C241B] space-y-1">
              <strong className="text-white block font-sans text-sm">Plus Jakarta Sans (Body)</strong>
              <p className="text-[11px] text-[#A89F91]">
                Geometric sans-serif providing ultra-clean legibility on mobile screens and specification sheets.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
