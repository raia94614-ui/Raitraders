import React, { useState, useMemo } from 'react';
import { Pipette, Sparkles, Check, Layers } from 'lucide-react';
import type { PaintFinish } from '../materials/PBRMaterialResolver';
import { useVisualizerStore } from '../store/visualizerStore';

export interface PaintColor {
  hex: string;
  name: string;
  nameHi: string;
  code: string;
  family: 'whites' | 'neutrals' | 'bold' | 'cool' | 'greens' | 'pastels' | 'earth';
}

export const PAINT_COLORS: PaintColor[] = [
  // Whites & Off-Whites
  { hex: '#F9F8F5', name: 'Raw Silk White', nameHi: 'रॉ सिल्क व्हाइट', code: 'L101', family: 'whites' },
  { hex: '#F2EFE9', name: 'Alabaster Mist', nameHi: 'अलाबास्टर मिस्ट', code: 'L104', family: 'whites' },
  { hex: '#EDE8DF', name: 'Chantilly Cream', nameHi: 'शांतिली क्रीम', code: 'L108', family: 'whites' },
  { hex: '#FAFAF8', name: 'Pure Chalk', nameHi: 'प्योर चॉक', code: 'L110', family: 'whites' },
  { hex: '#EBE5D8', name: 'Warm Parchment', nameHi: 'वार्म पर्चमेंट', code: 'L115', family: 'whites' },

  // Warm Neutrals
  { hex: '#D8CCA3', name: 'Desert Camel', nameHi: 'डेज़र्ट कैमल', code: 'N201', family: 'neutrals' },
  { hex: '#C4B59D', name: 'Warm Greige', nameHi: 'वार्म ग्रेज', code: 'N204', family: 'neutrals' },
  { hex: '#B8A88A', name: 'Natural Khaki', nameHi: 'नेचुरल खाकी', code: 'N208', family: 'neutrals' },
  { hex: '#DDD2C1', name: 'Cashew Beige', nameHi: 'काजू बेज', code: 'N212', family: 'neutrals' },
  { hex: '#8C8275', name: 'Stone Taupe', nameHi: 'स्टोन टोप', code: 'N218', family: 'neutrals' },

  // Luxury Bold
  { hex: '#0B1530', name: 'Midnight Navy', nameHi: 'मिडनाइट नेवी', code: 'B301', family: 'bold' },
  { hex: '#162238', name: 'Deep Sapphire', nameHi: 'डीप सफायर', code: 'B304', family: 'bold' },
  { hex: '#11291E', name: 'Imperial Emerald', nameHi: 'इंपीरियल एमराल्ड', code: 'B308', family: 'bold' },
  { hex: '#4A1521', name: 'Royal Burgundy', nameHi: 'रॉयल बरगंडी', code: 'B312', family: 'bold' },
  { hex: '#1A1C22', name: 'Bespoke Charcoal', nameHi: 'चारकोल ब्लैक', code: 'B316', family: 'bold' },

  // Cool Blues & Teals
  { hex: '#2A4365', name: 'Bhopal Lake Blue', nameHi: 'बड़ा तालाब ब्लू', code: 'C401', family: 'cool' },
  { hex: '#3B6978', name: 'Nordic Teal', nameHi: 'नॉर्डिक टील', code: 'C406', family: 'cool' },
  { hex: '#7395AE', name: 'Dusk Slate Blue', nameHi: 'डस्क स्लेट', code: 'C410', family: 'cool' },
  { hex: '#A8D0E6', name: 'Breeze Ice Blue', nameHi: 'ब्रीज़ आइस', code: 'C414', family: 'cool' },
  { hex: '#52796F', name: 'Oceanic Mineral', nameHi: 'ओशनिक मिनरल', code: 'C418', family: 'cool' },

  // Greens & Sage
  { hex: '#7C8F7E', name: 'Sage Mist', nameHi: 'सेज मिस्ट', code: 'G501', family: 'greens' },
  { hex: '#556B2F', name: 'Olive Grove', nameHi: 'ऑलिव ग्रोव', code: 'G504', family: 'greens' },
  { hex: '#2D4A3E', name: 'Deep Pine Needle', nameHi: 'डीप पाइन', code: 'G508', family: 'greens' },
  { hex: '#A3B18A', name: 'Eucalyptus Soft', nameHi: 'यूकेलिप्टस सॉफ्ट', code: 'G512', family: 'greens' },
  { hex: '#D8E2DC', name: 'Celadon Whisper', nameHi: 'सेलाडोन विस्पर', code: 'G516', family: 'greens' },

  // Pastels & Muted
  { hex: '#E8B4B8', name: 'Dusty Rose Blossom', nameHi: 'डस्टी रोज़', code: 'P601', family: 'pastels' },
  { hex: '#EED9C4', name: 'Warm Apricot Peach', nameHi: 'वार्म पीच', code: 'P604', family: 'pastels' },
  { hex: '#D8C3E5', name: 'Lavender Mist', nameHi: 'लैवेंडर मिस्ट', code: 'P608', family: 'pastels' },
  { hex: '#F0E6D2', name: 'Butter Vanilla', nameHi: 'बटर वैनिला', code: 'P612', family: 'pastels' },
  { hex: '#C5D8D1', name: 'Soft Seafoam', nameHi: 'सीफ़ोम पेस्टल', code: 'P616', family: 'pastels' },

  // Earth & Terracotta
  { hex: '#C2593F', name: 'Terracotta Clay', nameHi: 'टेराकोटा क्ले', code: 'E701', family: 'earth' },
  { hex: '#9C5134', name: 'Burnt Amber Rust', nameHi: 'बर्न अंबर रस्ट', code: 'E705', family: 'earth' },
  { hex: '#D4AF37', name: 'RAI Royal Gold', nameHi: 'रॉयल गोल्ड', code: 'E710', family: 'earth' },
  { hex: '#634832', name: 'Dark Roast Walnut', nameHi: 'डार्क वॉलनट', code: 'E715', family: 'earth' },
  { hex: '#B87333', name: 'Hammered Copper', nameHi: 'कॉपर मेटैलिक', code: 'E720', family: 'earth' },
];

export const FINISH_DETAILS: { id: PaintFinish; label: string; labelHi: string; desc: string }[] = [
  { id: 'matte', label: 'Velvet Matte', labelHi: 'वेलवेट मैट', desc: 'Non-reflective, smooth architectural finish' },
  { id: 'satin', label: 'Silk Satin', labelHi: 'सिल्क सैटिन', desc: 'Gentle pearl sheen, washable & durable' },
  { id: 'gloss', label: 'Royale Gloss', labelHi: 'रॉयल ग्लॉस', desc: 'High reflective luster with rich depth' },
  { id: 'texture_stucco', label: 'Venetian Stucco', labelHi: 'लाइम स्टुको', desc: 'Handcrafted lime trowel texture' },
  { id: 'texture_sponge', label: 'Royale Sponge', labelHi: 'रॉयल स्पंज', desc: 'Artistic multi-dimensional pattern' },
];

// Color conversion helpers for harmonies
function hexToHsl(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export const PaintTool: React.FC = () => {
  const {
    selectedPartId,
    selectedPartLabel,
    selectedPartLabelHi,
    designs,
    applyDesign,
    applyToWholeRoom,
    applyToAllWallsExceptAccent,
    applyToCeiling,
    applyToExterior,
    resetPart,
    language,
  } = useVisualizerStore();

  const isHi = language === 'hi';
  const currentDesign = selectedPartId ? designs[selectedPartId] : undefined;

  const [selectedHex, setSelectedHex] = useState(
    currentDesign?.colorHex || '#D4AF37'
  );
  const [finish, setFinish] = useState<PaintFinish>(
    currentDesign?.finish || 'matte'
  );
  const [activeFamily, setActiveFamily] = useState<PaintColor['family']>('bold');
  const [isTwoTone, setIsTwoTone] = useState(currentDesign?.type === 'two_tone');
  const [dadoColor, setDadoColor] = useState(
    currentDesign?.secondaryColorHex || '#0B1530'
  );
  const [dadoSplit, setDadoSplit] = useState(
    currentDesign?.splitRatio || 0.35
  );

  // Compute Color Harmonies (Complementary, Analogous, Triadic)
  const harmonies = useMemo(() => {
    const [h, s, l] = hexToHsl(selectedHex);
    return {
      complementary: hslToHex((h + 180) % 360, s, l),
      analogous1: hslToHex((h + 30) % 360, s, l),
      analogous2: hslToHex((h - 30 + 360) % 360, s, l),
      triadic1: hslToHex((h + 120) % 360, s, l),
      triadic2: hslToHex((h + 240) % 360, s, l),
    };
  }, [selectedHex]);

  const handlePickEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-expect-error EyeDropper is standard modern browser API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setSelectedHex(result.sRGBHex.toUpperCase());
        }
      } catch {
        // user cancelled
      }
    } else {
      alert(isHi ? 'आईड्रॉपर केवल Chrome / Edge पर समर्थित है' : 'Eyedropper is supported in Chrome & Edge');
    }
  };

  const handleApplySingle = () => {
    if (!selectedPartId) return;
    if (isTwoTone) {
      applyDesign(selectedPartId, {
        type: 'two_tone',
        colorHex: selectedHex,
        secondaryColorHex: dadoColor,
        splitRatio: dadoSplit,
      });
    } else {
      applyDesign(selectedPartId, {
        type: 'color',
        colorHex: selectedHex,
        finish,
      });
    }
  };

  const handleApplyWholeRoom = () => {
    applyToWholeRoom({
      type: 'color',
      colorHex: selectedHex,
      finish,
    });
  };

  const handleApplyWallsExceptAccent = () => {
    applyToAllWallsExceptAccent({
      type: 'color',
      colorHex: selectedHex,
      finish,
    });
  };

  return (
    <div className="space-y-4 text-xs font-sans text-white/90">
      {/* Target surface info banner */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950/70 border border-gold-500/30">
        <div>
          <p className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
            {isHi ? 'चयनित सतह' : 'Selected Surface'}
          </p>
          <p className="text-white font-semibold text-xs mt-0.5">
            {isHi ? selectedPartLabelHi || selectedPartLabel || 'दीवार चुनें' : selectedPartLabel || 'Select a wall'}
          </p>
        </div>
        {selectedPartId && designs[selectedPartId] && (
          <button
            onClick={() => resetPart(selectedPartId)}
            className="text-[10px] text-red-400 hover:text-red-300 underline"
          >
            {isHi ? 'रीसेट करें' : 'Reset'}
          </button>
        )}
      </div>

      {/* Two-Tone Dado Toggle */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-xs font-medium">
            {isHi ? 'हाफ-वॉल / टू-टोन दादो स्प्लिट' : 'Two-Tone Dado Wall Split'}
          </span>
        </div>
        <input
          type="checkbox"
          checked={isTwoTone}
          onChange={(e) => setIsTwoTone(e.target.checked)}
          className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
        />
      </div>

      {isTwoTone && (
        <div className="p-3 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/60">{isHi ? 'दादो ऊंचाई (ऊपर/नीचे अनुपात)' : 'Dado Split Height'}:</span>
            <span className="text-gold-400 font-mono font-bold">{Math.round(dadoSplit * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.65"
            step="0.05"
            value={dadoSplit}
            onChange={(e) => setDadoSplit(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded accent-gold-500 cursor-pointer"
          />
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-white/50">{isHi ? 'निचला रंग (दादो)' : 'Bottom Dado Color'}:</span>
            <input
              type="color"
              value={dadoColor}
              onChange={(e) => setDadoColor(e.target.value)}
              className="w-7 h-7 rounded border border-white/20 cursor-pointer bg-transparent"
            />
            <span className="text-[11px] font-mono text-gold-400 font-bold">{dadoColor}</span>
          </div>
        </div>
      )}

      {/* Color Family Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'bold', label: isHi ? 'रॉयल बोल्ड' : 'Royale Bold' },
          { id: 'whites', label: isHi ? 'सफेद / ऑफ-व्हाइट' : 'Whites & Off-Whites' },
          { id: 'neutrals', label: isHi ? 'वार्म न्यूट्रल्स' : 'Warm Neutrals' },
          { id: 'cool', label: isHi ? 'ब्लू / टील' : 'Blue & Teal' },
          { id: 'greens', label: isHi ? 'सेज / ग्रीन' : 'Sage & Greens' },
          { id: 'pastels', label: isHi ? 'सॉफ्ट पेस्टल्स' : 'Soft Pastels' },
          { id: 'earth', label: isHi ? 'टेराकोटा' : 'Earth & Gold' },
        ].map((fam) => (
          <button
            key={fam.id}
            type="button"
            onClick={() => setActiveFamily(fam.id as PaintColor['family'])}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors ${
              activeFamily === fam.id
                ? 'bg-gold-500 text-navy-950 font-bold shadow'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {fam.label}
          </button>
        ))}
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-44 overflow-y-auto pr-1">
        {PAINT_COLORS.filter((c) => c.family === activeFamily).map((color) => {
          const isSelected = selectedHex.toUpperCase() === color.hex.toUpperCase();
          return (
            <button
              key={color.code}
              type="button"
              onClick={() => setSelectedHex(color.hex)}
              className={`group flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-gold-400 bg-gold-500/20 scale-105 shadow-md'
                  : 'border-white/10 hover:border-white/30 bg-white/5'
              }`}
              title={`${color.name} (${color.code})`}
            >
              <div
                className="w-full h-8 rounded-lg shadow-inner relative flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-navy-950 font-bold drop-shadow" />}
              </div>
              <span className="text-[9px] font-mono text-white/70 mt-1 truncate w-full text-center">
                {color.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Picker & Eyedropper */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedHex}
            onChange={(e) => setSelectedHex(e.target.value.toUpperCase())}
            className="w-7 h-7 rounded border border-white/20 cursor-pointer bg-transparent"
          />
          <div>
            <p className="text-[9px] text-white/40 uppercase font-bold">{isHi ? 'कस्टम हेक्स कोड' : 'Custom Hex'}</p>
            <p className="text-xs font-mono font-bold text-gold-400">{selectedHex}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePickEyeDropper}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-gold-500/30 text-gold-400 text-xs hover:border-gold-400 transition-colors"
          title={isHi ? 'स्क्रीन से रंग चुनें' : 'Sample color from screen'}
        >
          <Pipette className="w-3.5 h-3.5" />
          <span>{isHi ? 'आईड्रॉपर' : 'Pick'}</span>
        </button>
      </div>

      {/* Suggested Matching Color Harmonies */}
      <div className="p-2.5 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-1.5">
        <div className="flex items-center gap-1.5 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>{isHi ? 'मैचिंग कलर सुझाव (Harmonies)' : 'Matching Color Suggestions'}</span>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: 'Comp', hex: harmonies.complementary },
            { label: 'Ana 1', hex: harmonies.analogous1 },
            { label: 'Ana 2', hex: harmonies.analogous2 },
            { label: 'Tri 1', hex: harmonies.triadic1 },
            { label: 'Tri 2', hex: harmonies.triadic2 },
          ].map((h, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedHex(h.hex)}
              className="flex-1 flex flex-col items-center gap-1 group"
              title={`${h.label}: ${h.hex}`}
            >
              <div
                className="w-full h-6 rounded-md border border-white/20 group-hover:scale-110 transition-transform shadow"
                style={{ backgroundColor: h.hex }}
              />
              <span className="text-[8px] font-mono text-white/50">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Finish Selector */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
          {isHi ? 'पेंट फिनिश व शीन' : 'Paint Finish & Sheen'}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {FINISH_DETAILS.map((f) => {
            const isSelected = finish === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFinish(f.id)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-gold-400 bg-gold-500/20 shadow'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <p className="text-[11px] font-bold text-white">
                  {isHi ? f.labelHi : f.label}
                </p>
                <p className="text-[9px] text-white/40 truncate">{f.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={handleApplySingle}
          disabled={!selectedPartId}
          className="w-full py-2.5 rounded-xl bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {isHi ? 'इस दीवार पर लगाएं' : 'Apply to Selected Wall'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleApplyWholeRoom}
            className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-semibold text-white/80 transition-colors"
          >
            {isHi ? 'पूरे कमरे पर लगाएं' : 'Apply to Whole Room'}
          </button>
          <button
            type="button"
            onClick={handleApplyWallsExceptAccent}
            className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-semibold text-white/80 transition-colors"
          >
            {isHi ? 'दीवारें (एक्सेंट छोड़)' : 'All Walls (No Accent)'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => applyToCeiling({ type: 'color', colorHex: selectedHex, finish })}
            className="py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/60 transition-colors"
          >
            {isHi ? 'सीलिंग पर लगाएं' : 'Apply to Ceiling'}
          </button>
          <button
            type="button"
            onClick={() => applyToExterior({ type: 'color', colorHex: selectedHex, finish })}
            className="py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/60 transition-colors"
          >
            {isHi ? 'एक्सटीरियर पर लगाएं' : 'Apply to Exterior'}
          </button>
        </div>
      </div>
    </div>
  );
};
