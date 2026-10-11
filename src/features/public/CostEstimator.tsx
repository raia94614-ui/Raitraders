import React, { useState } from 'react';
import {
  Calculator,
  MessageCircle,
  HelpCircle,
  Layers,
  Copy,
  DoorOpen,
  Maximize,
} from 'lucide-react';
import { useTranslation } from '../../store/contentStore';
import { useUiStore } from '../../store/uiStore';
import { formatInr } from '../../lib/formatters';
import { generateWhatsAppUrl } from '../../lib/whatsapp';

type WallScope = 'single' | 'corner' | 'full' | 'ceiling';
type QualityTier = 'standard' | 'luxury' | 'custom';

interface CostEstimatorProps {
  whatsappNumber: string;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ whatsappNumber }) => {
  const { currentLang } = useTranslation();
  const showToast = useUiStore((s) => s.showToast);

  // Architectural Dimensions
  const [scope, setScope] = useState<WallScope>('single');
  const [roomLengthFt, setRoomLengthFt] = useState<number>(14);
  const [roomWidthFt, setRoomWidthFt] = useState<number>(12);
  const [ceilingHeightFt, setCeilingHeightFt] = useState<number>(10);
  const [doorCount, setDoorCount] = useState<number>(1);
  const [windowCount, setWindowCount] = useState<number>(1);
  const [qualityTier, setQualityTier] = useState<QualityTier>('luxury');

  // Surface Area Calculation based on scope
  let grossArea = 0;
  if (scope === 'single') {
    grossArea = roomLengthFt * ceilingHeightFt;
  } else if (scope === 'corner') {
    grossArea = (roomLengthFt + roomWidthFt) * ceilingHeightFt;
  } else if (scope === 'full') {
    grossArea = 2 * (roomLengthFt + roomWidthFt) * ceilingHeightFt;
  } else if (scope === 'ceiling') {
    grossArea = roomLengthFt * ceilingHeightFt + roomLengthFt * roomWidthFt;
  }

  // Deductions: standard door = 21 sq ft (7x3), standard window = 16 sq ft (4x4)
  const doorDeduction = scope === 'single' ? Math.min(doorCount, 1) * 21 : doorCount * 21;
  const windowDeduction = scope === 'single' ? Math.min(windowCount, 1) * 16 : windowCount * 16;
  const totalDeduction = Math.min(grossArea * 0.4, doorDeduction + windowDeduction);
  const netArea = Math.max(30, Math.round(grossArea - totalDeduction));

  // Wallpaper Rolls Calculation
  // Standard Indian roll (0.53m x 10m) ~ 57 sq. ft. Effective coverage with 15% repeat match = 50 sq. ft.
  const rollsNeeded = Math.ceil(netArea / 50);

  // Rate Tier
  let rollRateMin = 1400;
  let rollRateMax = 2200;
  let tierLabel = 'Standard Vinyl';
  if (qualityTier === 'luxury') {
    rollRateMin = 2500;
    rollRateMax = 4800;
    tierLabel = 'Luxury Textured / Non-Woven';
  } else if (qualityTier === 'custom') {
    rollRateMin = 4500;
    rollRateMax = 8500;
    tierLabel = 'Bespoke 3D Silk / 24K Foil';
  }

  const laborPerRollMin = 350;
  const laborPerRollMax = 500;

  const materialMin = rollsNeeded * rollRateMin;
  const materialMax = rollsNeeded * rollRateMax;
  const laborMin = rollsNeeded * laborPerRollMin;
  const laborMax = rollsNeeded * laborPerRollMax;
  const totalMin = materialMin + laborMin;
  const totalMax = materialMax + laborMax;

  const handleWhatsAppQuote = () => {
    const scopeLabel =
      scope === 'single'
        ? 'Accent Wall (1 Wall)'
        : scope === 'corner'
        ? 'Corner Lounge (2 Walls)'
        : scope === 'full'
        ? 'Full Room (4 Walls)'
        : 'Accent Wall + Ceiling';

    const url = generateWhatsAppUrl(whatsappNumber, {
      service: `Architectural Wallpaper Estimate: ${tierLabel}`,
      roomType: `${roomLengthFt}x${roomWidthFt} ft (Height: ${ceilingHeightFt} ft)`,
      areaSqFt: netArea,
      estimatedRolls: rollsNeeded,
      estimatedCostRange: `${formatInr(totalMin)} - ${formatInr(totalMax)}`,
      preferredStyle: `${scopeLabel} • ${tierLabel}`,
      notes: `Scope: ${scopeLabel}. Gross area: ${grossArea} sq ft, Deductions: -${totalDeduction} sq ft. Total rolls required: ~${rollsNeeded} rolls.`,
    });
    window.open(url, '_blank');
  };

  const handleCopySummary = () => {
    const text = `RAI TRADERS Wall Estimate:
• Scope: ${scope.toUpperCase()} (~${netArea} sq. ft. net)
• Dimensions: ${roomLengthFt}x${roomWidthFt} ft, Height: ${ceilingHeightFt} ft
• Rolls Needed: ~${rollsNeeded} rolls
• Material + German Adhesive Labor: ${formatInr(totalMin)} - ${formatInr(totalMax)}
Contact Rai Traders Bhopal: +91 7000302682`;

    navigator.clipboard?.writeText(text);
    showToast(
      currentLang === 'hi'
        ? 'अनुमान विवरण क्लिपबोर्ड पर कॉपी हो गया!'
        : 'Estimate summary copied to clipboard!',
      'success'
    );
  };

  return (
    <section id="calculator" className="py-24 bg-[#061522] relative overflow-hidden border-t border-[#1C1814]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[#0A1D30]/90">
            <Calculator className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              {currentLang === 'hi' ? 'आर्किटेक्चरल लागत एवं रोल्स कैलकुलेटर 2.0' : 'Architectural Cost & Roll Engine 2.0'}
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            {currentLang === 'hi' ? 'कमरे के सटीक नाप और कटौती के साथ पारदर्शी बजट' : 'Multi-Wall Measurement & Accurate Roll Estimate'}
          </h2>

          <p className="text-sm sm:text-base text-cream-300">
            {currentLang === 'hi'
              ? 'दीवार, खिड़की व दरवाजों की कटौती, 15% वर्टिकल पैटर्न वेस्टेज और जर्मन एडहेसिव इंस्टॉलेशन सहित वास्तविक खर्च।'
              : 'Configure single accent walls or full rooms with automatic door/window surface deductions and pattern matching allowances.'}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-5xl mx-auto bg-[#0A1D30]/90 border border-gold-500/20 rounded-2xl p-6 sm:p-10 shadow-2xl">
          
          {/* Scope Selector */}
          <div className="mb-8 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cream-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              <span>{currentLang === 'hi' ? 'कवरेज का दायरा चुनें:' : 'Select Wall Coverage Scope:'}</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'single', label: '1 Accent Wall', sub: 'Feature Wall' },
                { id: 'corner', label: '2 Walls', sub: 'Corner Lounge' },
                { id: 'full', label: '4 Walls', sub: 'Complete Room' },
                { id: 'ceiling', label: 'Wall + Ceiling', sub: 'Luxury Canopy' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    scope === s.id
                      ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-white font-bold ring-1 ring-[var(--accent)]'
                      : 'border-gold-500/20 bg-[#061522] text-cream-300 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-semibold">{s.label}</p>
                  <span className="text-[10px] text-[#7A7367] block">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left Dimensions & Deductions (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Sliders Grid */}
              <div className="space-y-4 p-5 rounded-xl bg-[#061522] border border-gold-500/20 text-xs">
                
                {/* Length */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-cream-200">Wall Length:</span>
                    <strong className="text-[var(--accent)]">{roomLengthFt} ft</strong>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="35"
                    value={roomLengthFt}
                    onChange={(e) => setRoomLengthFt(Number(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                </div>

                {/* Width */}
                {scope !== 'single' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-cream-200">Room Width:</span>
                      <strong className="text-[var(--accent)]">{roomWidthFt} ft</strong>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="30"
                      value={roomWidthFt}
                      onChange={(e) => setRoomWidthFt(Number(e.target.value))}
                      className="w-full accent-[var(--accent)] cursor-pointer"
                    />
                  </div>
                )}

                {/* Height */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-cream-200">Ceiling Height:</span>
                    <strong className="text-[var(--accent)]">{ceilingHeightFt} ft</strong>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="16"
                    value={ceilingHeightFt}
                    onChange={(e) => setCeilingHeightFt(Number(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                </div>

                {/* Openings Deductions Row */}
                <div className="pt-2 border-t border-gold-500/20 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] text-cream-300 flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Doors (7x3 ft):</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((num) => (
                        <button
                          key={num}
                          onClick={() => setDoorCount(num)}
                          className={`flex-1 py-1 rounded-lg border text-center font-bold text-xs ${
                            doorCount === num
                              ? 'border-[var(--accent)] bg-[var(--accent)] text-black'
                              : 'border-gold-500/20 bg-[#0A1D30]/90 text-cream-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-cream-300 flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Windows (4x4 ft):</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((num) => (
                        <button
                          key={num}
                          onClick={() => setWindowCount(num)}
                          className={`flex-1 py-1 rounded-lg border text-center font-bold text-xs ${
                            windowCount === num
                              ? 'border-[var(--accent)] bg-[var(--accent)] text-black'
                              : 'border-gold-500/20 bg-[#0A1D30]/90 text-cream-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Quality Tier Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-cream-200 block">
                  {currentLang === 'hi' ? 'वॉलपेपर सामग्री श्रेणी:' : 'Material Quality Tier:'}
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', name: 'Standard Vinyl', rate: '₹1.4k-2.2k/roll' },
                    { id: 'luxury', name: 'Luxury Textured', rate: '₹2.5k-4.8k/roll' },
                    { id: 'custom', name: '3D Silk / 24K Foil', rate: '₹4.5k-8.5k/roll' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setQualityTier(t.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        qualityTier === t.id
                          ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-white font-bold'
                          : 'border-gold-500/20 bg-[#061522] text-cream-300'
                      }`}
                    >
                      <p className="text-xs font-semibold">{t.name}</p>
                      <span className="text-[10px] text-[var(--accent)] block">{t.rate}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Informative Note */}
              <div className="p-3.5 rounded-xl bg-[#061522] border border-gold-500/20 flex items-start gap-2.5 text-[11px] text-cream-300">
                <HelpCircle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <p>
                  Gross wall: <strong>{grossArea} sq. ft.</strong> | Deductions: -{totalDeduction} sq. ft. | Net surface: <strong>{netArea} sq. ft.</strong> Accounts for 15% vertical pattern repeat.
                </p>
              </div>

            </div>

            {/* Right Summary Invoice Card (5 cols) */}
            <div className="md:col-span-5 p-6 rounded-2xl border-2 border-[#D6A34D]/40 bg-[#061522] space-y-6 shadow-2xl">
              
              {/* Header */}
              <div className="border-b border-gold-500/20 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent)] block">
                  Project Estimate Breakdown
                </span>
                <h3 className="font-heading text-2xl font-bold text-white mt-1">
                  {formatInr(totalMin)} – {formatInr(totalMax)}
                </h3>
                <span className="text-xs text-cream-300 block mt-0.5">
                  Includes Materials + German Adhesive + Skilled Labor
                </span>
              </div>

              {/* Specs Itemized Breakdown */}
              <div className="space-y-2.5 text-xs text-cream-200">
                <div className="flex justify-between">
                  <span>Net Surface Area:</span>
                  <strong className="text-white">{netArea} sq. ft.</strong>
                </div>

                <div className="flex justify-between">
                  <span>Rolls Required:</span>
                  <strong className="text-[var(--accent)] text-sm font-bold">
                    {rollsNeeded} Rolls
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Material ({tierLabel}):</span>
                  <span className="text-white">
                    {formatInr(materialMin)} - {formatInr(materialMax)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Installation & German Paste:</span>
                  <span className="text-white">
                    {formatInr(laborMin)} - {formatInr(laborMax)}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-[#7A7367] pt-2 border-t border-[#1C1814]">
                  <span>On-Site Measurement (Bhopal):</span>
                  <span className="text-emerald-400 font-bold">100% FREE</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleWhatsAppQuote}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/20 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentLang === 'hi' ? 'व्हाट्सएप पर यह कोटेशन मंगवाएं' : 'Lock This Estimate on WhatsApp'}</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gold-500/20 bg-[#0A1D30]/90 hover:border-[var(--accent)] text-cream-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Copy Estimate Breakdown</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
