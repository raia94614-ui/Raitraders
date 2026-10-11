import { get, set } from 'idb-keyval';
import { initialSiteContent } from '../data/defaultContent';
import type { SiteContent } from '../types';

const STORAGE_KEY_LOCAL = 'rai_traders_content_v1';
const IDB_KEY_CONTENT = 'rai_traders_idb_content';

/**
 * Load content: tries localStorage first for instant hydration,
 * then checks IndexedDB for larger uploaded items.
 */
export async function loadSavedContent(): Promise<SiteContent> {
  try {
    // 1. Try IndexedDB
    const idbContent = await get<SiteContent>(IDB_KEY_CONTENT);
    if (idbContent && idbContent.brand?.businessName) {
      return idbContent;
    }

    // 2. Fallback to localStorage
    const localRaw = localStorage.getItem(STORAGE_KEY_LOCAL);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (parsed && parsed.brand?.businessName) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Storage read warning, falling back to defaults:', err);
  }

  // 3. Fallback to default bundled content
  return initialSiteContent;
}

/**
 * Persist content to both localStorage and IndexedDB
 */
export async function persistContent(content: SiteContent): Promise<void> {
  const stampedContent: SiteContent = {
    ...content,
    lastUpdated: new Date().toISOString(),
  };

  try {
    // Save to IndexedDB (supports large blobs/images)
    await set(IDB_KEY_CONTENT, stampedContent);
  } catch (err) {
    console.error('Failed to save to IndexedDB:', err);
  }

  try {
    // Also save snapshot to localStorage for synchronous boot
    // If it throws quota error, we keep idb copy
    localStorage.setItem(STORAGE_KEY_LOCAL, JSON.stringify(stampedContent));
  } catch (err) {
    console.warn('LocalStorage quota warning (IndexedDB retains full data):', err);
  }
}

/**
 * Reset content to default initial state
 */
export async function resetContentToDefaults(): Promise<SiteContent> {
  try {
    localStorage.removeItem(STORAGE_KEY_LOCAL);
    await set(IDB_KEY_CONTENT, initialSiteContent);
  } catch (err) {
    console.error('Error resetting content:', err);
  }
  return initialSiteContent;
}

/**
 * Export current content as a downloadable JSON file
 */
export function exportContentAsJson(content: SiteContent): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `rai-traders-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Compress an uploaded user image using an HTML5 Canvas to prevent memory overflow
 */
export function compressImageFile(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (PNG, JPG, WebP, etc.).'));
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(readerEvent.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error reading uploaded file.'));
    reader.readAsDataURL(file);
  });
}
