import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Phone } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useContentStore } from '../../store/contentStore';
import { generateWhatsAppUrl } from '../../lib/whatsapp';

export const QuoteModal: React.FC = () => {
  const { isQuoteModalOpen, closeQuoteModal, selectedQuoteService, showToast } = useUiStore();
  const brand = useContentStore((s) => s.content.brand);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(selectedQuoteService || 'Premium Wallpaper Designing');
  const [room, setRoom] = useState('Living Room');
  const [dimensions, setDimensions] = useState('12x10 ft');

  if (!isQuoteModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    const url = generateWhatsAppUrl(brand.whatsappNumber, {
      clientName: name || undefined,
      phone,
      service: service || selectedQuoteService,
      roomType: room,
      notes: `Wall dimensions approx ${dimensions}. Please share catalog samples and quote.`,
    });

    closeQuoteModal();
    window.open(url, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Request Instant Quote"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="relative w-full max-w-lg bg-[#061522] border border-gold-500/25 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={closeQuoteModal}
          aria-label="Close quote modal"
          className="absolute top-4 right-4 p-2 rounded-full text-cream-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Consultation</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-cream-50">
            Get Free Quote & Wall Catalog
          </h3>
          <p className="text-xs text-cream-300">
            Direct connection with our design specialists in Zone 1, MP Nagar, Bhopal.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-cream-50 block mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Singhania"
              className="w-full px-4 py-2.5 rounded-xl border border-gold-500/25 bg-[#0A1D30] text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-cream-50 block mb-1">
              10-Digit Mobile *
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 7000302682"
              className="w-full px-4 py-2.5 rounded-xl border border-gold-500/25 bg-[#0A1D30] text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-cream-50 block mb-1">
                Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gold-500/25 bg-[#0A1D30] text-white focus:border-[var(--accent)] outline-none cursor-pointer"
              >
                <option value="Premium Wallpaper Designing">Wallpaper Designing</option>
                <option value="Professional Wall Painting">Wall Painting</option>
                <option value="Texture Wall Finishes">Texture Finishes</option>
                <option value="Custom 3D Wall Murals">3D Wall Murals</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-cream-50 block mb-1">
                Room / Space
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gold-500/25 bg-[#0A1D30] text-white focus:border-[var(--accent)] outline-none cursor-pointer"
              >
                <option value="Living Room">Living Room</option>
                <option value="Master Bedroom">Master Bedroom</option>
                <option value="Dining Space">Dining Space</option>
                <option value="Office / Commercial">Office / Commercial</option>
                <option value="Full House">Full House</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-cream-50 block mb-1">
              Approx Wall Size
            </label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 14 x 10 ft / 2 walls"
              className="w-full px-4 py-2.5 rounded-xl border border-gold-500/25 bg-[#0A1D30] text-white focus:border-[var(--accent)] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/20 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send via WhatsApp</span>
          </button>
        </form>

        {/* Footer call option */}
        <div className="pt-2 text-center border-t border-gold-500/25">
          <a
            href={`tel:${brand.phone}`}
            className="inline-flex items-center gap-1.5 text-xs text-cream-200 hover:text-[var(--accent)] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Or call us directly at <strong>{brand.phoneDisplay}</strong></span>
          </a>
        </div>

      </div>
    </div>
  );
};
