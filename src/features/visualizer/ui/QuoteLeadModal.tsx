import React, { useState } from 'react';
import { useVisualizerStore, ROOMS_METADATA } from '../store/visualizerStore';
import { generateDesignSheetPdf } from '../store/pdfExport';
import { saveVisualizerLead } from '../store/persistence';

export const QuoteLeadModal: React.FC = () => {
  const {
    quoteModalOpen,
    setQuoteModalOpen,
    activeRoom,
    areaSqFt,
    setAreaSqFt,
    designs,
    language,
  } = useVisualizerStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [locality, setLocality] = useState('Zone-1 MP Nagar, Bhopal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!quoteModalOpen) return null;

  const roomMeta = ROOMS_METADATA.find((r) => r.id === activeRoom) ?? ROOMS_METADATA[0];

  // Calculate customized surfaces count
  const customizedParts = Object.entries(designs).filter(([partId]) =>
    partId.startsWith(`${activeRoom}/`)
  );
  const wallpaperCount = customizedParts.filter(([, d]) => d.type === 'wallpaper').length;

  // Pricing calculation
  const paintRatePerSqFt = 35;
  const wallpaperRatePerSqFt = 85;
  const estimatedCost = Math.round(
    areaSqFt * (wallpaperCount > 0 ? (paintRatePerSqFt + wallpaperRatePerSqFt) / 2 : paintRatePerSqFt)
  );

  const getCanvasDataUrl = (): string | null => {
    try {
      if (typeof window !== 'undefined' && window.__vizCanvas) {
        return window.__vizCanvas.toDataURL('image/png', 0.9);
      }
    } catch (e) {
      console.warn('Canvas capture error:', e);
    }
    return null;
  };

  const handleDownloadPdf = async () => {
    const canvasUri = getCanvasDataUrl();
    await generateDesignSheetPdf({
      projectName: `${customerName ? customerName + "'s " : ''}${roomMeta.label} Design`,
      room: activeRoom,
      designs,
      areaSqFt,
      estCostPerSqFt: paintRatePerSqFt,
      canvasImageUri: canvasUri,
    });
  };

  const handleWhatsAppSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.trim().length < 10) {
      alert(language === 'hi' ? 'कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    const designsList = customizedParts.map(([partId, d]) => {
      const partName = partId.split('/')[1] || partId;
      if (d.type === 'color') {
        return `${partName}: Paint ${d.colorHex} (${d.finish || 'Matte'})`;
      }
      return `${partName}: Wallpaper ${d.wallpaperId || 'Custom Luxury'}`;
    });

    try {
      await saveVisualizerLead({
        customerName: customerName || 'Valued Guest',
        customerPhone: customerPhone,
        room: activeRoom,
        areaSqFt,
        approxRate: paintRatePerSqFt,
        estimatedTotal: estimatedCost,
        designsSummary: designsList,
      });
    } catch (err) {
      console.warn('Could not save lead locally:', err);
    }

    // Prepare WhatsApp Message
    const textMsg = `*RAI TRADERS - 3D Visualizer Design Inquiry*
---------------------------------------
*Client:* ${customerName || 'Customer'}
*Phone:* ${customerPhone}
*Location:* ${locality}
*Room:* ${roomMeta.label} (${roomMeta.labelHi})
*Est. Area:* ${areaSqFt} sq. ft.
*Approx Estimate:* ₹${estimatedCost.toLocaleString('en-IN')}

*Customized Walls (${customizedParts.length}):*
${designsList.length > 0 ? designsList.map((s) => `• ${s}`).join('\n') : '• Full Room Palette'}

_Designed live on RAI TRADERS 3D Visualizer (Bhopal)_`;

    const waUrl = `https://wa.me/917000302682?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, '_blank');

    setIsSubmitting(false);
    setSubmittedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-navy-900 border border-gold-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-8">
        {/* Close Button */}
        <button
          onClick={() => setQuoteModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-2xl shadow-inner">
            📋
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-gold-300">
              {language === 'hi' ? 'मुफ्त कोटेशन व डिज़ाइन शीट' : 'Instant Doorstep Quote & PDF'}
            </h3>
            <p className="text-xs text-gray-400">
              RAI TRADERS, Zone-1 MP Nagar, Bhopal | +91 70003 02682
            </p>
          </div>
        </div>

        {/* Design Summary Card */}
        <div className="bg-navy-950/80 rounded-2xl p-4 border border-navy-800 mb-5">
          <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
            <span>
              {language === 'hi' ? 'कमरा' : 'Selected Room'}:{' '}
              <strong className="text-gold-300">{roomMeta.emoji} {language === 'hi' ? roomMeta.labelHi : roomMeta.label}</strong>
            </span>
            <span>
              {language === 'hi' ? 'कस्टमाइज दीवारें' : 'Custom Walls'}:{' '}
              <strong className="text-white">{customizedParts.length}</strong>
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-navy-800/80">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                {language === 'hi' ? 'अनुमानित क्षेत्रफल (Sq. Ft.)' : 'Est. Area (Sq. Ft.)'}
              </label>
              <input
                type="number"
                min="50"
                max="5000"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value) || 100)}
                className="w-24 px-2.5 py-1 text-sm bg-navy-900 border border-gold-500/30 rounded-lg text-gold-300 font-bold focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 block">
                {language === 'hi' ? 'अनुमानित बजट (Approximate)' : 'Approx Budget'}
              </span>
              <span className="text-lg font-bold text-gold-400">
                ₹{estimatedCost.toLocaleString('en-IN')}*
              </span>
            </div>
          </div>
          <div className="text-[9px] text-gray-500 mt-2 italic">
            *Final quote determined after free on-site wall measurement in Bhopal.
          </div>
        </div>

        {/* Lead Form */}
        <form onSubmit={handleWhatsAppSend} className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">
              {language === 'hi' ? 'आपका नाम' : 'Your Name'}
            </label>
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">
                {language === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Phone Number (10 digits) *'}
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="98XXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 text-xs bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">
                {language === 'hi' ? 'भोपाल में क्षेत्र / पता' : 'Locality / Area'}
              </label>
              <input
                type="text"
                placeholder="Arera Colony / Kolar"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>{language === 'hi' ? 'व्हाट्सएप पर डिज़ाइन भेजें' : 'Send Design on WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 border border-gold-500/40 text-gold-300 hover:text-gold-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>📄</span>
              <span>{language === 'hi' ? 'PDF डिज़ाइन शीट डाउनलोड करें' : 'Download PDF Design Sheet'}</span>
            </button>
          </div>
        </form>

        {submittedSuccess && (
          <div className="mt-3 p-2 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300">
            ✓ {language === 'hi' ? 'कोटेशन जानकारी सफलतापूर्वक भेजी गई!' : 'Inquiry sent successfully to RAI TRADERS!'}
          </div>
        )}
      </div>
    </div>
  );
};
