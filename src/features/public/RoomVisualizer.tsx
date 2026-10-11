import React, { useState } from 'react';
import {
  Eye,
  Sparkles,
  MessageCircle,
  Check,
  Palette,
  Home,
  Sun,
  Sunset,
  Moon,
  Sliders,
  Share2,
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { generateWhatsAppUrl } from '../../lib/whatsapp';

interface RoomScene {
  id: string;
  nameEn: string;
  nameHi: string;
  baseImage: string;
  descriptionEn: string;
  descriptionHi: string;
  typicalWallSize: { widthFt: number; heightFt: number };
}

interface PatternStyle {
  id: string;
  nameEn: string;
  nameHi: string;
  category: string;
  colorHex: string;
  patternType: string;
  wallpaperOverlay: string;
  finishTypeEn: string;
  finishTypeHi: string;
  estimatedRollRate: number;
}

type LightingMode = 'daylight' | 'goldenHour' | 'chandelier';
type FinishSheen = 'matte' | 'silk' | 'metallic' | 'velvet';

const ROOM_SCENES: RoomScene[] = [
  {
    id: 'living',
    nameEn: 'Modern Living Room',
    nameHi: 'लिविंग रूम लाउंज',
    baseImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
    descriptionEn: 'Feature accent wall behind sofa lounge',
    descriptionHi: 'सोफा लाउंज के पीछे मुख्य आकर्षण दीवार',
    typicalWallSize: { widthFt: 14, heightFt: 10 },
  },
  {
    id: 'bedroom',
    nameEn: 'Master Suite Bedroom',
    nameHi: 'मास्टर बेडरूम',
    baseImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=80',
    descriptionEn: 'Bed headboard accent feature wall',
    descriptionHi: 'हेडबोर्ड के पीछे रॉयल बैकड्रॉप',
    typicalWallSize: { widthFt: 12, heightFt: 10 },
  },
  {
    id: 'dining',
    nameEn: 'Luxury Dining Hall',
    nameHi: 'रॉयल डाइनिंग एरिया',
    baseImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
    descriptionEn: 'Ambient wall paired with chandelier glow',
    descriptionHi: 'वार्म झूमर लाइटिंग के साथ एम्बिएंट दीवार',
    typicalWallSize: { widthFt: 15, heightFt: 10 },
  },
  {
    id: 'office',
    nameEn: 'Executive Study & Office',
    nameHi: 'एग्जीक्यूटिव ऑफिस',
    baseImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80',
    descriptionEn: 'Prestigious backdrop for meetings and executive presence',
    descriptionHi: 'मीटिंग्स के लिए प्रोफेशनल टेक्सचर्ड बैकड्रॉप',
    typicalWallSize: { widthFt: 11, heightFt: 9.5 },
  },
];

const PATTERN_STYLES: PatternStyle[] = [
  {
    id: 'gold-damask',
    nameEn: 'Royal Mughal Damask',
    nameHi: 'रॉयल मुगल डमास्क (गोल्ड फॉयल)',
    category: 'Metallic Foil',
    colorHex: '#D6A34D',
    patternType: '24K Foil Embossed Vinyl',
    wallpaperOverlay:
      'radial-gradient(circle at 50% 50%, rgba(214, 163, 77, 0.45), rgba(18, 14, 10, 0.7)), repeating-linear-gradient(45deg, rgba(214,163,77,0.18) 0px, rgba(214,163,77,0.18) 22px, transparent 22px, transparent 44px)',
    finishTypeEn: 'Embossed Metallic Relief with German Adhesive',
    finishTypeHi: 'उभरा हुआ 24K मेटैलिक फॉयल विनाइल',
    estimatedRollRate: 3800,
  },
  {
    id: 'emerald-botanical',
    nameEn: 'Emerald Rainforest Silk',
    nameHi: 'एमराल्ड रेनफॉरेस्ट सिल्क',
    category: 'Designer Botanical',
    colorHex: '#1B4D3E',
    patternType: 'Non-Woven Matte Silk Mural',
    wallpaperOverlay:
      'radial-gradient(circle at 60% 40%, rgba(27, 77, 62, 0.58), rgba(10, 25, 20, 0.8)), repeating-linear-gradient(135deg, rgba(27,77,62,0.22) 0px, rgba(27,77,62,0.22) 28px, transparent 28px, transparent 56px)',
    finishTypeEn: 'Matte Organic Silk Fabric Texture',
    finishTypeHi: 'नॉन-वोवन सिल्क मैट फिनिश',
    estimatedRollRate: 4500,
  },
  {
    id: 'charcoal-stucco',
    nameEn: 'Venetian Charcoal Stucco',
    nameHi: 'वेनेटियन चारकोल स्टुको',
    category: 'Artisanal Plaster',
    colorHex: '#2A2A2A',
    patternType: 'Hand-Troweled Italian Stucco',
    wallpaperOverlay:
      'radial-gradient(circle at 50% 50%, rgba(70, 70, 70, 0.52), rgba(15, 15, 15, 0.85)), repeating-radial-gradient(circle, rgba(100,100,100,0.15) 0px, transparent 35px)',
    finishTypeEn: 'Italian Marble Dust with Protective Wax Coat',
    finishTypeHi: 'इटैलियन मार्बल डस्ट वैक्स कोटेड टेक्सचर',
    estimatedRollRate: 3200,
  },
  {
    id: 'pearl-geometric',
    nameEn: 'Pearl Gold Geometry',
    nameHi: 'पर्ल शैम्पेन 3D जियोमेट्री',
    category: '3D Optical Relief',
    colorHex: '#C5B392',
    patternType: '3D Optical Embossed Vinyl',
    wallpaperOverlay:
      'radial-gradient(circle at 50% 50%, rgba(197, 179, 146, 0.48), rgba(30, 25, 20, 0.78)), repeating-linear-gradient(60deg, rgba(214,163,77,0.22) 0px, rgba(214,163,77,0.22) 18px, transparent 18px, transparent 36px)',
    finishTypeEn: '3D Embossed Heavy Vinyl (100% Scrubbable)',
    finishTypeHi: '3D उभरा हुआ विनाइल (वॉशेबल)',
    estimatedRollRate: 2900,
  },
  {
    id: 'wabi-sabi-linen',
    nameEn: 'Wabi-Sabi Textured Linen',
    nameHi: 'वाबी-साबी टेक्सचर्ड लिनेन',
    category: 'Organic Weave',
    colorHex: '#B8A898',
    patternType: 'Natural Coarse Linen Weave',
    wallpaperOverlay:
      'radial-gradient(circle at 50% 50%, rgba(184, 168, 152, 0.45), rgba(24, 20, 18, 0.75)), repeating-linear-gradient(0deg, rgba(184,168,152,0.15) 0px, transparent 4px, transparent 8px)',
    finishTypeEn: 'Acoustic Sound-Dampening Textile Wallcovering',
    finishTypeHi: 'नेचुरल लिनेन टेक्सटाइल फैब्रिक',
    estimatedRollRate: 3500,
  },
  {
    id: 'marble-vein',
    nameEn: 'Florentine Gold Marble',
    nameHi: 'फ्लोरेंटाइन गोल्ड मार्बल',
    category: 'Metallic Veins',
    colorHex: '#3D3126',
    patternType: 'Liquid Marble & Gold Leaf Veining',
    wallpaperOverlay:
      'radial-gradient(circle at 70% 30%, rgba(214, 163, 77, 0.4), transparent 60%), linear-gradient(125deg, rgba(30,25,20,0.85) 0%, rgba(61,49,38,0.7) 50%, rgba(20,16,12,0.9) 100%)',
    finishTypeEn: 'High-Gloss Polished Lacquer Finish',
    finishTypeHi: 'मार्बल वेन्स विथ लिक्विड गोल्ड लीफ',
    estimatedRollRate: 5200,
  },
];

interface RoomVisualizerProps {
  whatsappNumber: string;
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ whatsappNumber }) => {
  const showToast = useUiStore((s) => s.showToast);

  const [selectedRoom, setSelectedRoom] = useState<RoomScene>(ROOM_SCENES[0]);
  const [selectedPattern, setSelectedPattern] = useState<PatternStyle>(PATTERN_STYLES[0]);
  const [lightingMode, setLightingMode] = useState<LightingMode>('chandelier');
  const [finishSheen, setFinishSheen] = useState<FinishSheen>('metallic');
  const [hasMoulding, setHasMoulding] = useState<boolean>(true);
  const [patternScale, setPatternScale] = useState<number>(1);
  const [patternOpacity, setPatternOpacity] = useState<number>(80);

  const roomName = selectedRoom.nameEn;
  const patternName = selectedPattern.nameEn;

  // Real-time wall specs
  const wallAreaSqFt = selectedRoom.typicalWallSize.widthFt * selectedRoom.typicalWallSize.heightFt;

  // Lighting overlay styling
  const getLightingStyle = () => {
    switch (lightingMode) {
      case 'daylight':
        return 'bg-gradient-to-tr from-sky-400/10 via-transparent to-amber-100/15';
      case 'goldenHour':
        return 'bg-gradient-to-r from-amber-600/35 via-orange-500/20 to-yellow-600/25';
      case 'chandelier':
        return 'bg-gradient-to-t from-black/80 via-[#D6A34D]/15 to-amber-900/30';
    }
  };

  const handleOrderLook = () => {
    const url = generateWhatsAppUrl(whatsappNumber, {
      service: `3D Room Visualizer: ${patternName}`,
      roomType: roomName,
      preferredStyle: `${patternName} (${selectedPattern.category})`,
      areaSqFt: wallAreaSqFt,
      notes: `Visualized in RAI TRADERS 3D Studio with Lighting: ${lightingMode}, Sheen: ${finishSheen}, Moulding: ${hasMoulding ? 'Included' : 'None'}. Please schedule physical catalog presentation & free measurement at my home in Bhopal.`,
    });
    window.open(url, '_blank');
  };

  const handleShareSnapshot = () => {
    navigator.clipboard?.writeText(
      `Check out this ${patternName} wall design visualized for ${roomName} on RAI TRADERS: https://raitraders.com/#visualizer`
    );
    showToast('Visualization design details copied to clipboard!', 'success');
  };

  return (
    <section id="visualizer" className="py-24 bg-[#061522] relative overflow-hidden">
      
      {/* Decorative Atmosphere Radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D6A34D]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[#0E243A] shadow-sm">
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Next-Gen 3D Room Visualizer 2.0
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Interactive Wall Architecture & Lighting Studio
          </h2>

          <p className="text-sm sm:text-base text-cream-300 leading-relaxed">
            Simulate how signature luxury wallpapers respond to morning daylight, warm golden hour, and evening chandelier glow across Bhopal interiors.
          </p>
        </div>

        {/* Visualizer Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visualizer Stage (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* The Stage Container */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold-500/35 shadow-2xl bg-black aspect-[16/10] sm:aspect-[16/9] group">
              
              {/* Base High-Res Room Scene */}
              <img
                src={selectedRoom.baseImage}
                alt={roomName}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                loading="eager"
              />

              {/* Dynamic Wallpaper Overlay Layer */}
              <div
                className="absolute inset-0 transition-all duration-700 pointer-events-none mix-blend-multiply"
                style={{
                  background: selectedPattern.wallpaperOverlay,
                  opacity: patternOpacity / 100,
                  transform: `scale(${patternScale})`,
                  transformOrigin: 'center center',
                }}
              />

              {/* Finish Sheen Reflection Simulator */}
              {finishSheen === 'metallic' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D6A34D]/25 to-transparent pointer-events-none mix-blend-screen opacity-70 animate-pulse" />
              )}
              {finishSheen === 'silk' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none mix-blend-overlay" />
              )}

              {/* Architectural Moulding / Cornice Frame */}
              {hasMoulding && (
                <div className="absolute inset-4 sm:inset-8 border-4 border-[#D6A34D]/40 rounded-xl pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-1.5 border border-[#D6A34D]/20 rounded-lg pointer-events-none" />
                </div>
              )}

              {/* Dynamic Atmospheric Lighting Mask */}
              <div
                className={`absolute inset-0 pointer-events-none transition-all duration-700 ${getLightingStyle()}`}
              />

              {/* Top HUD Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white max-w-xs shadow-xl">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold block">
                    {selectedPattern.category} • {finishSheen.toUpperCase()}
                  </span>
                  <h4 className="font-heading text-sm font-bold truncate">{patternName}</h4>
                  <p className="text-[11px] text-stone-300">
                    {roomName} (~{wallAreaSqFt} sq. ft.)
                  </p>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={handleShareSnapshot}
                    className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-md"
                    title="Share Design Configuration"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setHasMoulding(!hasMoulding)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all cursor-pointer shadow-md ${
                      hasMoulding
                        ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                        : 'bg-black/70 text-white border-white/15'
                    }`}
                  >
                    {hasMoulding ? 'Wall Moulding: ON' : 'Moulding: OFF'}
                  </button>
                </div>
              </div>

              {/* Bottom Real-Time HUD inside Stage */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xl">
                
                {/* Theme Selection Indicator */}
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">
                      Selected Theme
                    </span>
                    <strong className="text-white text-sm font-serif">
                      {patternName}
                    </strong>
                    <span className="text-[11px] text-cream-200/80 ml-2">
                      • Free On-Site Bhopal Consultation
                    </span>
                  </div>
                </div>

                {/* WhatsApp Order Action */}
                <button
                  onClick={handleOrderLook}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A34D] via-[#E2B96F] to-[#B37F2E] text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-lg shadow-[#D6A34D]/25"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order This Look</span>
                </button>
              </div>

            </div>

            {/* Room Atmosphere & Lighting Controls Bar */}
            <div className="p-4 rounded-2xl border border-gold-500/20 bg-[#0A1D30] grid sm:grid-cols-2 gap-4 text-xs">
              
              {/* Lighting Mode Selector */}
              <div className="space-y-1.5">
                <span className="font-semibold text-cream-200 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Lighting Atmosphere:</span>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daylight', label: 'Daylight', icon: <Sun className="w-3.5 h-3.5" /> },
                    { id: 'goldenHour', label: 'Sunset', icon: <Sunset className="w-3.5 h-3.5" /> },
                    { id: 'chandelier', label: 'Evening', icon: <Moon className="w-3.5 h-3.5" /> },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLightingMode(l.id as any)}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        lightingMode === l.id
                          ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-bold'
                          : 'border-gold-500/20 bg-[#061522] text-cream-300'
                      }`}
                    >
                      {l.icon}
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish Sheen Selector */}
              <div className="space-y-1.5">
                <span className="font-semibold text-cream-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Surface Luster / Sheen:</span>
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['matte', 'silk', 'metallic', 'velvet'] as FinishSheen[]).map((sh) => (
                    <button
                      key={sh}
                      onClick={() => setFinishSheen(sh)}
                      className={`py-2 px-1 rounded-xl border text-center uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                        finishSheen === sh
                          ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-bold'
                          : 'border-gold-500/20 bg-[#061522] text-cream-300'
                      }`}
                    >
                      {sh}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Room Scene Selector Bar */}
            <div className="p-4 rounded-2xl border border-gold-500/20 bg-[#0A1D30] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cream-300 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[var(--accent)]" />
                Select Room Space:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROOM_SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedRoom(scene)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                      selectedRoom.id === scene.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-white font-bold ring-1 ring-[var(--accent)]'
                        : 'border-gold-500/20 bg-[#061522] text-cream-300 hover:text-white'
                    }`}
                  >
                    <p className="text-xs truncate">
                      {scene.nameEn}
                    </p>
                    <span className="text-[10px] text-cream-300/70 block">
                      {scene.typicalWallSize.widthFt}x{scene.typicalWallSize.heightFt} ft
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Pattern Collection Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl border border-gold-500/20 bg-[#0A1D30] space-y-5">
              
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[var(--accent)]" />
                  <span>Curated Atelier Collection</span>
                </span>
                <h3 className="font-heading text-lg font-bold text-cream-50">
                  Signature Wall Finishes
                </h3>
              </div>

              {/* Scale & Intensity Sliders */}
              <div className="p-3.5 rounded-xl bg-[#061522] border border-gold-500/20 space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-cream-200">
                    <span>Pattern Scale:</span>
                    <strong className="text-[var(--accent)]">{patternScale}x</strong>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.8"
                    step="0.2"
                    value={patternScale}
                    onChange={(e) => setPatternScale(Number(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-cream-200">
                    <span>Texture Depth:</span>
                    <strong className="text-[var(--accent)]">{patternOpacity}%</strong>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="95"
                    value={patternOpacity}
                    onChange={(e) => setPatternOpacity(Number(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                </div>
              </div>

              {/* Patterns List */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {PATTERN_STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setSelectedPattern(style)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedPattern.id === style.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 shadow-md ring-1 ring-[var(--accent)]'
                        : 'border-gold-500/20 hover:border-gold-500/35 bg-[#061522]'
                    }`}
                  >
                    <div
                      className="w-11 h-11 rounded-lg border border-black/30 shrink-0 shadow-inner flex items-center justify-center"
                      style={{ background: style.wallpaperOverlay }}
                    >
                      {selectedPattern.id === style.id && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-bold text-white truncate">
                        {style.nameEn}
                      </h4>
                      <span className="text-[11px] text-[var(--accent)] font-semibold block">
                        Premium Grade • {style.finishTypeEn}
                      </span>
                      <p className="text-[10px] text-cream-300 truncate">
                        {style.patternType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Book Site Sample CTA */}
              <button
                onClick={handleOrderLook}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A34D] via-[#E2B96F] to-[#B37F2E] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-xl cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Physical Swatches at Home</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
