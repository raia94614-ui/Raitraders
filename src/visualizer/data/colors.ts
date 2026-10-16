/** Color palette data for the 3D Visualizer panel.
 *  To add colors: add entries to any group, or add a new group object.
 *  Each color needs: id, name, code, hex.
 */
export interface PaintColor {
  id: string;
  name: string;
  code: string;
  hex: string;
}

export interface ColorGroup {
  label: string;
  colors: PaintColor[];
}

export const COLOR_GROUPS: ColorGroup[] = [
  {
    label: 'Whites & Off-Whites',
    colors: [
      { id: 'c001', name: 'Pure Snow', code: 'RT-101', hex: '#FFFFFF' },
      { id: 'c002', name: 'Warm Ivory', code: 'RT-102', hex: '#FFFFF0' },
      { id: 'c003', name: 'Antique White', code: 'RT-103', hex: '#FAEBD7' },
      { id: 'c004', name: 'Linen Cloud', code: 'RT-104', hex: '#FAF0E6' },
      { id: 'c005', name: 'Pearl Mist', code: 'RT-105', hex: '#F5F0EB' },
    ],
  },
  {
    label: 'Creams & Beiges',
    colors: [
      { id: 'c006', name: 'Champagne', code: 'RT-111', hex: '#FAD5A5' },
      { id: 'c007', name: 'Desert Sand', code: 'RT-112', hex: '#EDC9AF' },
      { id: 'c008', name: 'Wheat Silk', code: 'RT-113', hex: '#F5DEB3' },
      { id: 'c009', name: 'Almond Bliss', code: 'RT-114', hex: '#EFDECD' },
      { id: 'c010', name: 'Cashmere Nude', code: 'RT-115', hex: '#E8D5C0' },
    ],
  },
  {
    label: 'Blues',
    colors: [
      { id: 'c011', name: 'Midnight Navy', code: 'RT-201', hex: '#0B1530' },
      { id: 'c012', name: 'Royal Sapphire', code: 'RT-202', hex: '#1B3A7A' },
      { id: 'c013', name: 'Denim Ocean', code: 'RT-203', hex: '#1560BD' },
      { id: 'c014', name: 'Steel Blue', code: 'RT-204', hex: '#4682B4' },
      { id: 'c015', name: 'Baby Sky', code: 'RT-205', hex: '#87CEEB' },
      { id: 'c016', name: 'Aqua Dream', code: 'RT-206', hex: '#72BCD4' },
    ],
  },
  {
    label: 'Greens',
    colors: [
      { id: 'c017', name: 'Forest Deep', code: 'RT-301', hex: '#228B22' },
      { id: 'c018', name: 'Sage Serenity', code: 'RT-302', hex: '#87A878' },
      { id: 'c019', name: 'Mint Whisper', code: 'RT-303', hex: '#98FF98' },
      { id: 'c020', name: 'Olive Prestige', code: 'RT-304', hex: '#808000' },
      { id: 'c021', name: 'Jade Palace', code: 'RT-305', hex: '#00A86B' },
    ],
  },
  {
    label: 'Pinks & Mauves',
    colors: [
      { id: 'c022', name: 'Rose Petal', code: 'RT-401', hex: '#FFB7C5' },
      { id: 'c023', name: 'Blush Velvet', code: 'RT-402', hex: '#DE8EA6' },
      { id: 'c024', name: 'Dusty Mauve', code: 'RT-403', hex: '#C4A0A0' },
      { id: 'c025', name: 'Coral Glow', code: 'RT-404', hex: '#FF7F6B' },
      { id: 'c026', name: 'Salmon Dusk', code: 'RT-405', hex: '#FA8072' },
    ],
  },
  {
    label: 'Greys',
    colors: [
      { id: 'c027', name: 'Graphite Storm', code: 'RT-501', hex: '#383838' },
      { id: 'c028', name: 'Slate Elegance', code: 'RT-502', hex: '#708090' },
      { id: 'c029', name: 'Silver Frost', code: 'RT-503', hex: '#C0C0C0' },
      { id: 'c030', name: 'Pale Dove', code: 'RT-504', hex: '#D3D3D3' },
      { id: 'c031', name: 'Warm Greige', code: 'RT-505', hex: '#C2B9A7' },
    ],
  },
  {
    label: 'Bold & Dramatic',
    colors: [
      { id: 'c032', name: 'Midnight Black', code: 'RT-601', hex: '#1A1A1A' },
      { id: 'c033', name: 'Regal Plum', code: 'RT-602', hex: '#7B2D8B' },
      { id: 'c034', name: 'Burgundy Wine', code: 'RT-603', hex: '#800020' },
      { id: 'c035', name: 'Teal Majesty', code: 'RT-604', hex: '#008080' },
      { id: 'c036', name: 'Emerald Jewel', code: 'RT-605', hex: '#046307' },
      { id: 'c037', name: 'Ochre Gold', code: 'RT-606', hex: '#CC7722' },
      { id: 'c038', name: 'Burnt Terracotta', code: 'RT-607', hex: '#C04000' },
      { id: 'c039', name: 'Indigo Mist', code: 'RT-608', hex: '#4B0082' },
      { id: 'c040', name: 'Copper Luxe', code: 'RT-609', hex: '#B87333' },
    ],
  },
];

/** All colors flattened for quick lookup */
export const ALL_COLORS: PaintColor[] = COLOR_GROUPS.flatMap((g) => g.colors);

export const FINISH_OPTIONS = [
  { id: 'matt', label: 'Matt', roughness: 0.95, metalness: 0.0 },
  { id: 'silk', label: 'Silk', roughness: 0.5, metalness: 0.05 },
  { id: 'gloss', label: 'Gloss', roughness: 0.1, metalness: 0.1 },
] as const;

export type FinishId = 'matt' | 'silk' | 'gloss';
