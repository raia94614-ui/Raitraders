import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Map as MapIcon, Car, Clock } from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import type { BrandConfig } from '../../content/schema';

interface LocationMapSectionProps {
  brand: BrandConfig;
}

export const LocationMapSection: React.FC<LocationMapSectionProps> = ({ brand }) => {
  const { t, currentLang } = useTranslation();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Rai Traders, Zone 1, MP Nagar, Bhopal, Madhya Pradesh'
  )}`;

  return (
    <section id="location" className="py-20 bg-[#0A1D30]/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent)]/30 bg-navy-950/80">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              {currentLang === 'hi' ? 'हमारा पता' : 'Studio Location & Directions'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            {currentLang === 'hi' ? 'ज़ोन 1, एमपी नगर, भोपाल स्थित स्टूडियो' : 'Visit Us in Zone 1, MP Nagar, Bhopal'}
          </h2>

          <p className="text-sm text-cream-300">
            {currentLang === 'hi'
              ? 'आएं और हमारे स्टूडियो में 500+ इंटरनेशनल वॉलपेपर कैटलॉग एवं टेक्सचर सैंपल्स को छूकर महसूस करें।'
              : 'Centrally located in Bhopal’s prime commercial hub. Browse physical swatch books, textures, and luxury rolls in person.'}
          </p>
        </div>

        {/* Map Container */}
        <div className="rounded-2xl border border-gold-500/20 bg-[#061522]/90 overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-12">
            
            {/* Interactive Map Area (Click to load for privacy and speed) */}
            <div className="lg:col-span-8 min-h-[380px] relative bg-navy-950/80 flex items-center justify-center">
              {isMapLoaded ? (
                <iframe
                  title="Rai Traders Studio Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.2407519198647!2d77.43202931535747!3d23.23432098484643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c4240787e9e8b%3A0x6b9d0b67bf122971!2sZone-I%2C%20Maharana%20Pratap%20Nagar%2C%20Bhopal%2C%20Madhya%20Pradesh%20462011!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  className="w-full h-full min-h-[400px] border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="p-8 text-center space-y-4 max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-[#D6A34D]/10 border border-[#D6A34D]/30 flex items-center justify-center text-[var(--accent)] mx-auto">
                    <MapIcon className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-cream-50">
                      Load Interactive Google Map
                    </h3>
                    <p className="text-xs text-cream-300 mt-1">
                      Preserves privacy and saves mobile data. Click below to load live Google Maps directions to RAI TRADERS, Bhopal.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsMapLoaded(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Show Interactive Map</span>
                  </button>
                </div>
              )}
            </div>

            {/* Location Specs Sidebar */}
            <div className="lg:col-span-4 p-8 flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-gold-500/20">
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-widest text-[var(--accent)] font-semibold block">
                  Store Access Details
                </span>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-cream-50">
                    {t(brand.address)}
                  </h3>
                  <p className="text-xs text-cream-300">
                    {brand.city}, {brand.state} 462011, India
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gold-500/20 text-xs text-cream-200">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Opening Hours:</strong>
                      <span>Monday – Sunday: 10:00 AM – 9:00 PM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Car className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Parking Facility:</strong>
                      <span>Ample street & complex parking available</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Landmark:</strong>
                      <span>Near MP Nagar commercial market, Bhopal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Google Maps Link */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-[#D6A34D]/40 bg-navy-950/80 hover:bg-[#D6A34D]/15 text-cream-50 hover:text-[var(--accent)] text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
