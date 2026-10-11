import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  MessageCircle,
  Sparkles,
  MapPin,
  Star,
  Award,
  Calendar,
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import type { BrandConfig, HeroConfig } from '../../content/schema';
import { generateQuickInquiryUrl } from '../../lib/whatsapp';

interface HeroProps {
  hero: HeroConfig;
  brand: BrandConfig;
}

export const Hero: React.FC<HeroProps> = ({ hero, brand }) => {
  const openQuoteModal = useUiStore((s) => s.openQuoteModal);

  const whatsappInquiryUrl = generateQuickInquiryUrl(brand.whatsappNumber);

  return (
    <section id="home" className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-16 pb-16 overflow-hidden bg-[#061522]">
      {/* Background Image with Ambient Parallax & Motion */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
        {/* Deep Midnight Navy Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#061522] via-[#061522]/85 to-[#061522]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061522]/98 via-[#061522]/75 to-[#061522]/45" />
        {/* Subtle Gold Dust Glow Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(214,163,77,0.18),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* Top Prestige Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900/80 border border-gold-500/35 text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span>PREMIUM WALL DESIGN & FINISHING • BHOPAL</span>
            </motion.div>

            {/* Main Luxury Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-cream-50"
            >
              Transform Your Walls.{' '}
              <span className="block mt-2 text-gold-gradient">
                Elevate Your Living Space.
              </span>
            </motion.h1>

            {/* 7+ Years Master Craftsmanship Showcase Plaque */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex flex-wrap sm:flex-nowrap items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-navy-900/40 border border-gold-500/30 backdrop-blur-md shadow-xl"
            >
              <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-500/40 flex flex-col items-center justify-center text-gold-400 shrink-0 shadow-inner">
                <span className="font-serif font-black text-lg leading-none">7+</span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-gold-300">Years</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold tracking-wider uppercase text-gold-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gold-400" />
                  <span>7+ Years of Master Craftsmanship in Bhopal</span>
                </p>
                <p className="text-xs text-cream-200/80 font-light">
                  1,200+ residential & commercial wall transformations completed with flawless precision.
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-cream-200/85 max-w-2xl font-light leading-relaxed"
            >
              Discover Bhopal’s finest collection of imported luxury wallpapers, artisanal Venetian textures, and expert wall finishes. Tailored design consultations with on-site shade matching.
            </motion.p>

            {/* Action CTAs Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2 flex flex-wrap items-center gap-3.5"
            >
              {/* Primary CTA */}
              <button
                onClick={() => openQuoteModal()}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-navy-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 shadow-xl shadow-gold-500/20 hover:shadow-gold-400/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                <span>Get Free Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Book Site Visit CTA */}
              <a
                href="#book-visit"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-cream-100 border border-gold-500/40 bg-navy-900/70 backdrop-blur-md hover:bg-gold-500/15 hover:border-gold-400 transition-all duration-300 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Book On-Site Visit</span>
              </a>

              {/* Visualizer Jump Button */}
              <a
                href="#visualizer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-cream-100 border border-gold-500/30 bg-navy-900/50 backdrop-blur-md hover:bg-gold-500/15 hover:border-gold-400 transition-all duration-300 whitespace-nowrap"
              >
                <Eye className="w-4 h-4 text-gold-400" />
                <span>3D Wall Visualizer</span>
              </a>

              {/* WhatsApp direct chat button */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide text-[#25D366] border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all duration-300 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </motion.div>

            {/* Trust Badges Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-cream-300/90 border-t border-navy-800/80"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>7+ Years Bhopal Legacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>500+ Imported Wallpapers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>Free On-Site Catalogue Visit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                <span>German Heavy-Duty Adhesive</span>
              </div>
            </motion.div>

          </div>

          {/* Curated Preview Card Column */}
          <div className="lg:col-span-4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-6 rounded-3xl border border-gold-500/30 relative group shadow-2xl shadow-black/80"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold-500/15">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-gold-400 uppercase">
                    Bhopal Portfolio
                  </span>
                  <h3 className="font-serif text-lg text-cream-100 font-semibold">
                    Signature Finishes
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Mini Preview Gallery */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="relative rounded-xl overflow-hidden group/thumb aspect-video bg-navy-950">
                  <img
                    src="https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80"
                    alt="Gold Damask Wallpaper"
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent flex items-end p-2">
                    <span className="text-[10px] text-cream-200 font-medium">Gold Damask</span>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden group/thumb aspect-video bg-navy-950">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
                    alt="Venetian Stucco Texture Wall"
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent flex items-end p-2">
                    <span className="text-[10px] text-cream-200 font-medium">Venetian Stucco</span>
                  </div>
                </div>
              </div>

              {/* Studio Rating & Location Tag */}
              <div className="flex items-center justify-between text-xs text-cream-300 pt-3 border-t border-navy-800">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  MP Nagar Zone 1, Bhopal
                </span>
                <div className="flex items-center gap-1 text-gold-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-white text-[11px]">5.0</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Gold Accent Divider Line */}
      <div className="absolute bottom-0 inset-x-0 gold-divider" />
    </section>
  );
};
