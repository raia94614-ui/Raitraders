import { create } from 'zustand';

export type Language = 'en' | 'hi';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface LightboxState {
  isOpen: boolean;
  activeIndex: number;
  items: Array<{
    id: string;
    image: string;
    title: { en: string; hi: string };
    caption?: { en: string; hi: string };
    category?: string;
    isSampleImage?: boolean;
  }>;
}

interface UiStore {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  lightbox: LightboxState;
  openLightbox: (items: LightboxState['items'], initialIndex?: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;

  isQuoteModalOpen: boolean;
  openQuoteModal: (initialService?: string) => void;
  closeQuoteModal: () => void;
  selectedQuoteService: string;

  prefersReducedMotion: boolean;
}

const STORAGE_KEY_LANG = 'raitraders_pref_lang';

const getInitialLang = (): Language => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_LANG, 'en');
  }
  return 'en';
};

export const useUiStore = create<UiStore>((set, get) => ({
  currentLang: getInitialLang(),
  setLanguage: (lang) => {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    set({ currentLang: lang });
  },
  toggleLanguage: () => {
    const next = get().currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem(STORAGE_KEY_LANG, next);
    set({ currentLang: next });
  },

  toasts: [],
  showToast: (message, type = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  lightbox: {
    isOpen: false,
    activeIndex: 0,
    items: [],
  },
  openLightbox: (items, initialIndex = 0) => {
    set({
      lightbox: {
        isOpen: true,
        activeIndex: initialIndex,
        items,
      },
    });
  },
  closeLightbox: () => {
    set((state) => ({
      lightbox: { ...state.lightbox, isOpen: false },
    }));
  },
  setLightboxIndex: (index) => {
    set((state) => ({
      lightbox: { ...state.lightbox, activeIndex: index },
    }));
  },

  isQuoteModalOpen: false,
  selectedQuoteService: '',
  openQuoteModal: (initialService = '') => {
    set({ isQuoteModalOpen: true, selectedQuoteService: initialService });
  },
  closeQuoteModal: () => {
    set({ isQuoteModalOpen: false, selectedQuoteService: '' });
  },

  prefersReducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
}));
