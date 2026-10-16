import React, { useState } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';

export const GuidedTourModal: React.FC = () => {
  const { guidedTourOpen, setGuidedTourOpen, language } = useVisualizerStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (!guidedTourOpen) return null;

  const steps = [
    {
      titleEn: '360° Panoramic Walkthrough',
      titleHi: '360° पैनोरमिक वॉकथ्रू',
      descEn:
        'Drag with your finger or mouse to look in any direction (360° horizontally and ceiling to floor). On your mobile phone, enable Gyroscope for magic-window motion tracking!',
      descHi:
        'उंगली या माउस से घुमाकर चारों तरफ 360° देखें (दीवारें, छत और फर्श)। मोबाइल पर जाइरोस्कोप चालू करके फोन घुमाकर भी देख सकते हैं!',
      icon: '🔄',
    },
    {
      titleEn: 'Click Any Wall to Style',
      titleHi: 'किसी भी दीवार पर क्लिक करें',
      descEn:
        'Click on any interior or exterior wall to select it. Choose from curated Asian Paints & Berger luxury shade cards, or 30+ bespoke luxury wallpaper patterns.',
      descHi:
        'कमरे की किसी भी दीवार पर टैप करें। फिर अपनी पसंद का पेंट शेड या 30+ एक्सक्लूसिव वॉलपेपर डिज़ाइन तुरंत लाइव लगाकर देखें।',
      icon: '✨',
    },
    {
      titleEn: 'Realistic PBR Finishes & Lighting',
      titleHi: 'असली चमक व रोशनी (PBR)',
      descEn:
        'Switch between Matte, Satin Sheen, Royale Stucco texture, and Embossed Wallpapers. Toggle Day, Sunset, and Night lighting to see how colors reflect at different times of day.',
      descHi:
        'मैट, सैटिन चमक, रॉयल स्टको और एम्बॉस्ड वॉलपेपर का असली फील। दिन, शाम और रात की लाइट बदलकर देखें कि रंग कैसा दिखता है।',
      icon: '💡',
    },
    {
      titleEn: 'Export PDF & WhatsApp Quote',
      titleHi: 'पीडीएफ और व्हाट्सएप कोटेशन',
      descEn:
        'Download your customized one-page Design Sheet with room area & paint codes, or send directly to RAI TRADERS Bhopal team on WhatsApp for an instant doorstep quote!',
      descHi:
        'अपने डिज़ाइन की पूरी PDF डिज़ाइन शीट डाउनलोड करें और राय ट्रेडर्स भोपाल को व्हाट्सएप पर भेजकर घर बैठे मुफ्त कोटेशन पाएं!',
      icon: '📲',
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setGuidedTourOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-navy-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-8 bg-gold-400' : 'w-2 bg-navy-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => {
              setGuidedTourOpen(false);
              setCurrentStep(0);
            }}
            className="text-gray-400 hover:text-white text-xs uppercase tracking-wider font-semibold"
          >
            {language === 'hi' ? 'छोड़ें' : 'Skip'}
          </button>
        </div>

        {/* Content */}
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-gold-500/20 to-navy-800 border border-gold-500/30 flex items-center justify-center text-4xl shadow-inner">
            {current.icon}
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-gold-300 mb-3">
            {language === 'hi' ? current.titleHi : current.titleEn}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
            {language === 'hi' ? current.descHi : current.descEn}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-navy-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border border-navy-700 transition-colors ${
              currentStep === 0 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'text-gray-300 hover:bg-navy-800'
            }`}
          >
            {language === 'hi' ? 'पिछला' : 'Back'}
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 shadow-lg shadow-gold-500/20 transition-all flex items-center gap-1.5"
          >
            <span>
              {currentStep === steps.length - 1
                ? language === 'hi'
                  ? 'शुरू करें!'
                  : 'Start Designing!'
                : language === 'hi'
                ? 'अगला'
                : 'Next'}
            </span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
