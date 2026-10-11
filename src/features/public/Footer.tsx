import { Logo } from '../../components/common/Logo';
import React from 'react';
import { Phone, Mail, MapPin, Shield, ArrowUp, MessageCircle } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { BrandConfig } from '../../content/schema';

interface FooterProps {
  brand: BrandConfig;
}

export const Footer: React.FC<FooterProps> = ({ brand }) => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040E17] border-t border-gold-500/20 text-cream-300 text-xs pt-16 pb-12 overflow-hidden">
      {/* Decorative Gold Top Sheen */}
      <div className="absolute top-0 inset-x-0 gold-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="full" />

            <p className="text-xs text-cream-200 max-w-sm leading-relaxed">
              7+ years of master craftsmanship in Bhopal. Premier interior destination for luxury imported wallpapers, seamless wall murals, and artisan texture finishes across Madhya Pradesh.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${brand.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-medium hover:bg-[#25D366] hover:text-white transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={`tel:${brand.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-500/20 bg-[#0A1D30] text-cream-50 hover:border-[var(--accent)] transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{brand.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-cream-50 font-semibold block">
              Navigation
            </span>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-[var(--accent)] transition-colors">Services</a></li>
              <li><a href="#gallery" className="hover:text-[var(--accent)] transition-colors">Portfolio Gallery</a></li>
              <li><a href="#visualizer" className="hover:text-[var(--accent)] transition-colors">Room Visualizer</a></li>
              <li><a href="#texture-lab" className="hover:text-[var(--accent)] transition-colors">Texture Lab</a></li>
              <li><a href="#book-visit" className="hover:text-[var(--accent)] transition-colors">Book Free Visit</a></li>
              <li><a href="#reviews" className="hover:text-[var(--accent)] transition-colors">Client Reviews</a></li>
              <li><a href="#contact" className="hover:text-[var(--accent)] transition-colors">Contact Studio</a></li>
            </ul>
          </div>

          {/* Services Col */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-cream-50 font-semibold block">
              Specialties
            </span>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-[var(--accent)] transition-colors">Designer Wallpaper</a></li>
              <li><a href="#services" className="hover:text-[var(--accent)] transition-colors">Royal Painting</a></li>
              <li><a href="#services" className="hover:text-[var(--accent)] transition-colors">Italian Stucco</a></li>
              <li><a href="#services" className="hover:text-[var(--accent)] transition-colors">3D Wall Murals</a></li>
              <li><a href="#services" className="hover:text-[var(--accent)] transition-colors">Commercial Fitouts</a></li>
            </ul>
          </div>

          {/* Bhopal Studio Info Col */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-cream-50 font-semibold block">
              Bhopal Studio
            </span>
            <div className="space-y-2 text-cream-200">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>{t(brand.address)}, Bhopal, MP 462011</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>+91 7000302682</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>{brand.email}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Legal Notice */}
        <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cream-300/60">
          <p>© {new Date().getFullYear()} RAI TRADERS (Bhopal). All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="#/privacy" className="hover:text-cream-50 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#/terms" className="hover:text-cream-50 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#/admin" className="text-[var(--accent)] hover:underline inline-flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Admin Suite</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
