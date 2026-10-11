import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Sparkles, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { WhyChooseUsItem } from '../../content/schema';

interface WhyChooseUsSectionProps {
  items: WhyChooseUsItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  shield: <ShieldCheck className="w-6 h-6 text-gold-400" />,
  award: <Award className="w-6 h-6 text-gold-400" />,
  heart: <HeartHandshake className="w-6 h-6 text-gold-400" />,
  sparkles: <Sparkles className="w-6 h-6 text-gold-400" />,
};

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ items }) => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#061522] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              The Rai Traders Standard
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Why Discerning Clients Choose Rai Traders
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed font-light">
            7+ years of master craftsmanship, imported heavy-duty German adhesives, and laser-straight vertical alignment for lasting perfection across Bhopal.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-gold-500/20 bg-navy-900/60 hover:bg-navy-900/90 hover:border-gold-400/50 hover:-translate-y-1 transition-all duration-300 space-y-3 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-500/20 transition-all duration-300">
                {iconMap[item.icon] || <CheckCircle className="w-6 h-6 text-gold-400" />}
              </div>

              <h3 className="font-serif text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors">
                {t(item.title)}
              </h3>

              <p className="text-xs text-cream-300/80 leading-relaxed font-light">
                {t(item.description)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
