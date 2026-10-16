import { create } from 'zustand';
import type { SurfaceDesign, PaintFinish } from '../materials/PBRMaterialResolver';

export type RoomId =
  | 'living'
  | 'master_bedroom'
  | 'kids'
  | 'kitchen'
  | 'dining'
  | 'bathroom'
  | 'pooja'
  | 'balcony'
  | 'hallway'
  | 'exterior';

export type CameraMode = 'inside_360' | 'dollhouse';
export type LightingTime = 'day' | 'evening' | 'night';
export type HdrEnvironmentPreset = 'apartment' | 'sunset' | 'city';
export type Language = 'en' | 'hi';
export type QualityLevel = 'high' | 'medium' | 'low';

export interface RoomMeta {
  id: RoomId;
  label: string;
  labelHi: string;
  emoji: string;
  areaDefaultSqFt: number;
  centerPos: [number, number, number];
  dollhousePos: [number, number, number];
}

export const ROOMS_METADATA: RoomMeta[] = [
  {
    id: 'living',
    label: 'Living Room',
    labelHi: 'लिविंग रूम',
    emoji: '🛋️',
    areaDefaultSqFt: 240,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 4.2, 7.2],
  },
  {
    id: 'master_bedroom',
    label: 'Master Bedroom',
    labelHi: 'मास्टर बेडरूम',
    emoji: '🛏️',
    areaDefaultSqFt: 210,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 4.2, 7.0],
  },
  {
    id: 'kids',
    label: "Kids' Room",
    labelHi: 'बच्चों का कमरा',
    emoji: '🧸',
    areaDefaultSqFt: 180,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 4.2, 6.8],
  },
  {
    id: 'kitchen',
    label: 'Modular Kitchen',
    labelHi: 'मॉड्यूलर किचन',
    emoji: '🍳',
    areaDefaultSqFt: 140,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 4.2, 6.6],
  },
  {
    id: 'dining',
    label: 'Dining Space',
    labelHi: 'डाइनिंग एरिया',
    emoji: '🍽️',
    areaDefaultSqFt: 160,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 4.0, 6.8],
  },
  {
    id: 'pooja',
    label: 'Pooja Room',
    labelHi: 'पूजा घर',
    emoji: '🪔',
    areaDefaultSqFt: 75,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 3.8, 6.0],
  },
  {
    id: 'bathroom',
    label: 'Luxury Spa Bath',
    labelHi: 'बाथरूम / स्पा',
    emoji: '🛁',
    areaDefaultSqFt: 90,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 3.8, 6.0],
  },
  {
    id: 'balcony',
    label: 'Balcony & Garden',
    labelHi: 'बालकनी व गार्डन',
    emoji: '🪴',
    areaDefaultSqFt: 120,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 4.2, 7.0],
  },
  {
    id: 'hallway',
    label: 'Gallery Hallway',
    labelHi: 'गैलरी हॉलवे',
    emoji: '🖼️',
    areaDefaultSqFt: 110,
    centerPos: [0, 1.55, 0],
    dollhousePos: [0, 4.0, 6.5],
  },
  {
    id: 'exterior',
    label: 'Exterior Facade',
    labelHi: 'विला एक्सटीरियर',
    emoji: '🏡',
    areaDefaultSqFt: 1400,
    centerPos: [0, 1.8, 0],
    dollhousePos: [9, 5.5, 11],
  },
];

export interface VisualizerStoreState {
  activeRoom: RoomId;
  cameraMode: CameraMode;
  lightingTime: LightingTime;
  hdrPreset: HdrEnvironmentPreset;
  selectedPartId: string | null;
  selectedPartLabel: string | null;
  selectedPartLabelHi: string | null;
  designs: Record<string, SurfaceDesign>;
  history: Array<Record<string, SurfaceDesign>>;
  historyIndex: number;
  beforeAfterProgress: number; // 0 (original) to 100 (customized)
  isAutoRotating: boolean;
  gyroEnabled: boolean;
  language: Language;
  qualityLevel: QualityLevel;
  photoUploadActive: boolean;
  guidedTourOpen: boolean;
  quoteModalOpen: boolean;
  areaSqFt: number;
  appliedSmartPalette: string | null;

  // Actions
  setActiveRoom: (room: RoomId) => void;
  setCameraMode: (mode: CameraMode) => void;
  setLightingTime: (time: LightingTime) => void;
  setHdrPreset: (preset: HdrEnvironmentPreset) => void;
  selectPart: (partId: string | null, label?: string, labelHi?: string) => void;
  applyDesign: (partId: string, design: SurfaceDesign) => void;
  applyToWholeRoom: (design: SurfaceDesign) => void;
  applyToAllWallsExceptAccent: (design: SurfaceDesign) => void;
  applyToCeiling: (design: SurfaceDesign) => void;
  applyToExterior: (design: SurfaceDesign) => void;
  applySmartPalette: (
    paletteId: string,
    scheme: {
      accentColor: string;
      wallColor: string;
      ceilingColor?: string;
      wallpaperId?: string;
      finish?: PaintFinish;
    }
  ) => void;
  resetPart: (partId: string) => void;
  resetCurrentRoom: () => void;
  undo: () => void;
  redo: () => void;
  toggleAutoRotate: () => void;
  setGyroEnabled: (enabled: boolean) => void;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  setQualityLevel: (level: QualityLevel) => void;
  setBeforeAfterProgress: (progress: number) => void;
  setPhotoUploadActive: (active: boolean) => void;
  setGuidedTourOpen: (open: boolean) => void;
  setQuoteModalOpen: (open: boolean) => void;
  setAreaSqFt: (sqFt: number) => void;
  loadDesignsState: (designs: Record<string, SurfaceDesign>, room?: RoomId) => void;
  clearAll: () => void;
}

const MAX_HISTORY = 40;

function pushToHistory(
  history: Array<Record<string, SurfaceDesign>>,
  historyIndex: number,
  newDesigns: Record<string, SurfaceDesign>
) {
  const sliced = history.slice(0, historyIndex + 1);
  sliced.push({ ...newDesigns });
  if (sliced.length > MAX_HISTORY) sliced.shift();
  return { history: sliced, historyIndex: sliced.length - 1 };
}

export const useVisualizerStore = create<VisualizerStoreState>((set, get) => ({
  activeRoom: 'exterior',
  cameraMode: 'inside_360',
  lightingTime: 'day',
  hdrPreset: 'apartment',
  selectedPartId: null,
  selectedPartLabel: null,
  selectedPartLabelHi: null,
  designs: {},
  history: [{}],
  historyIndex: 0,
  beforeAfterProgress: 100,
  isAutoRotating: false,
  gyroEnabled: false,
  language: 'en',
  qualityLevel: 'high',
  photoUploadActive: false,
  guidedTourOpen: false,
  quoteModalOpen: false,
  areaSqFt: 1400,
  appliedSmartPalette: null,

  setActiveRoom: (room) => {
    const meta = ROOMS_METADATA.find((r) => r.id === room);
    set({
      activeRoom: room,
      selectedPartId: null,
      selectedPartLabel: null,
      areaSqFt: meta?.areaDefaultSqFt ?? 200,
    });
  },

  setCameraMode: (mode) => set({ cameraMode: mode, selectedPartId: null }),
  setLightingTime: (time) => set({ lightingTime: time }),
  setHdrPreset: (preset) => set({ hdrPreset: preset }),

  selectPart: (partId, label, labelHi) =>
    set({
      selectedPartId: partId,
      selectedPartLabel: label ?? null,
      selectedPartLabelHi: labelHi ?? null,
    }),

  applyDesign: (partId, design) => {
    const { designs, history, historyIndex } = get();
    const newDesigns = { ...designs, [partId]: design };
    set({
      designs: newDesigns,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  applyToWholeRoom: (design) => {
    const { activeRoom, designs, history, historyIndex } = get();
    const roomPartIds = [
      `${activeRoom}/back-wall`,
      `${activeRoom}/left-wall`,
      `${activeRoom}/right-wall`,
      `${activeRoom}/front-wall`,
      `${activeRoom}/accent-wall`,
      `${activeRoom}/ceiling`,
    ];
    const newDesigns = { ...designs };
    roomPartIds.forEach((id) => {
      newDesigns[id] = design;
    });
    set({
      designs: newDesigns,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  applyToAllWallsExceptAccent: (design) => {
    const { activeRoom, designs, history, historyIndex } = get();
    const wallIds = [
      `${activeRoom}/back-wall`,
      `${activeRoom}/left-wall`,
      `${activeRoom}/right-wall`,
      `${activeRoom}/front-wall`,
    ];
    const newDesigns = { ...designs };
    wallIds.forEach((id) => {
      newDesigns[id] = design;
    });
    set({
      designs: newDesigns,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  applyToCeiling: (design) => {
    const { activeRoom, designs, history, historyIndex } = get();
    const newDesigns = { ...designs, [`${activeRoom}/ceiling`]: design };
    set({
      designs: newDesigns,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  applyToExterior: (design) => {
    const { designs, history, historyIndex } = get();
    const extIds = [
      'exterior/wood-slat-facade',
      'exterior/wood-slat-left',
      'exterior/cantilever-upper',
      'exterior/terrace-accent-wall',
      'exterior/terrace-side-wall',
      'exterior/boundary-wall',
    ];
    const newDesigns = { ...designs };
    extIds.forEach((id) => {
      newDesigns[id] = design;
    });
    set({
      designs: newDesigns,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  applySmartPalette: (paletteId, scheme) => {
    const { activeRoom, designs, history, historyIndex } = get();
    const newDesigns = { ...designs };

    // Accent wall with wallpaper or accent color
    if (scheme.wallpaperId) {
      newDesigns[`${activeRoom}/accent-wall`] = {
        type: 'wallpaper',
        wallpaperId: scheme.wallpaperId,
        wallpaperTint: scheme.accentColor,
      };
    } else {
      newDesigns[`${activeRoom}/accent-wall`] = {
        type: 'color',
        colorHex: scheme.accentColor,
        finish: scheme.finish ?? 'matte',
      };
    }

    // Remaining walls
    ['back-wall', 'left-wall', 'right-wall', 'front-wall'].forEach((part) => {
      newDesigns[`${activeRoom}/${part}`] = {
        type: 'color',
        colorHex: scheme.wallColor,
        finish: scheme.finish ?? 'matte',
      };
    });

    if (scheme.ceilingColor) {
      newDesigns[`${activeRoom}/ceiling`] = {
        type: 'color',
        colorHex: scheme.ceilingColor,
        finish: 'matte',
      };
    }

    set({
      designs: newDesigns,
      appliedSmartPalette: paletteId,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  resetPart: (partId) => {
    const { designs, history, historyIndex } = get();
    const newDesigns = { ...designs };
    delete newDesigns[partId];
    set({
      designs: newDesigns,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  resetCurrentRoom: () => {
    const { activeRoom, designs, history, historyIndex } = get();
    const newDesigns = { ...designs };
    Object.keys(newDesigns).forEach((k) => {
      if (k.startsWith(`${activeRoom}/`)) {
        delete newDesigns[k];
      }
    });
    set({
      designs: newDesigns,
      ...pushToHistory(history, historyIndex, newDesigns),
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({ designs: { ...history[newIndex] }, historyIndex: newIndex });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({ designs: { ...history[newIndex] }, historyIndex: newIndex });
  },

  toggleAutoRotate: () => set((s) => ({ isAutoRotating: !s.isAutoRotating })),
  setGyroEnabled: (enabled) => set({ gyroEnabled: enabled }),
  toggleLanguage: () =>
    set((s) => ({ language: s.language === 'en' ? 'hi' : 'en' })),
  setLanguage: (lang) => set({ language: lang }),
  setQualityLevel: (level) => set({ qualityLevel: level }),
  setBeforeAfterProgress: (progress) => set({ beforeAfterProgress: progress }),
  setPhotoUploadActive: (active) => set({ photoUploadActive: active }),
  setGuidedTourOpen: (open) => set({ guidedTourOpen: open }),
  setQuoteModalOpen: (open) => set({ quoteModalOpen: open }),
  setAreaSqFt: (sqFt) => set({ areaSqFt: sqFt }),

  loadDesignsState: (designs, room) =>
    set((s) => ({
      designs,
      activeRoom: room ?? s.activeRoom,
      history: [designs],
      historyIndex: 0,
      selectedPartId: null,
    })),

  clearAll: () =>
    set({
      designs: {},
      history: [{}],
      historyIndex: 0,
      selectedPartId: null,
      appliedSmartPalette: null,
    }),
}));
