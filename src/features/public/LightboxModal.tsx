import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useTranslation } from '../../store/contentStore';

export const LightboxModal: React.FC = () => {
  const { lightbox, closeLightbox, setLightboxIndex } = useUiStore();
  const { t, currentLang } = useTranslation();

  const activeItem = lightbox.items[lightbox.activeIndex];

  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        if (lightbox.activeIndex < lightbox.items.length - 1) {
          setLightboxIndex(lightbox.activeIndex + 1);
        } else {
          setLightboxIndex(0);
        }
      } else if (e.key === 'ArrowLeft') {
        if (lightbox.activeIndex > 0) {
          setLightboxIndex(lightbox.activeIndex - 1);
        } else {
          setLightboxIndex(lightbox.items.length - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, lightbox.activeIndex, lightbox.items.length, closeLightbox, setLightboxIndex]);

  if (!lightbox.isOpen || !activeItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox Preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6"
    >
      {/* Close button */}
      <button
        onClick={closeLightbox}
        aria-label="Close Lightbox"
        className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {lightbox.items.length > 1 && (
        <button
          onClick={() =>
            setLightboxIndex(
              lightbox.activeIndex > 0 ? lightbox.activeIndex - 1 : lightbox.items.length - 1
            )
          }
          aria-label="Previous Image"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
        <div className="relative overflow-hidden rounded-xl shadow-2xl max-h-[70vh]">
          <img
            src={activeItem.image}
            alt={t(activeItem.title)}
            className="w-auto h-auto max-h-[70vh] max-w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85';
            }}
          />
        </div>

        {/* Captions and Sample Indicator */}
        <div className="mt-4 text-center max-w-2xl space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-heading text-xl font-bold text-white">
              {t(activeItem.title)}
            </h3>
            {activeItem.isSampleImage ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#D6A34D]/20 border border-[#D6A34D]/40 text-[#E6C687]">
                <Tag className="w-3 h-3" />
                {currentLang === 'hi' ? 'नमूना अवधारणा' : 'Sample Concept'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                {currentLang === 'hi' ? 'सत्यापित प्रोजेक्ट' : 'Authentic Project'}
              </span>
            )}
          </div>

          {activeItem.caption && (
            <p className="text-xs text-stone-300">
              {t(activeItem.caption)}
            </p>
          )}

          <div className="text-[11px] text-stone-400">
            {lightbox.activeIndex + 1} / {lightbox.items.length}
          </div>
        </div>
      </div>

      {/* Next button */}
      {lightbox.items.length > 1 && (
        <button
          onClick={() =>
            setLightboxIndex(
              lightbox.activeIndex < lightbox.items.length - 1 ? lightbox.activeIndex + 1 : 0
            )
          }
          aria-label="Next Image"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
