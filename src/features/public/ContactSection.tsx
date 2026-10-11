import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import { useUiStore } from '../../store/uiStore';
import type { BrandConfig } from '../../content/schema';
import { generateWhatsAppUrl } from '../../lib/whatsapp';

interface ContactSectionProps {
  brand: BrandConfig;
}

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  service: z.string().min(1, 'Please select a service'),
  locality: z.string().min(2, 'Please specify your area in Bhopal'),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactSection: React.FC<ContactSectionProps> = ({ brand }) => {
  const { t, currentLang } = useTranslation();
  const showToast = useUiStore((s) => s.showToast);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      service: 'Premium Wallpaper Designing',
      locality: 'Zone 1, MP Nagar',
    },
  });

  const onSubmit = (data: ContactFormData) => {
    const url = generateWhatsAppUrl(brand.whatsappNumber, {
      clientName: data.fullName,
      phone: data.phone,
      service: data.service,
      locality: data.locality,
      notes: data.notes,
    });

    setIsSubmitted(true);
    showToast('Thank you! Redirecting your inquiry to WhatsApp...', 'success');

    // Open WhatsApp in new tab
    window.open(url, '_blank');
    reset();
  };

  return (
    <section id="contact" className="py-24 bg-[#061522] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-[#0A1D30]/90">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
              Free Consultation & Measurement
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Transform Your Walls with Rai Traders
          </h2>

          <p className="text-sm sm:text-base text-cream-300/80">
            7+ years of master craftsmanship in Bhopal. Schedule a free measurement visit with full catalog albums delivered directly to your doorstep.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Direct Brand Contact Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl border border-gold-500/20 bg-[#0A1D30]/90 space-y-6 shadow-xl">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                  Studio Headquarters
                </span>
                <h3 className="font-serif text-2xl font-bold text-cream-50 mt-1">
                  {brand.businessName}
                </h3>
                <p className="text-xs text-cream-300/80 mt-1">
                  {t(brand.tagline)}
                </p>
              </div>

              {/* Info Badges */}
              <div className="space-y-4 pt-4 border-t border-gold-500/20">
                
                {/* Phone */}
                <a
                  href={`tel:${brand.phone}`}
                  className="flex items-start gap-3.5 group text-sm text-cream-50 hover:text-gold-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-cream-300/80 font-medium block">
                      Direct Calling Line
                    </span>
                    <strong className="text-base font-semibold">{brand.phoneDisplay}</strong>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${brand.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group text-sm text-cream-50 hover:text-[#25D366] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-cream-300/80 font-medium block">
                      Instant WhatsApp Chat
                    </span>
                    <strong className="text-base font-semibold">+91 {brand.whatsappNumber}</strong>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${brand.email}`}
                  className="flex items-start gap-3.5 group text-sm text-cream-50 hover:text-gold-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-cream-300/80 font-medium block">
                      Official Inquiries
                    </span>
                    <strong className="text-sm font-semibold">{brand.email}</strong>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-3.5 text-sm text-cream-50">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-cream-300/80 font-medium block">
                      Bhopal Studio Location
                    </span>
                    <strong className="text-sm font-semibold block">{t(brand.address)}</strong>
                    <span className="text-xs text-cream-300/80">Madhya Pradesh, India</span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 text-sm text-cream-50">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-cream-300/80 font-medium block">
                      Business Hours
                    </span>
                    <strong className="text-xs font-semibold block">Mon – Sun: 10:00 AM – 9:00 PM</strong>
                    <span className="text-[11px] text-[#25D366]">Site visits open on all 7 days</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Booking Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl border border-gold-500/20 bg-[#0A1D30]/90 shadow-xl">
              
              <div className="mb-6 space-y-1">
                <h3 className="font-serif text-2xl font-bold text-cream-50">
                  {currentLang === 'hi' ? 'मुफ़्त परामर्श फ़ॉर्म' : 'Request Site Measurement Visit'}
                </h3>
                <p className="text-xs text-cream-300/80">
                  {currentLang === 'hi'
                    ? 'विवरण भरें, हम कुछ ही घंटों में आपसे संपर्क करेंगे।'
                    : 'Fill in your requirements below for instant quotation dispatch via WhatsApp.'}
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center gap-3 text-xs text-[#25D366]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>
                    {currentLang === 'hi'
                      ? 'आपका अनुरोध तैयार है और व्हाट्सएप पर खोला जा रहा है!'
                      : 'Inquiry compiled successfully! Opening WhatsApp chat for rapid confirmation.'}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-cream-50">
                    {currentLang === 'hi' ? 'आपका पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-xs text-cream-50 focus:border-gold-500 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-red-500">{errors.fullName.message}</span>
                  )}
                </div>

                {/* Phone & Locality Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-cream-50">
                      {currentLang === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : '10-Digit Mobile *'}
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      maxLength={10}
                      placeholder="e.g. 9826012345"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-xs text-cream-50 focus:border-gold-500 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-500">{errors.phone.message}</span>
                    )}
                  </div>

                  {/* Locality in Bhopal */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-cream-50">
                      Locality in Bhopal *
                    </label>
                    <input
                      {...register('locality')}
                      type="text"
                      placeholder="e.g. Arera Colony, MP Nagar, Kolar"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-xs text-cream-50 focus:border-gold-500 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors"
                    />
                    {errors.locality && (
                      <span className="text-[11px] text-red-500">{errors.locality.message}</span>
                    )}
                  </div>

                </div>

                {/* Selected Service */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-cream-50">
                    Service of Interest *
                  </label>
                  <select
                    {...register('service')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-xs text-cream-50 focus:border-gold-500 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors cursor-pointer"
                  >
                    <option value="Premium Wallpaper Designing">Premium Wallpaper Designing</option>
                    <option value="Professional Wall Painting">Professional Wall Painting</option>
                    <option value="Texture Wall Finishes">Texture Wall Finishes (Stucco / Velvet)</option>
                    <option value="Custom 3D Wall Murals">Custom 3D Wall Murals</option>
                    <option value="Complete Home Makeover">Complete Home Makeover</option>
                  </select>
                </div>

                {/* Additional notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-cream-50">
                    Room Details / Dimensions / Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="e.g. Need accent wallpaper for master bedroom (14x10 ft) with catalog samples..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gold-500/20 bg-[#061522] text-xs text-cream-50 focus:border-gold-500 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A34D] via-[#E2B96F] to-[#B37F2E] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-xl shadow-[#D6A34D]/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry & Open WhatsApp</span>
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
