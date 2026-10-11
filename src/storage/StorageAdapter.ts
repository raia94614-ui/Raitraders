import type { SiteContent } from '../content/schema';

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  label: string;
  version: number;
  data: SiteContent;
}

export interface StoredImageMeta {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface StorageAdapter {
  loadPublished(): Promise<SiteContent>;
  loadDraft(): Promise<SiteContent>;
  saveDraft(content: SiteContent): Promise<void>;
  publish(content: SiteContent): Promise<void>;
  hasDraft(): Promise<boolean>;
  discardDraft(): Promise<SiteContent>;

  listBackups(): Promise<BackupSnapshot[]>;
  createBackup(label: string, content: SiteContent): Promise<BackupSnapshot>;
  restoreBackup(id: string): Promise<SiteContent>;
  deleteBackup(id: string): Promise<void>;

  saveImage(file: Blob, customName?: string): Promise<StoredImageMeta>;
  getImageBlob(id: string): Promise<Blob | null>;
  listCustomImages(): Promise<StoredImageMeta[]>;
  deleteImage(id: string): Promise<void>;
}
