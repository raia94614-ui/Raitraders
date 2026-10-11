import { openDB, type IDBPDatabase } from 'idb';
import type { SiteContent } from '../content/schema';
import { migrateContent } from '../content/migrations';
import { defaultSiteContent } from '../content/defaultContent';
import type { BackupSnapshot, StorageAdapter, StoredImageMeta } from './StorageAdapter';

const DB_NAME = 'raitraders_db_v2';
const DB_VERSION = 1;
const MAX_BACKUPS = 25;

interface ImageRecord {
  id: string;
  name: string;
  blob: Blob;
  mimeType: string;
  size: number;
  createdAt: string;
}

export class IndexedDbAdapter implements StorageAdapter {
  private dbPromise: Promise<IDBPDatabase> | null = null;
  private objectUrlMap = new Map<string, string>();
  private syncChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.syncChannel = new BroadcastChannel('raitraders_content_sync');
      } catch {
        // BroadcastChannel unsupported or blocked
      }
    }
  }

  private async getDb(): Promise<IDBPDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('content')) {
            db.createObjectStore('content');
          }
          if (!db.objectStoreNames.contains('backups')) {
            db.createObjectStore('backups', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images', { keyPath: 'id' });
          }
        },
      });
    }
    return this.dbPromise;
  }

  async loadPublished(): Promise<SiteContent> {
    try {
      const db = await this.getDb();
      const raw = await db.get('content', 'published');
      if (!raw) {
        // Seed default
        const validated = migrateContent(defaultSiteContent);
        await db.put('content', validated, 'published');
        return validated;
      }
      return migrateContent(raw);
    } catch (err) {
      console.warn('[IndexedDbAdapter] loadPublished fallback to default:', err);
      return migrateContent(defaultSiteContent);
    }
  }

  async loadDraft(): Promise<SiteContent> {
    try {
      const db = await this.getDb();
      const draft = await db.get('content', 'draft');
      if (draft) {
        return migrateContent(draft);
      }
      return this.loadPublished();
    } catch {
      return this.loadPublished();
    }
  }

  async saveDraft(content: SiteContent): Promise<void> {
    const db = await this.getDb();
    await db.put('content', content, 'draft');
  }

  async hasDraft(): Promise<boolean> {
    try {
      const db = await this.getDb();
      const draft = await db.get('content', 'draft');
      return !!draft;
    } catch {
      return false;
    }
  }

  async discardDraft(): Promise<SiteContent> {
    const db = await this.getDb();
    await db.delete('content', 'draft');
    return this.loadPublished();
  }

  async publish(content: SiteContent): Promise<void> {
    const db = await this.getDb();
    const currentPublished = await this.loadPublished();
    
    // Auto-create snapshot of current before publishing
    await this.createBackup(
      `Snapshot before publish (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      currentPublished
    );

    const stampedContent: SiteContent = {
      ...content,
      lastPublished: new Date().toISOString(),
    };

    await db.put('content', stampedContent, 'published');
    await db.delete('content', 'draft');

    // Notify other tabs
    if (this.syncChannel) {
      try {
        this.syncChannel.postMessage({ type: 'CONTENT_UPDATED', timestamp: Date.now() });
      } catch {
        // ignore
      }
    }
  }

  async listBackups(): Promise<BackupSnapshot[]> {
    try {
      const db = await this.getDb();
      const all: BackupSnapshot[] = await db.getAll('backups');
      return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  }

  async createBackup(label: string, content: SiteContent): Promise<BackupSnapshot> {
    const db = await this.getDb();
    const snapshot: BackupSnapshot = {
      id: `backup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      label,
      version: content.schemaVersion || 2,
      data: JSON.parse(JSON.stringify(content)),
    };

    await db.put('backups', snapshot);

    // Prune excess backups
    const all = await this.listBackups();
    if (all.length > MAX_BACKUPS) {
      const toDelete = all.slice(MAX_BACKUPS);
      for (const item of toDelete) {
        await db.delete('backups', item.id);
      }
    }

    return snapshot;
  }

  async restoreBackup(id: string): Promise<SiteContent> {
    const db = await this.getDb();
    const snapshot: BackupSnapshot | undefined = await db.get('backups', id);
    if (!snapshot) {
      throw new Error(`Backup snapshot ${id} not found`);
    }
    const validated = migrateContent(snapshot.data);
    await this.saveDraft(validated);
    return validated;
  }

  async deleteBackup(id: string): Promise<void> {
    const db = await this.getDb();
    await db.delete('backups', id);
  }

  async saveImage(file: Blob, customName?: string): Promise<StoredImageMeta> {
    const db = await this.getDb();
    const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const name = customName || (file instanceof File ? file.name : `image_${id}.webp`);
    const mimeType = file.type || 'image/webp';
    const createdAt = new Date().toISOString();

    const record: ImageRecord = {
      id,
      name,
      blob: file,
      mimeType,
      size: file.size,
      createdAt,
    };

    await db.put('images', record);

    const url = URL.createObjectURL(file);
    this.objectUrlMap.set(id, url);

    return {
      id,
      name,
      mimeType,
      size: file.size,
      url,
      createdAt,
    };
  }

  async getImageBlob(id: string): Promise<Blob | null> {
    try {
      const db = await this.getDb();
      const record: ImageRecord | undefined = await db.get('images', id);
      return record ? record.blob : null;
    } catch {
      return null;
    }
  }

  async listCustomImages(): Promise<StoredImageMeta[]> {
    try {
      const db = await this.getDb();
      const all: ImageRecord[] = await db.getAll('images');
      return all.map((item) => {
        let url = this.objectUrlMap.get(item.id);
        if (!url) {
          url = URL.createObjectURL(item.blob);
          this.objectUrlMap.set(item.id, url);
        }
        return {
          id: item.id,
          name: item.name,
          mimeType: item.mimeType,
          size: item.size,
          url,
          createdAt: item.createdAt,
        };
      });
    } catch {
      return [];
    }
  }

  async deleteImage(id: string): Promise<void> {
    const db = await this.getDb();
    const existingUrl = this.objectUrlMap.get(id);
    if (existingUrl) {
      URL.revokeObjectURL(existingUrl);
      this.objectUrlMap.delete(id);
    }
    await db.delete('images', id);
  }
}

export const defaultStorageAdapter = new IndexedDbAdapter();
