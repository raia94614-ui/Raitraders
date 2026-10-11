import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { FaqItem } from '../../content/schema';

interface FaqSectionProps {
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const { t } = useTranslation();
  const [openIds, setOpenIds] = useState<string[]>([faqs[0]?.id || '']);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const sorted = [...faqs].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section id="faq" className="py-24 bg-[#0A1D30]/90 border-t border-gold-500/20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Frequently Asked Questions
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Everything You Need to Know
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <p className="text-sm sm:text-base text-cream-200/80 font-light">
            Clear answers on wall dampness treatments, maintenance, lifespan, and German adhesives from Bhopal's trusted wall specialists.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {sorted.map((item) => {
            const isOpen = openIds.includes(item.id);
            const questionStr = t(item.question);
            const answerStr = t(item.answer);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-gold-400/60 bg-[#061522] shadow-xl shadow-gold-500/5'
                    : 'border-gold-500/20 bg-navy-950/70 hover:border-gold-500/40'
                }`}
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gold-400 shrink-0" />
                    <span className="font-serif font-semibold text-base sm:text-lg text-cream-50">
                      {questionStr}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-cream-300 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-gold-400 border-gold-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-cream-200/85 leading-relaxed border-t border-navy-800 pl-12 font-light">
                    {answerStr}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
