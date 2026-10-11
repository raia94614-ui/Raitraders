import React, { useState } from 'react';
import { Microscope, Shield, Droplets, Sun, Flame, MessageCircle, Layers } from 'lucide-react';
import { generateQuickInquiryUrl } from '../../lib/whatsapp';

interface MaterialSpec {
  id: string;
  nameEn: string;
  nameHi: string;
  categoryEn: string;
  categoryHi: string;
  image: string;
  macroZoomImage: string;
  composition: string;
  weightGsm: string;
  scrubbability: string;
  lightfastness: string;
  fireRating: string;
  adhesive: string;
  highlights: string[];
}

const LUXURY_MATERIALS: MaterialSpec[] = [
  {
    id: 'gold-foil',
    nameEn: '24K Gold Foil Damask',
    nameHi: '24K गोल्ड फॉयल डमास्क',
    categoryEn: 'Metallic Embossed Vinyl',
    categoryHi: 'मेटैलिक उभरा हुआ विनाइल',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    macroZoomImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90',
    composition: 'Hot-Stamped Metallic Foil over Non-Woven Backing',
    weightGsm: '380 GSM (Heavy Commercial Grade)',
    scrubbability: 'Extra-Washable & Scrubbable with Damp Sponge',
    lightfastness: 'Good Lightfastness (>7 Years Fade-Free)',
    fireRating: 'Class A (Euroclass B-s1, d0)',
    adhesive: 'Heavy Methylcellulose Paste with PVA Reinforcement',
    highlights: ['Micro-embossed 3D tactile relief', 'Seamless vertical butt-joints', 'Zero adhesive bleed'],
  },
  {
    id: 'venetian-stucco',
    nameEn: 'Venetian Marble Stucco',
    nameHi: 'वेनेटियन मार्बल स्टुको',
    categoryEn: 'Artisanal Italian Plaster',
    categoryHi: 'इटैलियन मार्बल डस्ट प्लास्टर',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    macroZoomImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=90',
    composition: 'Slaked Aged Lime & Carrara Marble Powder',
    weightGsm: 'Hand-applied 1.8mm depth',
    scrubbability: 'Water-Repellent after Natural Beeswax Polish',
    lightfastness: 'Mineral UV-Stable (Lifetime Guarantee)',
    fireRating: 'Class A1 Non-Combustible',
    adhesive: 'Direct Hydraulic Wall Bond',
    highlights: ['Cool to the touch', 'Natural anti-bacterial lime base', 'Rich specular reflections'],
  },
  {
    id: 'rainforest-silk',
    nameEn: 'Rainforest Mulberry Silk',
    nameHi: 'रेनफॉरेस्ट मलबरी सिल्क',
    categoryEn: 'Textile Wallcovering',
    categoryHi: 'नेचुरल सिल्क टेक्सटाइल',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    macroZoomImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=90',
    composition: 'Natural Spun Silk Threads on Non-Woven Cellulose',
    weightGsm: '290 GSM (Loom Weave)',
    scrubbability: 'Sponge Clean with Dry Microfiber Cloth',
    lightfastness: 'UV-Protected Reactive Dyes',
    fireRating: 'Class B Fire-Retardant',
    adhesive: 'Solvent-Free German Clear Paste',
    highlights: ['Organic shimmering luster', 'Breathable zero-VOC composition', 'Acoustic softening'],
  },
  {
    id: 'optical-relief',
    nameEn: '3D Champagne Geometric',
    nameHi: '3D शैम्पेन जियोमेट्रिक',
    categoryEn: '3D Optical Relief',
    categoryHi: '3D ऑप्टिकल विनाइल',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    macroZoomImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=90',
    composition: 'Expanded PVC Foam on Heavy Scrim Backing',
    weightGsm: '420 GSM (High Impact Resistance)',
    scrubbability: 'Fully Waterproof & High Scrub Resistance',
    lightfastness: 'Superior (>8 Years Lightfastness)',
    fireRating: 'Self-Extinguishing B1 Grade',
    adhesive: 'Heavy Vinyl German Ready-Mix',
    highlights: ['Conceals minor wall undulations', 'Sound dampening 0.25 NRC', 'Impact-resistant vinyl'],
  },
];

interface TextureLabSectionProps {
  whatsappNumber: string;
}

export const TextureLabSection: React.FC<TextureLabSectionProps> = ({ whatsappNumber }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSpec>(LUXURY_MATERIALS[0]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const matName = selectedMaterial.nameEn;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const whatsappUrl = generateQuickInquiryUrl(
    whatsappNumber,
    `Sample Swatch Inspection: ${matName}`
  );

  return (
    <section id="texture-lab" className="py-24 bg-[#0A1D30]/90 relative overflow-hidden border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[#061522]/90">
            <Microscope className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Macro Texture & Material Lab
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50">
            Inspect the Craftsmanship in 4X Macro
          </h2>

          <p className="text-sm sm:text-base text-cream-300">
            Move your cursor over any swatch to activate the optical loupe and inspect foil grains, embossing depth, and substrate density.
          </p>
        </div>

        {/* Material Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {LUXURY_MATERIALS.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setSelectedMaterial(mat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
                selectedMaterial.id === mat.id
                  ? 'bg-gradient-to-r from-[#D6A34D] to-[#B37F2E] text-black shadow-lg shadow-[#D6A34D]/20 scale-102 font-bold'
                  : 'border border-gold-500/20 bg-[#061522]/90 text-cream-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Interactive Lab Stage & Specs Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Interactive Loupe Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-gold-500/35 bg-black shadow-2xl cursor-crosshair group select-none"
            >
              {/* Base Texture Image */}
              <img
                src={selectedMaterial.image}
                alt={matName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />

              {/* Magnifying Optical Loupe Lens */}
              {isHovering && (
                <div
                  className="absolute pointer-events-none w-52 h-52 rounded-full border-2 border-[#D6A34D] shadow-[0_0_30px_rgba(214,163,77,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                  }}
                >
                  {/* Zoomed Image Inside Loupe */}
                  <div
                    className="w-full h-full bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${selectedMaterial.macroZoomImage})`,
                      backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                      backgroundSize: '350%',
                    }}
                  />
                  {/* Crosshair indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 border border-[var(--accent)]/60 rounded-full" />
                  </div>
                </div>
              )}

              {/* Top Info Tag */}
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white max-w-xs pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-wider block">
                  {selectedMaterial.categoryEn}
                </span>
                <h4 className="font-heading text-sm font-bold">{matName}</h4>
                <p className="text-[11px] text-cream-300">{selectedMaterial.composition}</p>
              </div>

              {/* Bottom Instruction Pill */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Microscope className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Interactive 4X Macro Loupe Active: Hover to inspect
                </span>
                <span className="font-bold text-[var(--accent)]">{selectedMaterial.weightGsm}</span>
              </div>
            </div>
          </div>

          {/* Right Architectural Specifications Sheet (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-2xl border border-gold-500/20 bg-[#061522]/90 space-y-6 shadow-xl">
              
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-bold block">
                  Architectural Specifications
                </span>
                <h3 className="font-heading text-2xl font-bold text-white">
                  {matName}
                </h3>
                <p className="text-xs text-cream-300">
                  Certified German standards for humidity-resistant luxury interior application in Bhopal.
                </p>
              </div>

              {/* Specs HUD Grid */}
              <div className="space-y-3 pt-2 text-xs">
                
                <div className="p-3 rounded-xl bg-[#0E243A]/90 border border-gold-500/20 flex items-start gap-3">
                  <Droplets className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Scrubbability & Maintenance</strong>
                    <span className="text-cream-300 text-[11px]">{selectedMaterial.scrubbability}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0E243A]/90 border border-gold-500/20 flex items-start gap-3">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Lightfastness (UV Sunlight)</strong>
                    <span className="text-cream-300 text-[11px]">{selectedMaterial.lightfastness}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0E243A]/90 border border-gold-500/20 flex items-start gap-3">
                  <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Fire Retardancy Standard</strong>
                    <span className="text-cream-300 text-[11px]">{selectedMaterial.fireRating}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0E243A]/90 border border-gold-500/20 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Adhesive Formulation</strong>
                    <span className="text-cream-300 text-[11px]">{selectedMaterial.adhesive}</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Physical Swatch Book in Bhopal</span>
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
