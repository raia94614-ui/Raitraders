import React from 'react';
import { SMART_PALETTES, type SmartPalette } from './SmartPaletteGenerator';
import { useVisualizerStore } from '../store/visualizerStore';
import { Sparkles, Check } from 'lucide-react';

export const SmartPaletteTool: React.FC = () => {
  const { appliedSmartPalette, applySmartPalette, language } = useVisualizerStore();
  const isHi = language === 'hi';

  const handleApply = (palette: SmartPalette) => {
    applySmartPalette(palette.id, {
      accentColor: palette.accentColor,
      wallColor: palette.wallColor,
      ceilingColor: palette.ceilingColor,
      wallpaperId: palette.wallpaperId,
      finish: palette.finish,
    });
  };

  return (
    <div className="space-y-4">
      {/* Introduction banner */}
      <div className="bg-navy-950/80 p-3 rounded-2xl border border-gold-500/30 flex items-start gap-3">
        <div className="p-2 bg-gold-500/20 rounded-xl text-gold-300">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gold-300">
            {isHi ? '1-क्लिक डिज़ाइन पैलेट' : 'Designer-Curated Palettes'}
          </h4>
          <p className="text-[11px] text-gray-400 leading-snug">
            {isHi
              ? 'आर्किटेक्ट द्वारा चुने गए रंग संयोजन जो पूरे कमरे (दीवार, एक्सेंट वॉल, सीलिंग) पर एक साथ लागू होते हैं।'
              : 'Harmonious color schemes crafted by interior architects for ceiling, accent, and main walls.'}
          </p>
        </div>
      </div>

      {/* Palettes List */}
      <div className="space-y-3">
        {SMART_PALETTES.map((pal) => {
          const isSelected = appliedSmartPalette === pal.id;

          return (
            <div
              key={pal.id}
              onClick={() => handleApply(pal)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-navy-900 border-gold-400 shadow-lg shadow-gold-500/10'
                  : 'bg-navy-950/70 border-navy-800 hover:border-gold-500/40 hover:bg-navy-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                    {isHi ? pal.nameHi : pal.name}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] text-gold-400 bg-gold-500/20 px-2 py-0.5 rounded-full border border-gold-400/40 font-semibold">
                      <Check className="w-3 h-3" />
                      {isHi ? 'लागू' : 'Applied'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-wider">
                  <span>{pal.finish}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mb-3 leading-tight">
                {isHi ? pal.descriptionHi : pal.description}
              </p>

              {/* Swatch Previews */}
              <div className="flex items-center justify-between pt-2 border-t border-navy-800/80">
                <div className="flex items-center gap-2">
                  {/* Accent Swatch */}
                  <div className="flex items-center gap-1.5" title="Accent Wall">
                    <span
                      className="w-5 h-5 rounded-lg border border-white/30 shadow"
                      style={{ backgroundColor: pal.accentColor }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {isHi ? 'एक्सेंट' : 'Accent'}
                    </span>
                  </div>

                  {/* Main Wall Swatch */}
                  <div className="flex items-center gap-1.5" title="Main Walls">
                    <span
                      className="w-5 h-5 rounded-lg border border-white/30 shadow"
                      style={{ backgroundColor: pal.wallColor }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {isHi ? 'दीवार' : 'Wall'}
                    </span>
                  </div>

                  {/* Ceiling Swatch */}
                  <div className="flex items-center gap-1.5" title="Ceiling">
                    <span
                      className="w-5 h-5 rounded-lg border border-white/30 shadow"
                      style={{ backgroundColor: pal.ceilingColor }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {isHi ? 'छत' : 'Ceiling'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(pal);
                  }}
                  className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-navy-950 border border-gold-500/40 transition-all"
                >
                  {isHi ? 'लागू करें' : 'Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
