import React from 'react';

interface LogoProps {
  variant?: 'full' | 'monogram' | 'compact';
  className?: string;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  return (
    <div className={`flex items-center gap-3 select-none shrink-0 ${className}`}>
      {/* RT Monogram with Architectural Roof Motif */}
      <div className="relative group cursor-pointer shrink-0">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-[#0A1D30] to-[#061522] p-[1px] border border-gold-500/40 shadow-lg shadow-black/40 group-hover:border-gold-400 transition-all duration-300">
          <div className="w-full h-full rounded-[7px] bg-[#07192A] flex items-center justify-center relative overflow-hidden">
            {/* Subtle roof gable line at top */}
            <svg
              viewBox="0 0 44 44"
              className="w-8 h-8 text-gold-400 group-hover:scale-105 transition-transform duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="rtGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F9E7C4" />
                  <stop offset="50%" stopColor="#D6A34D" />
                  <stop offset="100%" stopColor="#9C6F28" />
                </linearGradient>
              </defs>

              {/* Roof Peak Motif */}
              <path
                d="M22 6L35 15.5L33 17.5L22 9.5L11 17.5L9 15.5L22 6Z"
                fill="url(#rtGold)"
              />
              <circle cx="22" cy="7" r="1.5" fill="#F9E7C4" />

              {/* RT Monogram Letters */}
              <text
                x="11"
                y="33"
                fontFamily="'Cinzel', serif"
                fontWeight="700"
                fontSize="18"
                fill="url(#rtGold)"
                letterSpacing="1"
              >
                RT
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Text Block — Strict single line prevention */}
      {variant !== 'monogram' && (
        <div className="flex flex-col justify-center whitespace-nowrap leading-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold tracking-[0.08em] text-gold-gradient uppercase drop-shadow-sm whitespace-nowrap leading-tight">
              RAI TRADERS
            </span>
          </div>
              <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-sans font-medium tracking-[0.16em] uppercase text-cream-200/90 whitespace-nowrap mt-0.5">
                Wallpaper Designing &bull; Wall Painting
              </span>
        </div>
      )}
    </div>
  );
};
