import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { ProcessStep } from '../../content/schema';

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ steps }) => {
  const { t } = useTranslation();

  return (
    <section id="process" className="py-24 bg-[#0A1D30]/90 border-t border-gold-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Our Working Process
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Seamless 4-Step Transformation
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed font-light">
            From free on-site wall measurement to precision pattern alignment and dust-free cleanup in Bhopal.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.step}
              className="relative p-6 rounded-2xl border border-gold-500/20 bg-[#061522]/85 hover:border-gold-400/60 shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                {/* Step badge */}
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-gold-400">
                    {step.step}
                  </span>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block w-4 h-4 text-gold-500/40 group-hover:text-gold-400 transition-colors" />
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors">
                  {t(step.title)}
                </h3>

                <p className="text-xs text-cream-200/80 leading-relaxed font-light">
                  {t(step.description)}
                </p>
              </div>

              <div className="pt-3 border-t border-navy-800 text-[11px] text-gold-400 font-medium">
                {t(step.detail)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
