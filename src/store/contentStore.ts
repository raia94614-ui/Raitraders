import { create } from 'zustand';
import type { BilingualText, SiteContent } from '../content/schema';
import { defaultSiteContent } from '../content/defaultContent';
import { defaultStorageAdapter } from '../storage/indexedDbAdapter';
import { useUiStore } from './uiStore';

interface ContentStore {
  content: SiteContent;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initContent: () => Promise<void>;
  setContent: (content: SiteContent) => void;
  reloadFromStorage: () => Promise<void>;
  t: (text: BilingualText | undefined | null) => string;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  content: defaultSiteContent,
  isInitialized: false,
  isLoading: false,
  error: null,

  initContent: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const published = await defaultStorageAdapter.loadPublished();
      set({ content: published, isInitialized: true, isLoading: false, error: null });

      // Listen for broadcasts from admin tab
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('raitraders_content_sync');
          channel.onmessage = async (event) => {
            if (event.data?.type === 'CONTENT_UPDATED') {
              const fresh = await defaultStorageAdapter.loadPublished();
              set({ content: fresh });
            }
          };
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to init content store:', err);
      set({ content: defaultSiteContent, isInitialized: true, isLoading: false, error: String(err) });
    }
  },

  setContent: (content) => {
    set({ content });
  },

  reloadFromStorage: async () => {
    set({ isLoading: true });
    try {
      const published = await defaultStorageAdapter.loadPublished();
      set({ content: published, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: String(err) });
    }
  },

  t: (text) => {
    if (!text) return '';
    const lang = useUiStore.getState().currentLang;
    if (lang === 'en') return text.en || text.hi || '';
    return text[lang] || text.en || text.hi || '';
  },
}));

// Quick hook for bilingual text translation
export function useTranslation() {
  const currentLang = useUiStore((s) => s.currentLang);
  const setLanguage = useUiStore((s) => s.setLanguage);
  const toggleLanguage = useUiStore((s) => s.toggleLanguage);

  const t = (text: BilingualText | undefined | null): string => {
    if (!text) return '';
    if (currentLang === 'en') return text.en || text.hi || '';
    return text[currentLang] || text.en || text.hi || '';
  };

  return { t, currentLang, setLanguage, toggleLanguage };
}
