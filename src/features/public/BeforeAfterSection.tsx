import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { BeforeAfterItem } from '../../content/schema';

interface BeforeAfterSectionProps {
  items: BeforeAfterItem[];
  isEnabled?: boolean;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({ items, isEnabled = true }) => {
  const { t, currentLang } = useTranslation();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const activeItem = items[selectedIdx] || items[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percentage = Math.round((clamped / rect.width) * 100);
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      setSliderPosition(0);
    } else if (e.key === 'End') {
      setSliderPosition(100);
    }
  };

  if (!isEnabled || !activeItem) return null;

  return (
    <section id="before-after" className="py-24 bg-[#061522] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              {currentLang === 'hi' ? 'दीवारों का कायाकल्प' : 'Before & After Transformations'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            {t(activeItem.title)}
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <p className="text-sm sm:text-base text-cream-200/80 font-light">
            {t(activeItem.description)}
          </p>

          {/* Scenario Selector if multiple items */}
          {items.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedIdx(idx);
                    setSliderPosition(50);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedIdx === idx
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-bold shadow-md shadow-gold-500/20'
                      : 'border border-gold-500/20 bg-navy-900/60 text-cream-200 hover:text-gold-400'
                  }`}
                >
                  {t(item.title)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Slider Component */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-label="Before and after transformation slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={sliderPosition}
            tabIndex={0}
            className="relative select-none touch-none aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border-2 border-gold-500/35 shadow-2xl bg-black cursor-ew-resize focus:outline-none focus:ring-4 focus:ring-gold-500/50"
          >
            {/* "After" Image (Underneath) */}
            <img
              src={activeItem.afterImage}
              alt="After transformation"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85';
              }}
            />
            <span className="absolute top-4 right-4 px-3 py-1 rounded-md bg-navy-950/80 backdrop-blur-md text-xs font-bold text-gold-400 border border-gold-500/30 pointer-events-none">
              {t(activeItem.afterLabel) || (currentLang === 'hi' ? 'बदलाव के बाद' : 'AFTER (Rai Traders)')}
            </span>

            {/* "Before" Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeItem.beforeImage}
                alt="Before transformation"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-navy-950/80 backdrop-blur-md text-xs font-bold text-cream-200 border border-white/20 pointer-events-none">
                {t(activeItem.beforeLabel) || (currentLang === 'hi' ? 'बदलाव से पहले' : 'BEFORE')}
              </span>
            </div>

            {/* Vertical Splitter Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 via-white to-gold-600 pointer-events-none shadow-[0_0_12px_rgba(214,163,77,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-navy-900 border-2 border-gold-400 text-gold-400 flex items-center justify-center shadow-xl">
                <MoveHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Slider Keyboard Help */}
          <div className="mt-4 flex items-center justify-between text-xs text-cream-300">
            <span>{currentLang === 'hi' ? '← ड्रैग करें या कीबोर्ड एरो का उपयोग करें →' : '← Drag slider or use arrow keys →'}</span>
            <span className="font-semibold text-gold-400">{sliderPosition}% Split</span>
          </div>

        </div>

      </div>
    </section>
  );
};
