import type { PaintFinish } from '../materials/PBRMaterialResolver';

export interface SmartPalette {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  accentColor: string;
  wallColor: string;
  ceilingColor: string;
  wallpaperId?: string;
  finish: PaintFinish;
  tags: string[];
}

export const SMART_PALETTES: SmartPalette[] = [
  {
    id: 'modern-luxe',
    name: 'Modern Luxe',
    nameHi: 'मॉडर्न लक्स',
    description: 'Midnight Navy with Gold Damask and Pearl Ceiling',
    descriptionHi: 'मिडनाइट नेवी, गोल्ड दमास्क और पर्ल सीलिंग का शाही संगम',
    accentColor: '#D4AF37',
    wallColor: '#0E172E',
    ceilingColor: '#FAF8F5',
    wallpaperId: 'royal-damask',
    finish: 'satin',
    tags: ['Luxury', 'Living Room', 'Hero'],
  },
  {
    id: 'warm-traditional',
    name: 'Warm Traditional Bhopal',
    nameHi: 'वार्म ट्रेडिशनल भोपाल',
    description: 'Earthy Terracotta, Ochre Gold with Mughal Jali',
    descriptionHi: 'पारंपरिक टेराकोटा और मुगल जाली का समृद्ध लुक',
    accentColor: '#C9A048',
    wallColor: '#F5ECE1',
    ceilingColor: '#FFFDF9',
    wallpaperId: 'mughal-jali',
    finish: 'matte',
    tags: ['Heritage', 'Pooja', 'Living'],
  },
  {
    id: 'minimal-scandi',
    name: 'Minimal Scandinavian',
    nameHi: 'मिनिमल स्कैंडिनेवियन',
    description: 'Soothing Sage Green with Alabaster and Oak',
    descriptionHi: 'शांत सेज ग्रीन और लाइट ओक का प्रकृति-प्रेरित संगम',
    accentColor: '#7C8F7E',
    wallColor: '#F7F6F2',
    ceilingColor: '#FAFAF8',
    wallpaperId: 'boho-arches',
    finish: 'matte',
    tags: ['Modern', 'Bedroom', 'Relaxing'],
  },
  {
    id: 'royal-indian-emerald',
    name: 'Imperial Emerald & Brass',
    nameHi: 'इंपीरियल एमराल्ड व ब्रास',
    description: 'Deep Forest Emerald with Gold Vein Marble',
    descriptionHi: 'गहरा एमराल्ड और गोल्ड वेन मार्बल का राजसी अंदाज़',
    accentColor: '#E5C158',
    wallColor: '#122E22',
    ceilingColor: '#F6F8F6',
    wallpaperId: 'gold-vein-marble',
    finish: 'satin',
    tags: ['Royal', 'Master Bedroom'],
  },
  {
    id: 'monochrome-charcoal',
    name: 'Urban Charcoal & Acoustic Slats',
    nameHi: 'अर्बन चारकोल व अकूस्टिक',
    description: 'Sophisticated Charcoal with Fluted Timber Battens',
    descriptionHi: 'चारकोल ग्रे और असली वुडन स्लेट्स का आर्किटेक्चरल रूप',
    accentColor: '#7A4D29',
    wallColor: '#2B2E36',
    ceilingColor: '#EBEBEB',
    wallpaperId: 'fluted-timber',
    finish: 'matte',
    tags: ['Architectural', 'Media Wall', 'Contemporary'],
  },
  {
    id: 'kids-dreamland',
    name: 'Pastel Dreamland',
    nameHi: 'पेस्टल ड्रीमलैंड',
    description: 'Gentle Starlight Gold, Cloud Blue and Warm Ivory',
    descriptionHi: 'बच्चों के लिए सुरक्षित और खुशनुमा पेस्टल कलर्स',
    accentColor: '#E8C547',
    wallColor: '#F0F6FA',
    ceilingColor: '#FFFFFF',
    wallpaperId: 'stars-galaxy',
    finish: 'satin',
    tags: ['Kids', 'Playful'],
  },
];
