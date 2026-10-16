import React from 'react';
import { useVisualizerStore } from '../store/visualizerStore';

interface FloatingWallToolbarProps {
  onOpenPaintTab: () => void;
  onOpenWallpaperTab: () => void;
}

export const FloatingWallToolbar: React.FC<FloatingWallToolbarProps> = ({
  onOpenPaintTab,
  onOpenWallpaperTab,
}) => {
  const {
    selectedPartId,
    selectedPartLabel,
    selectedPartLabelHi,
    designs,
    language,
    selectPart,
    resetPart,
    applyToWholeRoom,
  } = useVisualizerStore();

  if (!selectedPartId) return null;

  const currentDesign = designs[selectedPartId];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 animate-fade-in pointer-events-auto">
      <div className="bg-navy-950/95 border border-gold-500/40 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
        {/* Wall indicator with active swatch */}
        <div className="flex items-center gap-2">
          {currentDesign?.type === 'color' ? (
            <span
              className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: currentDesign.colorHex }}
            />
          ) : currentDesign?.type === 'wallpaper' ? (
            <span
              className="w-4 h-4 rounded-full border border-gold-400/60 bg-gold-500/30 flex items-center justify-center text-[9px]"
              title={currentDesign.wallpaperId}
            >
              📜
            </span>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
          )}

          <div>
            <div className="text-xs font-bold text-gold-300">
              {language === 'hi' ? selectedPartLabelHi || selectedPartLabel : selectedPartLabel}
            </div>
            <div className="text-[10px] text-gray-400">
              {language === 'hi' ? 'चुनी गई दीवार' : 'Selected Surface'}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-navy-800" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPaintTab}
            className="px-2.5 py-1 text-xs rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-200 hover:text-gold-300 border border-navy-700/80 hover:border-gold-500/40 transition-all flex items-center gap-1"
          >
            <span>🎨</span>
            <span>{language === 'hi' ? 'रंग चुनें' : 'Paint'}</span>
          </button>

          <button
            onClick={onOpenWallpaperTab}
            className="px-2.5 py-1 text-xs rounded-lg bg-navy-900 hover:bg-gold-500/20 text-gray-200 hover:text-gold-300 border border-navy-700/80 hover:border-gold-500/40 transition-all flex items-center gap-1"
          >
            <span>✨</span>
            <span>{language === 'hi' ? 'वॉलपेपर' : 'Wallpaper'}</span>
          </button>

          {currentDesign && (
            <button
              onClick={() => applyToWholeRoom(currentDesign)}
              title={language === 'hi' ? 'पूरे कमरे पर यही रंग लगाएं' : 'Apply this finish to whole room'}
              className="px-2 py-1 text-xs rounded-lg bg-navy-900 hover:bg-navy-800 text-gray-300 hover:text-white border border-navy-700 transition-all text-[11px]"
            >
              {language === 'hi' ? 'पूरे कमरे में' : 'All Walls'}
            </button>
          )}

          <button
            onClick={() => resetPart(selectedPartId)}
            title={language === 'hi' ? 'दीवार रीसेट करें' : 'Reset this wall'}
            className="px-2 py-1 text-xs rounded-lg bg-navy-900 hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-navy-700 hover:border-red-500/40 transition-all text-[11px]"
          >
            {language === 'hi' ? 'रीसेट' : 'Reset'}
          </button>

          <button
            onClick={() => selectPart(null)}
            className="p-1 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors ml-1"
            title="Deselect"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
