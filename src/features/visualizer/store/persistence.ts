import { get, set } from 'idb-keyval';
import type { SurfaceDesign } from '../materials/PBRMaterialResolver';
import type { RoomId } from './visualizerStore';

export interface VisualizerProject {
  id: string;
  name: string;
  room: RoomId;
  savedAt: number;
  thumbnail?: string; // base64 PNG
  designs: Record<string, SurfaceDesign>;
  areaSqFt: number;
}

export interface VisualizerLead {
  id: string;
  customerName: string;
  customerPhone: string;
  room: RoomId;
  areaSqFt: number;
  approxRate: number;
  estimatedTotal: number;
  submittedAt: number;
  designsSummary: string[];
}

const IDB_PROJECTS_KEY = 'rai_visualizer_projects';
const IDB_LEADS_KEY = 'rai_visualizer_leads';

/** Save project to IndexedDB (with localStorage fallback) */
export async function saveProjectToStorage(
  project: Omit<VisualizerProject, 'id' | 'savedAt'>
): Promise<VisualizerProject> {
  const fullProject: VisualizerProject = {
    ...project,
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    savedAt: Date.now(),
  };

  try {
    const existing = (await get<VisualizerProject[]>(IDB_PROJECTS_KEY)) || [];
    existing.unshift(fullProject);
    await set(IDB_PROJECTS_KEY, existing.slice(0, 30));
  } catch (err) {
    console.warn('IDB write fallback to localStorage:', err);
    const local = JSON.parse(localStorage.getItem(IDB_PROJECTS_KEY) || '[]');
    local.unshift(fullProject);
    localStorage.setItem(IDB_PROJECTS_KEY, JSON.stringify(local.slice(0, 30)));
  }

  return fullProject;
}

/** Load all saved projects */
export async function loadProjectsFromStorage(): Promise<VisualizerProject[]> {
  try {
    const projects = await get<VisualizerProject[]>(IDB_PROJECTS_KEY);
    if (projects && projects.length > 0) return projects;
  } catch (err) {
    console.warn('IDB read fallback to localStorage:', err);
  }

  try {
    const local = localStorage.getItem(IDB_PROJECTS_KEY);
    if (local) return JSON.parse(local);
  } catch {
    // empty
  }

  return getSampleProjects();
}

/** Delete a saved project */
export async function deleteProjectFromStorage(id: string): Promise<void> {
  try {
    const existing = (await get<VisualizerProject[]>(IDB_PROJECTS_KEY)) || [];
    const filtered = existing.filter((p) => p.id !== id);
    await set(IDB_PROJECTS_KEY, filtered);
  } catch {
    const local = JSON.parse(localStorage.getItem(IDB_PROJECTS_KEY) || '[]');
    localStorage.setItem(
      IDB_PROJECTS_KEY,
      JSON.stringify(local.filter((p: VisualizerProject) => p.id !== id))
    );
  }
}

/** Save a customer quote inquiry / lead */
export async function saveVisualizerLead(
  lead: Omit<VisualizerLead, 'id' | 'submittedAt'>
): Promise<VisualizerLead> {
  const fullLead: VisualizerLead = {
    ...lead,
    id: `lead_${Date.now()}`,
    submittedAt: Date.now(),
  };

  try {
    const leads = (await get<VisualizerLead[]>(IDB_LEADS_KEY)) || [];
    leads.unshift(fullLead);
    await set(IDB_LEADS_KEY, leads);
  } catch {
    const local = JSON.parse(localStorage.getItem(IDB_LEADS_KEY) || '[]');
    local.unshift(fullLead);
    localStorage.setItem(IDB_LEADS_KEY, JSON.stringify(local));
  }

  return fullLead;
}

/** Load all leads for Admin panel */
export async function loadVisualizerLeads(): Promise<VisualizerLead[]> {
  try {
    const leads = await get<VisualizerLead[]>(IDB_LEADS_KEY);
    if (leads && leads.length > 0) return leads;
  } catch {
    // fallback
  }

  try {
    const local = localStorage.getItem(IDB_LEADS_KEY);
    if (local) return JSON.parse(local);
  } catch {
    // fallback
  }

  return getSampleLeads();
}

/** Encode designs and room to a shareable URL hash */
export function encodeDesignToUrlHash(
  designs: Record<string, SurfaceDesign>,
  room: RoomId
): string {
  try {
    const payload = { r: room, d: designs };
    const json = JSON.stringify(payload);
    return `#design=${encodeURIComponent(btoa(unescape(encodeURIComponent(json))))}`;
  } catch {
    return '';
  }
}

/** Decode URL hash back into designs */
export function decodeDesignFromUrlHash(
  hash: string
): { room: RoomId; designs: Record<string, SurfaceDesign> } | null {
  try {
    const match = hash.match(/#design=([^&]+)/);
    if (!match) return null;
    const json = decodeURIComponent(escape(atob(decodeURIComponent(match[1]))));
    const parsed = JSON.parse(json);
    if (parsed && parsed.d) {
      return { room: parsed.r || 'living', designs: parsed.d };
    }
  } catch (e) {
    console.warn('Invalid design URL hash:', e);
  }
  return null;
}

/** Sample initial project seed data */
function getSampleProjects(): VisualizerProject[] {
  return [
    {
      id: 'sample_royal_luxe',
      name: 'Royal Heritage Living Room',
      room: 'living',
      savedAt: Date.now() - 86400000,
      areaSqFt: 240,
      designs: {
        'living/accent-wall': {
          type: 'wallpaper',
          wallpaperId: 'royal-damask',
          wallpaperTint: '#D4AF37',
        },
        'living/back-wall': {
          type: 'color',
          colorHex: '#0B1530',
          finish: 'satin',
        },
        'living/left-wall': {
          type: 'color',
          colorHex: '#121E3B',
          finish: 'matte',
        },
        'living/right-wall': {
          type: 'color',
          colorHex: '#121E3B',
          finish: 'matte',
        },
      },
    },
    {
      id: 'sample_scandi_master',
      name: 'Scandinavian Serenity Bedroom',
      room: 'master_bedroom',
      savedAt: Date.now() - 172800000,
      areaSqFt: 210,
      designs: {
        'master_bedroom/accent-wall': {
          type: 'color',
          colorHex: '#8C9A8E',
          finish: 'satin',
        },
        'master_bedroom/back-wall': {
          type: 'color',
          colorHex: '#F6F5F2',
          finish: 'matte',
        },
      },
    },
  ];
}

/** Sample initial leads for Admin demo */
function getSampleLeads(): VisualizerLead[] {
  return [
    {
      id: 'lead_demo_1',
      customerName: 'Anand Sharma',
      customerPhone: '+91 98260 12345',
      room: 'living',
      areaSqFt: 240,
      approxRate: 48,
      estimatedTotal: 11520,
      submittedAt: Date.now() - 1000 * 3600 * 5,
      designsSummary: [
        'Accent Wall: Royal Gold Damask (#D4AF37)',
        'Walls: Midnight Navy (#0B1530, Satin Finish)',
      ],
    },
    {
      id: 'lead_demo_2',
      customerName: 'Priya Malviya',
      customerPhone: '+91 94250 67890',
      room: 'master_bedroom',
      areaSqFt: 210,
      approxRate: 36,
      estimatedTotal: 7560,
      submittedAt: Date.now() - 1000 * 3600 * 22,
      designsSummary: [
        'Accent Wall: Sage Mist (#8C9A8E, Satin Finish)',
        'Walls: Alabaster White (#F6F5F2, Matte Finish)',
      ],
    },
  ];
}
