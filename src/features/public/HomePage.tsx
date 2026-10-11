import React, { useEffect } from 'react';
import { useContentStore, useTranslation } from '../../store/contentStore';
import { updatePageMeta } from '../../lib/seo';

import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { TrustBar } from './TrustBar';
import { AboutSection } from './AboutSection';
import { ServicesSection } from './ServicesSection';
import { RoomVisualizer } from './RoomVisualizer';
import { TextureLabSection } from './TextureLabSection';
import { GallerySection } from './GallerySection';
import { LightboxModal } from './LightboxModal';
import { BeforeAfterSection } from './BeforeAfterSection';
import { ProcessSection } from './ProcessSection';
import { WhyChooseUsSection } from './WhyChooseUsSection';
import { SiteVisitBookingSection } from './SiteVisitBookingSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { ContactSection } from './ContactSection';
import { LocationMapSection } from './LocationMapSection';
import { QuoteModal } from './QuoteModal';
import { Footer } from './Footer';

import { GoldDustCanvas } from '../../components/common/GoldDustCanvas';
import { CursorSpotlight } from '../../components/common/CursorSpotlight';

export const HomePage: React.FC = () => {
  const content = useContentStore((s) => s.content);
  const { currentLang } = useTranslation();

  useEffect(() => {
    updatePageMeta(content.brand, currentLang);
  }, [content.brand, currentLang]);

  return (
    <div className="min-h-screen bg-[#061522] text-[var(--text)] selection:bg-gold-500 selection:text-navy-950 relative overflow-x-hidden">
      
      {/* Ambient Lighting & Golden Particle Atmosphere */}
      <GoldDustCanvas />
      <CursorSpotlight />

      {/* Top Navigation */}
      <Navbar brand={content.brand} />

      {/* Main Luxury Experience */}
      <main className="relative z-10">
        <Hero hero={content.hero} brand={content.brand} />
        <TrustBar highlights={content.trustHighlights} />
        <AboutSection about={content.about} />
        <ServicesSection services={content.services} whatsappNumber={content.brand.whatsappNumber} />
        <RoomVisualizer whatsappNumber={content.brand.whatsappNumber} />
        <TextureLabSection whatsappNumber={content.brand.whatsappNumber} />
        <GallerySection gallery={content.gallery} />
        <BeforeAfterSection
          items={content.beforeAfter.items}
          isEnabled={content.beforeAfter.isEnabled}
        />
        <ProcessSection steps={content.process} />
        <WhyChooseUsSection items={content.whyChooseUs} />
        <SiteVisitBookingSection whatsappNumber={content.brand.whatsappNumber} />
        <TestimonialsSection testimonials={content.testimonials} />
        <FaqSection faqs={content.faqs} />
        <ContactSection brand={content.brand} />
        <LocationMapSection brand={content.brand} />
      </main>

      {/* Modals & Overlays */}
      <LightboxModal />
      <QuoteModal />

      {/* Global Footer */}
      <Footer brand={content.brand} />
    </div>
  );
};
