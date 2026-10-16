import { create } from 'zustand';
import type { FinishId } from './data/colors';

export type ViewMode = 'exterior' | 'interior';
export type RoomId = 'living' | 'bedroom' | 'kitchen' | 'kids';
export type DayNight = 'day' | 'night';

export interface PartDesign {
  type: 'color' | 'wallpaper' | 'texture' | 'none';
  /** Hex color for type === 'color' */
  colorHex?: string;
  colorName?: string;
  colorCode?: string;
  finish?: FinishId;
  /** Pattern id for type === 'wallpaper' */
  patternId?: string;
  patternName?: string;
  patternCode?: string;
  /** Tint for wallpaper */
  tintHex?: string;
  /** Scale 0.5–3 for pattern */
  patternScale?: number;
  /** Rotation 0–360 */
  patternRotation?: number;
  /** Texture effect id for type === 'texture' */
  textureId?: string;
  textureName?: string;
}

export type CameraMode = 'orbit' | 'panorama';

/** State for the entire design session */
export interface VisualizerState {
  viewMode: ViewMode;
  cameraMode: CameraMode;
  currentRoom: RoomId;
  dayNight: DayNight;
  selectedPartId: string | null;
  /** Map from partId → design */
  designs: Record<string, PartDesign>;
  /** History for undo/redo */
  history: Array<Record<string, PartDesign>>;
  historyIndex: number;
  isAutoRotating: boolean;
  showHints: boolean;
  panelTab: 'paint' | 'wallpaper' | 'texture';
  beforeAfterProgress: number; // 0 to 100, default 100

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setCameraMode: (mode: CameraMode) => void;
  setCurrentRoom: (room: RoomId) => void;
  toggleDayNight: () => void;
  selectPart: (partId: string | null) => void;
  applyDesign: (partId: string, design: PartDesign) => void;
  applyToWholeRoom: (design: PartDesign) => void;
  applyToAllWalls: (design: PartDesign) => void;
  resetPart: (partId: string) => void;
  undo: () => void;
  redo: () => void;
  toggleAutoRotate: () => void;
  dismissHints: () => void;
  setPanelTab: (tab: 'paint' | 'wallpaper' | 'texture') => void;
  setBeforeAfterProgress: (progress: number) => void;
  clearAll: () => void;
}

/** All part IDs for a given room – walls + ceiling + floor */
export function getRoomPartIds(room: RoomId): string[] {
  return [
    `${room}/back-wall`,
    `${room}/left-wall`,
    `${room}/right-wall`,
    `${room}/front-wall`,
    `${room}/ceiling`,
    `${room}/floor`,
    `${room}/accent-wall`,
  ];
}

/** Wall-only part IDs */
export function getRoomWallIds(room: RoomId): string[] {
  return [
    `${room}/back-wall`,
    `${room}/left-wall`,
    `${room}/right-wall`,
    `${room}/front-wall`,
    `${room}/accent-wall`,
  ];
}

const MAX_HISTORY = 20;

function pushHistory(
  history: Array<Record<string, PartDesign>>,
  historyIndex: number,
  designs: Record<string, PartDesign>
) {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push({ ...designs });
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  return { history: newHistory, historyIndex: newHistory.length - 1 };
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  viewMode: 'exterior',
  cameraMode: 'orbit',
  currentRoom: 'living',
  dayNight: 'day',
  selectedPartId: null,
  designs: {},
  history: [{}],
  historyIndex: 0,
  isAutoRotating: false,
  showHints: true,
  panelTab: 'paint',
  beforeAfterProgress: 100,

  setViewMode: (mode) => set({
    viewMode: mode,
    selectedPartId: null,
    ...(mode === 'exterior' ? { cameraMode: 'orbit' } : {}),
  }),
  setCameraMode: (mode) => set({
    cameraMode: mode,
    selectedPartId: null,
    ...(mode === 'panorama' ? { viewMode: 'interior' } : {}),
  }),
  setCurrentRoom: (room) => set({ currentRoom: room, selectedPartId: null }),
  toggleDayNight: () => set((s) => ({ dayNight: s.dayNight === 'day' ? 'night' : 'day' })),
  selectPart: (partId) => set({ selectedPartId: partId }),
  setPanelTab: (tab) => set({ panelTab: tab }),
  setBeforeAfterProgress: (progress) => set({ beforeAfterProgress: progress }),
  dismissHints: () => set({ showHints: false }),
  toggleAutoRotate: () => set((s) => ({ isAutoRotating: !s.isAutoRotating })),

  applyDesign: (partId, design) => {
    const { designs, history, historyIndex } = get();
    const newDesigns = { ...designs, [partId]: design };
    set({ designs: newDesigns, ...pushHistory(history, historyIndex, newDesigns) });
  },

  applyToWholeRoom: (design) => {
    const { currentRoom, designs, history, historyIndex } = get();
    const ids = getRoomPartIds(currentRoom);
    const newDesigns = { ...designs };
    ids.forEach((id) => { newDesigns[id] = design; });
    set({ designs: newDesigns, ...pushHistory(history, historyIndex, newDesigns) });
  },

  applyToAllWalls: (design) => {
    const { currentRoom, designs, history, historyIndex } = get();
    const ids = getRoomWallIds(currentRoom);
    const newDesigns = { ...designs };
    ids.forEach((id) => { newDesigns[id] = design; });
    set({ designs: newDesigns, ...pushHistory(history, historyIndex, newDesigns) });
  },

  resetPart: (partId) => {
    const { designs, history, historyIndex } = get();
    const newDesigns = { ...designs };
    delete newDesigns[partId];
    set({ designs: newDesigns, ...pushHistory(history, historyIndex, newDesigns) });
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

  clearAll: () => set({ designs: {}, history: [{}], historyIndex: 0, selectedPartId: null }),
}));

// ── Persistence helpers ──────────────────────────────────────────────────────
const LS_KEY = 'rai-visualizer-designs';

export interface SavedDesign {
  id: string;
  name: string;
  savedAt: number;
  designs: Record<string, PartDesign>;
  viewMode: ViewMode;
  cameraMode?: CameraMode;
  currentRoom: RoomId;
}

export function saveDesignToLocal(name: string): void {
  const { designs, viewMode, cameraMode, currentRoom } = useVisualizerStore.getState();
  const all: SavedDesign[] = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
  all.unshift({
    id: `design-${Date.now()}`,
    name,
    savedAt: Date.now(),
    designs,
    viewMode,
    cameraMode,
    currentRoom,
  });
  localStorage.setItem(LS_KEY, JSON.stringify(all.slice(0, 20)));
}

export function loadSavedDesigns(): SavedDesign[] {
  return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
}

export function deleteSavedDesign(id: string): void {
  const all: SavedDesign[] = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
  localStorage.setItem(LS_KEY, JSON.stringify(all.filter((d) => d.id !== id)));
}

export function loadDesignById(id: string): void {
  const all = loadSavedDesigns();
  const found = all.find((d) => d.id === id);
  if (!found) return;
  useVisualizerStore.setState({
    designs: found.designs,
    viewMode: found.viewMode,
    cameraMode: found.cameraMode ?? 'orbit',
    currentRoom: found.currentRoom,
    selectedPartId: null,
    history: [found.designs],
    historyIndex: 0,
  });
}
