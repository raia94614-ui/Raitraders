import React, { useState } from 'react';
import { Eye, Sparkles, Tag } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import { useUiStore } from '../../store/uiStore';
import type { GalleryItem } from '../../content/schema';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const { t, currentLang } = useTranslation();
  const openLightbox = useUiStore((s) => s.openLightbox);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: currentLang === 'hi' ? 'सभी डिजाइन' : 'All Designs' },
    { id: 'Living Room', label: currentLang === 'hi' ? 'लिविंग रूम' : 'Living Room' },
    { id: 'Bedroom', label: currentLang === 'hi' ? 'मास्टर बेडरूम' : 'Master Bedroom' },
    { id: 'Wall Textures', label: currentLang === 'hi' ? 'टेक्सचर' : 'Textures' },
    { id: '3D Murals', label: currentLang === 'hi' ? '3D म्यूरल्स' : '3D Murals' },
  ];

  const filteredItems = gallery
    .filter((item) =>
      activeCategory === 'all'
        ? true
        : item.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
          item.roomType.toLowerCase().includes(activeCategory.toLowerCase())
    )
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleOpenLightbox = (index: number) => {
    openLightbox(filteredItems, index);
  };

  return (
    <section id="gallery" className="py-24 bg-[#0A1D30]/90 border-t border-gold-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-navy-900/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              {currentLang === 'hi' ? 'प्रोजेक्ट गैलरी' : 'Interactive Design Gallery'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            {currentLang === 'hi' ? 'हमारे उत्कृष्ट वॉल डिजाइन' : 'Completed Projects & Wall Concepts'}
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed font-light">
            {currentLang === 'hi'
              ? 'भोपाल के प्रमुख घरों, शोरूमों एवं विला में स्थापित वास्तविक व कॉन्सेप्ट वॉलपेपर डिजाइन।'
              : 'Browse our curated collection of luxury residential and commercial wall styling projects across Bhopal.'}
          </p>

          {/* Filter Categories */}
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const titleStr = t(item.title);

            return (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative rounded-2xl overflow-hidden border border-gold-500/20 bg-[#061522]/90 shadow-xl hover:shadow-2xl hover:border-gold-400/60 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer aspect-[4/3]"
              >
                <img
                  src={item.image}
                  alt={titleStr}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85';
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061522] via-[#061522]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-navy-950/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-gold-300 border border-gold-500/30">
                    {item.roomType || item.category}
                  </span>

                  {item.isSampleImage ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gold-500/20 border border-gold-500/40 text-gold-300 backdrop-blur-md">
                      <Tag className="w-2.5 h-2.5" />
                      {currentLang === 'hi' ? 'नमूना' : 'Sample'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
                      {currentLang === 'hi' ? 'सत्यापित' : 'Real Project'}
                    </span>
                  )}
                </div>

                {/* Bottom Content & Zoom Action */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors">
                      {titleStr}
                    </h3>
                    <p className="text-xs text-cream-300/80 line-clamp-1 font-light">
                      {t(item.caption)}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 hover:bg-gold-500/40 text-gold-400 flex items-center justify-center backdrop-blur-md shrink-0 ml-2 group-hover:scale-110 transition-transform">
                    <Eye className="w-4 h-4" />
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
