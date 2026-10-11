import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Phone,
  User,
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { generateWhatsAppUrl } from '../../lib/whatsapp';

interface SiteVisitBookingSectionProps {
  whatsappNumber: string;
}

const BHOPAL_LOCALITIES = [
  'Zone 1, MP Nagar',
  'Zone 2, MP Nagar',
  'Arera Colony (E-1 to E-7)',
  'Gulmohar Colony',
  'Kolar Road / Chuna Bhatti',
  'Shahpura / Bawadiya Kalan',
  'Trilanga / Rohit Nagar',
  'Koh-e-Fiza & VIP Road',
  'Hoshangabad Road (Misrod)',
  'Ayodhya Bypass / Minal',
  'Other Locality in Bhopal',
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning Slot', hours: '10:00 AM – 01:00 PM' },
  { id: 'afternoon', label: 'Afternoon Slot', hours: '02:00 PM – 05:00 PM' },
  { id: 'evening', label: 'Evening Slot', hours: '05:00 PM – 08:00 PM' },
];

export const SiteVisitBookingSection: React.FC<SiteVisitBookingSectionProps> = ({
  whatsappNumber,
}) => {
  const showToast = useUiStore((s) => s.showToast);

  // Generate next 7 calendar dates
  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    };
  });

  const [selectedDate, setSelectedDate] = useState(nextDates[0].iso);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0].id);
  const [locality, setLocality] = useState(BHOPAL_LOCALITIES[0]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [roomType, setRoomType] = useState('Master Bedroom');
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientPhone || clientPhone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const slotObj = TIME_SLOTS.find((s) => s.id === selectedSlot);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#D6A34D', '#F3D18B', '#FFFFFF', '#25D366'],
      });
    } catch {
      // ignore
    }

    setIsBooked(true);
    showToast('Site measurement reserved! Opening WhatsApp confirmation...', 'success');

    const url = generateWhatsAppUrl(whatsappNumber, {
      clientName: clientName || undefined,
      phone: clientPhone,
      service: `FREE On-Site Wall Measurement & Catalog Presentation`,
      locality,
      roomType,
      notes: `Preferred Date: ${selectedDate} • Time Slot: ${slotObj?.label} (${slotObj?.hours}). Please bring physical wallpaper swatch books to my doorstep.`,
    });

    setTimeout(() => {
      window.open(url, '_blank');
    }, 600);
  };

  return (
    <section id="book-visit" className="py-24 bg-[#061522] relative overflow-hidden border-t border-[#1C1814]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[#0A1D30]/90">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Direct Booking Calendar
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Book Free On-Site Wall Measurement in Bhopal
          </h2>

          <p className="text-sm sm:text-base text-cream-300">
            Select your preferred date and time slot. Our master craftsmen with 7+ years of expertise visit your premises across Bhopal with complete physical swatch collections.
          </p>
        </div>

        {/* Booking Form Layout */}
        <div className="max-w-4xl mx-auto bg-[#0A1D30]/90 border border-gold-500/20 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {isBooked && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>
                Your site measurement slot is reserved! Opening WhatsApp confirmation chat.
              </span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 text-xs">
            
            {/* Step 1: Select Date */}
            <div className="space-y-3">
              <span className="font-semibold text-white flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[var(--accent)]" />
                <span>1. Select Preferred Date:</span>
              </span>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {nextDates.map((d) => (
                  <button
                    type="button"
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedDate === d.iso
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-black font-bold shadow-lg shadow-[#D6A34D]/25'
                        : 'border-gold-500/20 bg-[#061522] text-cream-300 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] uppercase block opacity-80">{d.dayName}</span>
                    <strong className="text-sm block">{d.dayNumber}</strong>
                    <span className="text-[10px] block opacity-80">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Time Slot */}
            <div className="space-y-3">
              <span className="font-semibold text-white flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[var(--accent)]" />
                <span>2. Select Convenient Time Slot:</span>
              </span>

              <div className="grid sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSlot === slot.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-white font-bold ring-1 ring-[var(--accent)]'
                        : 'border-gold-500/20 bg-[#061522] text-cream-300 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-semibold">{slot.label}</p>
                    <span className="text-[11px] text-[var(--accent)] block mt-0.5">{slot.hours}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Bhopal Locality & Contact */}
            <div className="space-y-3 pt-2 border-t border-gold-500/20">
              <span className="font-semibold text-white flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                <span>3. Project Address & Contact:</span>
              </span>

              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Locality */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cream-200">Bhopal Locality / Colony *</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-white focus:border-[var(--accent)] outline-none cursor-pointer"
                  >
                    {BHOPAL_LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cream-200">Primary Space to Style</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-white focus:border-[var(--accent)] outline-none cursor-pointer"
                  >
                    <option value="Master Bedroom">Master Bedroom</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Dining Area">Dining Area</option>
                    <option value="Kids Room">Kids Room</option>
                    <option value="Commercial Office / Showroom">Commercial Office / Showroom</option>
                    <option value="Full House Makeover">Full House Makeover</option>
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cream-200">Your Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[var(--accent)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Alok Saxena"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-white focus:border-[var(--accent)] outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cream-200">10-Digit Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[var(--accent)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. 7000302682"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-white focus:border-[var(--accent)] outline-none"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-4 border-t border-gold-500/20">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-[#D6A34D] via-[#E2B96F] to-[#B37F2E] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-xl shadow-[#D6A34D]/25 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm Free Site Visit & Open WhatsApp</span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-cream-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  100% Free Doorstep Consultation
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Physical Swatches Brought to You
                </span>
              </div>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};
