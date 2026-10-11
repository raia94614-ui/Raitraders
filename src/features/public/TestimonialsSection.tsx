import React from 'react';
import { Star, Quote, MapPin, CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { TestimonialItem } from '../../content/schema';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const { t } = useTranslation();

  const approved = testimonials.filter((tItem) => tItem.isApproved !== false);

  return (
    <section id="reviews" className="py-24 bg-[#061522] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Customer Testimonials
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Trusted by Homeowners Across Bhopal
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed font-light">
            7+ years of 5-star feedback from prestigious residential and commercial clients across MP Nagar, Arera Colony, Gulmohar, and Kolar Road.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approved.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-gold-500/20 bg-navy-900/60 hover:bg-navy-900/90 hover:border-gold-400/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-gold-400/30" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed italic font-light">
                  "{t(item.review)}"
                </p>
              </div>

              {/* Author & Service Meta */}
              <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-cream-50 flex items-center gap-1">
                    {item.clientName}
                    <span title="Verified Bhopal Client">
                      <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    </span>
                  </h4>
                  <span className="text-[11px] text-cream-300/80 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gold-400" />
                    {t(item.location)}
                  </span>
                </div>

                <span className="text-[10px] uppercase font-semibold px-2.5 py-1 rounded-md bg-gold-500/10 text-gold-400 border border-gold-500/25">
                  {t(item.serviceUsed)}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
