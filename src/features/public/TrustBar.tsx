import React from 'react';
import { Sparkles, Clock, Ruler, CheckCircle, ShieldCheck, Palette, HeartHandshake } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { TrustHighlight } from '../../content/schema';

interface TrustBarProps {
  highlights: TrustHighlight[];
}

const iconMap: Record<string, React.ReactNode> = {
  shield: <ShieldCheck className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  clock: <Clock className="w-5 h-5" />,
  ruler: <Ruler className="w-5 h-5" />,
  palette: <Palette className="w-5 h-5" />,
  handshake: <HeartHandshake className="w-5 h-5" />,
};

export const TrustBar: React.FC<TrustBarProps> = ({ highlights }) => {
  const { t } = useTranslation();

  return (
    <section className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gold-500/30 bg-[#0A1D30]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gold-500/20">
          {highlights.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-start gap-4 ${idx > 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}
            >
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-sm">
                {iconMap[item.icon] || <CheckCircle className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-semibold text-base text-cream-100">
                  {t(item.title)}
                </h3>
                <p className="text-xs text-cream-300/80 leading-relaxed font-light">
                  {t(item.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
