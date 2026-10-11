import React from 'react';
import { CheckCircle2, Quote } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { AboutConfig } from '../../content/schema';

interface AboutSectionProps {
  about: AboutConfig;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 bg-[#061522] relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Column with Prompt 1 Double Gold Frame */}
          <div className="lg:col-span-5 relative">
            {/* Gold Frame Accent */}
            <div className="absolute -inset-3 sm:-inset-4 rounded-2xl border border-gold-500/25 -rotate-1 hidden sm:block pointer-events-none" />

            <div className="relative rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl shadow-black/80 group">
              <img
                src={about.image}
                alt="Rai Traders Craftsmanship in Bhopal"
                className="w-full h-[450px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
              
              {/* Experience Plaque */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-navy-900/95 backdrop-blur-md border border-gold-500/30 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold-500/15 border border-gold-500/40 flex flex-col items-center justify-center text-gold-400 shrink-0">
                  <span className="font-serif font-black text-base leading-none">7+</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold">Years</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold block">
                    Bhopal Heritage &bull; Zone 1 MP Nagar
                  </span>
                  <p className="text-sm font-semibold text-cream-100">
                    7+ Years of Master Interior Craftsmanship
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text and Values Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                7+ Years of Dedicated Craftsmanship in Bhopal
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 leading-tight">
                {about.heading?.en || t(about.heading)}
              </h2>
            </div>

            <p className="text-base text-cream-200/85 leading-relaxed font-light">
              {about.description?.en || t(about.description)}
            </p>

            {/* Founder Quote */}
            <div className="relative p-5 rounded-xl border-l-4 border-l-gold-500 bg-navy-900/70 border border-gold-500/25 shadow-sm backdrop-blur-sm">
              <Quote className="w-5 h-5 text-gold-400/40 absolute top-4 right-4" />
              <p className="italic text-base sm:text-lg text-cream-100 leading-relaxed font-serif">
                "{about.quote?.en || t(about.quote)}"
              </p>
              <span className="block mt-2 text-xs uppercase tracking-wider text-gold-400/90 font-medium font-sans">
                — RAI TRADERS, Bhopal
              </span>
            </div>

            {/* Core Values Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {about.values.map((val) => (
                <div
                  key={val.id}
                  className="p-4 rounded-xl border border-gold-500/20 bg-navy-900/50 hover:bg-navy-900/80 hover:border-gold-400/40 transition-all duration-300 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-gold-400 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-cream-100 font-serif">{t(val.title)}</span>
                  </div>
                  <p className="text-xs text-cream-300/80 leading-relaxed pl-6 font-light">
                    {t(val.description)}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
