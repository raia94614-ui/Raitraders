import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Shield, Sparkles, MapPin } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import type { BrandConfig } from '../../content/schema';
import { generateQuickInquiryUrl } from '../../lib/whatsapp';
import { Logo } from '../../components/common/Logo';

interface NavbarProps {
  brand: BrandConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ brand }) => {
  const openQuoteModal = useUiStore((s) => s.openQuoteModal);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = generateQuickInquiryUrl(brand.whatsappNumber);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#visualizer', label: '3D Studio' },
    { href: '#texture-lab', label: 'Texture Lab' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#book-visit', label: 'Book Visit' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#061522]/95 backdrop-blur-md border-b border-gold-500/20 shadow-2xl shadow-black/50 transition-colors duration-200">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Identity */}
          <a href="#" className="flex items-center shrink-0 focus:outline-none py-1">
            <Logo variant="full" />
          </a>

          {/* Desktop Navigation Links (>= lg: 1024px) */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-6" aria-label="Main Navigation">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-wider text-cream-200/90 hover:text-gold-400 font-medium transition-colors whitespace-nowrap py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop & Tablet Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Phone button (Icon on lg, full number on xl+, hidden on mobile to save space) */}
            <a
              href={`tel:${brand.phone}`}
              aria-label={`Call Rai Traders at ${brand.phoneDisplay}`}
              title={`Call ${brand.phoneDisplay}`}
              className="hidden lg:flex items-center gap-2 px-2.5 xl:px-3.5 py-1.5 rounded-lg border border-gold-500/30 bg-navy-900/60 text-xs font-medium text-cream-100 hover:text-gold-400 hover:border-gold-400 transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="hidden xl:inline">{brand.phoneDisplay}</span>
            </a>

            {/* Quote Modal Trigger */}
            <button
              onClick={() => openQuoteModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-navy-950 font-bold text-xs tracking-wider uppercase hover:brightness-110 active:scale-98 transition-all shadow-md shadow-gold-500/25 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Get Quote</span>
            </button>

            {/* Admin Link Icon (Desktop only) */}
            <a
              href="#/admin"
              title="Admin Panel"
              aria-label="Admin Panel Login"
              className="hidden lg:flex p-1.5 sm:p-2 rounded-lg border border-transparent text-cream-300 hover:text-gold-400 hover:border-gold-500/30 transition-colors shrink-0"
            >
              <Shield className="w-4 h-4" />
            </a>

            {/* Mobile / Tablet Menu Button (< lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden p-2 rounded-lg text-cream-100 hover:text-gold-400 hover:bg-navy-900/50 border border-gold-500/20 focus:outline-none shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gold-400" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer (Only visible on screens < lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1D30] border-b border-gold-500/25 px-5 pt-4 pb-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-cream-100 hover:text-gold-400 py-1.5 border-b border-gold-500/10 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-gold-400 text-xs">&rarr;</span>
              </a>
            ))}
          </nav>

          <div className="pt-3 space-y-2.5">
            <a
              href={`tel:${brand.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gold-500/30 text-sm font-medium text-cream-100 bg-navy-900/60 hover:border-gold-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Call: {brand.phoneDisplay}</span>
            </a>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-medium shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Consultation</span>
            </a>

            <div className="pt-2 flex justify-between items-center text-xs text-cream-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                Bhopal, MP Nagar (Zone 1)
              </span>
              <a href="#/admin" className="text-gold-400 hover:underline flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Admin Portal
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
