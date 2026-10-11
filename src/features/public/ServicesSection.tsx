import React, { useState } from 'react';
import { MessageCircle, Check, Sparkles } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import { useUiStore } from '../../store/uiStore';
import type { ServiceItem } from '../../content/schema';
import { generateQuickInquiryUrl } from '../../lib/whatsapp';

interface ServicesSectionProps {
  services: ServiceItem[];
  whatsappNumber: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, whatsappNumber }) => {
  const { t } = useTranslation();
  const openQuoteModal = useUiStore((s) => s.openQuoteModal);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'wallpaper', label: 'Wallpapers' },
    { id: 'paint', label: 'Wall Painting' },
    { id: 'texture', label: 'Textures' },
    { id: 'custom', label: 'Custom 3D' },
  ];

  const filteredServices = services
    .filter((s) => s.isActive !== false)
    .filter((s) => (activeCategory === 'all' ? true : s.category.toLowerCase().includes(activeCategory)))
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section id="services" className="py-24 bg-[#0A1D30]/90 border-t border-gold-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Prompt 1 Gold Divider */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Bespoke Interior Finishes
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Luxury Wall Solutions in Bhopal
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed font-light">
            From imported European designer wallpapers to Italian stucco textures and bespoke 3D wall murals, crafted with 7+ years of flawless execution in Bhopal.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-navy-950 shadow-md shadow-gold-500/25 font-bold'
                    : 'border border-gold-500/20 bg-navy-900/60 text-cream-200 hover:text-gold-400 hover:border-gold-400/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const titleStr = t(service.title);
            const inquiryUrl = generateQuickInquiryUrl(whatsappNumber, titleStr);

            return (
              <div
                key={service.id}
                className="group rounded-2xl border border-gold-500/20 bg-[#061522]/85 hover:border-gold-400/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-gold-500/10"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                  <img
                    src={service.image}
                    alt={titleStr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061522] via-transparent to-transparent opacity-85" />
                  
                  {/* Category Chip */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-navy-950/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-gold-400 border border-gold-500/30">
                    {service.category}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-cream-50 group-hover:text-gold-400 transition-colors">
                      {titleStr}
                    </h3>
                    <p className="text-xs text-cream-200/80 leading-relaxed font-light">
                      {t(service.description)}
                    </p>
                  </div>

                  {/* Key Feature Bullets */}
                  <ul className="space-y-1.5 pt-2 border-t border-navy-800">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-cream-300">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span>{t(feat)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="pt-4 flex items-center gap-2">
                    <a
                      href={inquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 text-xs font-semibold transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Quote</span>
                    </a>

                    <button
                      onClick={() => openQuoteModal(titleStr)}
                      title="Request Consultation"
                      className="p-2.5 rounded-xl border border-gold-500/30 hover:border-gold-400 bg-navy-900/60 text-cream-100 hover:text-gold-400 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-gold-400" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
