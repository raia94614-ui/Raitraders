import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor, Sparkles } from 'lucide-react';
import { useDraftStore } from '../../store/draftStore';
import { Navbar } from '../public/Navbar';
import { Hero } from '../public/Hero';
import { TrustBar } from '../public/TrustBar';
import { AboutSection } from '../public/AboutSection';
import { ServicesSection } from '../public/ServicesSection';
import { GallerySection } from '../public/GallerySection';
import { BeforeAfterSection } from '../public/BeforeAfterSection';
import { RoomVisualizer } from '../public/RoomVisualizer';
import { ProcessSection } from '../public/ProcessSection';
import { WhyChooseUsSection } from '../public/WhyChooseUsSection';
import { TestimonialsSection } from '../public/TestimonialsSection';
import { FaqSection } from '../public/FaqSection';
import { ContactSection } from '../public/ContactSection';
import { LocationMapSection } from '../public/LocationMapSection';
import { Footer } from '../public/Footer';

interface PreviewSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewSimulatorModal: React.FC<PreviewSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { draft } = useDraftStore();
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const widthStyle =
    viewport === 'mobile'
      ? 'w-[390px] max-w-full'
      : viewport === 'tablet'
      ? 'w-[768px] max-w-full'
      : 'w-full';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Draft Preview Simulator"
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl"
    >
      {/* Top Controls Bar */}
      <div className="h-14 border-b border-[#2C241B] bg-[#14100C] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-heading font-bold text-sm text-white">
            Draft Viewport Simulator
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Unpublished Draft
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[#2C241B] bg-[#0D0B09]">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-[var(--accent)] text-black' : 'text-[#A89F91]'
            }`}
            title="Desktop (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-[var(--accent)] text-black' : 'text-[#A89F91]'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-[var(--accent)] text-black' : 'text-[#A89F91]'
            }`}
            title="Mobile (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-[#A89F91] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Simulator Viewport Stage */}
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-[#080705]">
        <div
          className={`${widthStyle} transition-all duration-300 bg-[#0D0B09] rounded-2xl overflow-y-auto border border-[#2C241B] shadow-2xl h-fit`}
        >
          {/* Render Public Shell with Draft Data */}
          <Navbar brand={draft.brand} />
          <Hero hero={draft.hero} brand={draft.brand} />
          <TrustBar highlights={draft.trustHighlights} />
          <AboutSection about={draft.about} />
          <ServicesSection services={draft.services} whatsappNumber={draft.brand.whatsappNumber} />
          <GallerySection gallery={draft.gallery} />
          <BeforeAfterSection
            items={draft.beforeAfter.items}
            isEnabled={draft.beforeAfter.isEnabled}
          />
          <RoomVisualizer whatsappNumber={draft.brand.whatsappNumber} />
          <ProcessSection steps={draft.process} />
          <WhyChooseUsSection items={draft.whyChooseUs} />
          <TestimonialsSection testimonials={draft.testimonials} />
          <FaqSection faqs={draft.faqs} />
          <ContactSection brand={draft.brand} />
          <LocationMapSection brand={draft.brand} />
          <Footer brand={draft.brand} />
        </div>
      </div>
    </div>
  );
};
