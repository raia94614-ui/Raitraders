import { describe, it, expect } from 'vitest';
import { defaultSiteContent } from '../content/defaultContent';
import { exportDeploymentPack, importDeploymentPack } from '../storage/zipPack';
import type { StorageAdapter, StoredImageMeta, BackupSnapshot } from '../storage/StorageAdapter';

class MockStorageAdapter implements StorageAdapter {
  private images = new Map<string, { blob: Blob; name: string }>();

  async loadPublished() { return defaultSiteContent; }
  async loadDraft() { return defaultSiteContent; }
  async saveDraft() {}
  async publish() {}
  async hasDraft() { return false; }
  async discardDraft() { return defaultSiteContent; }
  async listBackups(): Promise<BackupSnapshot[]> { return []; }
  async createBackup(): Promise<BackupSnapshot> {
    return { id: '1', timestamp: '', label: '', version: 2, data: defaultSiteContent };
  }
  async restoreBackup() { return defaultSiteContent; }
  async deleteBackup() {}

  async saveImage(file: Blob, customName?: string): Promise<StoredImageMeta> {
    const id = `mock_${Math.random()}`;
    const name = customName || 'test.webp';
    this.images.set(id, { blob: file, name });
    return {
      id,
      name,
      mimeType: file.type || 'image/webp',
      size: file.size,
      url: `blob:mock/${id}`,
      createdAt: new Date().toISOString(),
    };
  }

  async getImageBlob(id: string) {
    return this.images.get(id)?.blob || null;
  }

  async listCustomImages(): Promise<StoredImageMeta[]> {
    const res: StoredImageMeta[] = [];
    for (const [id, val] of this.images.entries()) {
      res.push({
        id,
        name: val.name,
        mimeType: 'image/webp',
        size: val.blob.size,
        url: `blob:mock/${id}`,
        createdAt: new Date().toISOString(),
      });
    }
    return res;
  }

  async deleteImage(id: string) {
    this.images.delete(id);
  }
}

describe('Static Deployment Pack ZIP Workflow', () => {
  it('exports and re-imports a deployment pack successfully', async () => {
    const adapter = new MockStorageAdapter();
    const testBlob = new Blob(['fake image content'], { type: 'image/webp' });
    await adapter.saveImage(testBlob, 'wall_sample.webp');

    const zipBlob = await exportDeploymentPack(defaultSiteContent, adapter);
    expect(zipBlob.size).toBeGreaterThan(100);
    expect(zipBlob.type).toBe('application/zip');

    // Now import
    const newAdapter = new MockStorageAdapter();
    const { content, importedImagesCount } = await importDeploymentPack(zipBlob, newAdapter);

    expect(content.brand.businessName).toBe('RAI TRADERS');
    expect(importedImagesCount).toBe(1);
  });
});
