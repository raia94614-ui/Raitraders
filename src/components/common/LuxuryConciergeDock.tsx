import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Calendar, Calculator, Eye, ArrowUp } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';

interface LuxuryConciergeDockProps {
  phone: string;
  whatsappNumber: string;
}

export const LuxuryConciergeDock: React.FC<LuxuryConciergeDockProps> = ({
  phone,
  whatsappNumber,
}) => {
  const { currentLang } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsapp = whatsappNumber.replace(/\D/g, '') || '917000302682';

  return (
    <aside
      aria-label="Concierge and Fast Actions"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-fit pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#0A1D30]/95 backdrop-blur-xl border border-gold-500/35 shadow-[0_8px_32px_rgba(0,0,0,0.65)] text-xs">
        
        {/* Book Visit Anchor */}
        <a
          href="#book-visit"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black font-bold uppercase tracking-wider text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-md whitespace-nowrap"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{currentLang === 'hi' ? 'विज़िट बुक करें' : 'Book Visit'}</span>
        </a>

        {/* Visualizer Anchor */}
        <a
          href="#visualizer"
          className="hidden md:flex items-center gap-1 px-3 py-2 rounded-xl border border-gold-500/20 bg-navy-950/80 text-white hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors whitespace-nowrap text-[11px] font-medium"
        >
          <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>3D Room</span>
        </a>

        {/* Cost Estimator Anchor */}
        <a
          href="#calculator"
          className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl border border-gold-500/20 bg-navy-950/80 text-white hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors whitespace-nowrap text-[11px] font-medium"
        >
          <Calculator className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Estimator</span>
        </a>

        {/* WhatsApp Direct */}
        <a
          href={`https://wa.me/${cleanWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#25D366] text-white font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-[#25D366]/20"
          title="WhatsApp Consultation"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Phone Call */}
        <a
          href={`tel:${phone}`}
          className="p-2 rounded-xl border border-gold-500/20 bg-navy-950/80 text-white hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors flex items-center justify-center"
          title={`Call: ${phone}`}
        >
          <Phone className="w-4 h-4 text-[var(--accent)]" />
        </a>

        {/* Scroll Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl border border-gold-500/20 bg-navy-950/80 text-[#A89F91] hover:text-white transition-colors cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

      </div>
    </aside>
  );
};
