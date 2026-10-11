import { create } from 'zustand';
import type { SiteContent } from '../content/schema';
import { defaultSiteContent } from '../content/defaultContent';
import { defaultStorageAdapter } from '../storage/indexedDbAdapter';
import { useContentStore } from './contentStore';
import { useUiStore } from './uiStore';

const MAX_UNDO_STEPS = 30;

interface DraftStore {
  draft: SiteContent;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  undoStack: SiteContent[];
  redoStack: SiteContent[];

  initDraft: () => Promise<void>;
  updateDraft: (updater: (prev: SiteContent) => SiteContent) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: () => boolean;
  canRedo: () => boolean;

  publishDraft: () => Promise<void>;
  discardDraft: () => Promise<void>;
  resetToDefault: () => Promise<void>;
  setDraftDirectly: (newContent: SiteContent) => Promise<void>;
}

export const useDraftStore = create<DraftStore>((set, get) => ({
  draft: defaultSiteContent,
  isDirty: false,
  isLoading: false,
  isSaving: false,
  isPublishing: false,
  undoStack: [],
  redoStack: [],

  initDraft: async () => {
    set({ isLoading: true });
    try {
      const draft = await defaultStorageAdapter.loadDraft();
      const hasDraft = await defaultStorageAdapter.hasDraft();
      set({
        draft,
        isDirty: hasDraft,
        isLoading: false,
        undoStack: [],
        redoStack: [],
      });
    } catch (err) {
      console.error('Failed to init draft:', err);
      set({ draft: defaultSiteContent, isLoading: false });
    }
  },

  updateDraft: async (updater) => {
    const current = get().draft;
    const clonedCurrent: SiteContent = JSON.parse(JSON.stringify(current));
    const next = updater(current);

    // Save previous to undo stack
    const nextUndo = [...get().undoStack, clonedCurrent];
    if (nextUndo.length > MAX_UNDO_STEPS) {
      nextUndo.shift();
    }

    set({
      draft: next,
      isDirty: true,
      undoStack: nextUndo,
      redoStack: [], // clearing redo stack on new modification
      isSaving: true,
    });

    try {
      await defaultStorageAdapter.saveDraft(next);
    } catch (err) {
      console.error('Failed to autosave draft:', err);
    } finally {
      set({ isSaving: false });
    }
  },

  undo: async () => {
    const { undoStack, redoStack, draft } = get();
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);
    const newRedo = [...redoStack, JSON.parse(JSON.stringify(draft))];

    set({
      draft: previous,
      undoStack: newUndo,
      redoStack: newRedo,
      isDirty: true,
      isSaving: true,
    });

    await defaultStorageAdapter.saveDraft(previous);
    set({ isSaving: false });
  },

  redo: async () => {
    const { undoStack, redoStack, draft } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);
    const newUndo = [...undoStack, JSON.parse(JSON.stringify(draft))];

    set({
      draft: next,
      undoStack: newUndo,
      redoStack: newRedo,
      isDirty: true,
      isSaving: true,
    });

    await defaultStorageAdapter.saveDraft(next);
    set({ isSaving: false });
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  publishDraft: async () => {
    const draft = get().draft;
    set({ isPublishing: true });
    try {
      await defaultStorageAdapter.publish(draft);
      useContentStore.getState().setContent(draft);
      set({
        isDirty: false,
        isPublishing: false,
        undoStack: [],
        redoStack: [],
      });
      useUiStore.getState().showToast('Website changes published successfully!', 'success');
    } catch (err) {
      set({ isPublishing: false });
      useUiStore.getState().showToast('Failed to publish changes: ' + String(err), 'error');
      throw err;
    }
  },

  discardDraft: async () => {
    set({ isLoading: true });
    try {
      const published = await defaultStorageAdapter.discardDraft();
      set({
        draft: published,
        isDirty: false,
        isLoading: false,
        undoStack: [],
        redoStack: [],
      });
      useUiStore.getState().showToast('Unsaved draft discarded', 'info');
    } catch (err) {
      set({ isLoading: false });
      useUiStore.getState().showToast('Failed to discard draft: ' + String(err), 'error');
    }
  },

  resetToDefault: async () => {
    const cloned: SiteContent = JSON.parse(JSON.stringify(defaultSiteContent));
    await get().updateDraft(() => cloned);
    useUiStore.getState().showToast('Content reset to default authentic template', 'info');
  },

  setDraftDirectly: async (newContent) => {
    set({
      draft: newContent,
      isDirty: true,
      undoStack: [],
      redoStack: [],
    });
    await defaultStorageAdapter.saveDraft(newContent);
  },
}));
