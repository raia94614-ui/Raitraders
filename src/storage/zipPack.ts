import { zipSync, unzipSync, strToU8, strFromU8, type Zippable } from 'fflate';
import type { SiteContent } from '../content/schema';
import { migrateContent } from '../content/migrations';
import type { StorageAdapter } from './StorageAdapter';

export interface DeploymentManifest {
  name: string;
  version: number;
  exportedAt: string;
  totalImages: number;
  generator: string;
  instructions: string;
}

export async function exportDeploymentPack(
  content: SiteContent,
  adapter: StorageAdapter
): Promise<Blob> {
  const files: Zippable = {};

  // 1. Gather all custom images stored in IndexedDB
  const customImages = await adapter.listCustomImages();
  const urlReplacementMap = new Map<string, string>();
  let imageCounter = 0;

  for (const imgMeta of customImages) {
    const blob = await adapter.getImageBlob(imgMeta.id);
    if (blob) {
      const buffer = new Uint8Array(await blob.arrayBuffer());
      const safeFilename = imgMeta.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const assetPath = `content-assets/${safeFilename}`;
      files[assetPath] = buffer;
      imageCounter++;

      // Map both object URL and ID to relative asset path
      if (imgMeta.url) {
        urlReplacementMap.set(imgMeta.url, assetPath);
      }
      urlReplacementMap.set(imgMeta.id, assetPath);
    }
  }

  // 2. Clone content and replace custom/blob URLs with relative static paths
  let contentString = JSON.stringify(content, null, 2);
  for (const [origUrl, newPath] of urlReplacementMap.entries()) {
    contentString = contentString.replaceAll(origUrl, newPath);
  }

  // Add content.json
  files['content.json'] = strToU8(contentString);

  // 3. Add Deployment Manifest
  const manifest: DeploymentManifest = {
    name: 'RAI TRADERS Static Deployment Pack',
    version: content.schemaVersion || 2,
    exportedAt: new Date().toISOString(),
    totalImages: imageCounter,
    generator: 'Rai Traders Luxury Admin Suite v2',
    instructions:
      'Unzip this folder into your static website hosting root or public folder. The website will automatically read content.json and content-assets/',
  };
  files['manifest.json'] = strToU8(JSON.stringify(manifest, null, 2));

  // 4. Add comprehensive README for owner / hosting
  const readmeContent = `# RAI TRADERS — STATIC DEPLOYMENT PACK
Generated: ${new Date().toLocaleString()}

This deployment package contains all published content, bilingual copy, and custom-uploaded media assets for RAI TRADERS (Zone 1, MP Nagar, Bhopal).

## Contents:
- **content.json**: Complete site copy and configurations (English + Hindi)
- **content-assets/**: All custom gallery, banner, and texture images
- **manifest.json**: Build metadata and image registry

## How to Deploy to Permanent Static Hosting:

### Option A: Direct Static Hosting (Netlify, Vercel, Cloudflare Pages)
1. In your git repository or static site folder, copy the files from this ZIP into your \`public/\` folder.
2. Ensure \`content.json\` and the \`content-assets/\` folder are in \`public/\`.
3. Commit and push to GitHub, or drag-and-drop the build directory to Netlify / Cloudflare Pages.

### Option B: Local Browser Restoration
If you ever switch browsers, computers, or clear your browser cache:
1. Open the RAI TRADERS Admin Panel (\`/#/admin\`).
2. Go to **Import / Export Pack**.
3. Select this \`.zip\` file to instantly restore all pages, translations, and uploaded images!
`;
  files['README_DEPLOYMENT.md'] = strToU8(readmeContent);

  // 5. Compress using fflate
  const zippedData = zipSync(files, { level: 6 });
  return new Blob([zippedData as Uint8Array<ArrayBuffer>], { type: 'application/zip' });
}

export async function importDeploymentPack(
  zipFile: File | Blob,
  adapter: StorageAdapter
): Promise<{ content: SiteContent; importedImagesCount: number }> {
  const buffer = new Uint8Array(await zipFile.arrayBuffer());
  const unzipped = unzipSync(buffer);

  // Find content.json
  const contentKey = Object.keys(unzipped).find(
    (k) => k === 'content.json' || k.endsWith('/content.json')
  );

  if (!contentKey || !unzipped[contentKey]) {
    throw new Error('Invalid Deployment Pack: missing content.json in ZIP archive.');
  }

  const contentRawStr = strFromU8(unzipped[contentKey]);
  let rawJson: unknown;
  try {
    rawJson = JSON.parse(contentRawStr);
  } catch (e) {
    throw new Error('Failed to parse content.json: ' + String(e));
  }

  // Validate and migrate
  let migrated = migrateContent(rawJson);

  // Extract all assets under content-assets/
  let importedCount = 0;
  const assetReplacements = new Map<string, string>();

  for (const [path, u8Arr] of Object.entries(unzipped)) {
    if (path.includes('content-assets/') && u8Arr.length > 0) {
      const filename = path.split('/').pop() || 'asset.webp';
      const ext = filename.split('.').pop()?.toLowerCase() || 'webp';
      const mime =
        ext === 'png'
          ? 'image/png'
          : ext === 'jpg' || ext === 'jpeg'
          ? 'image/jpeg'
          : ext === 'svg'
          ? 'image/svg+xml'
          : 'image/webp';

      const blob = new Blob([u8Arr as Uint8Array<ArrayBuffer>], { type: mime });
      const saved = await adapter.saveImage(blob, filename);
      importedCount++;

      // Store replacement mapping: relative path -> new object URL
      assetReplacements.set(path, saved.url);
      assetReplacements.set(`content-assets/${filename}`, saved.url);
      assetReplacements.set(filename, saved.url);
    }
  }

  // If there are relative asset links in content, update them to new blob URLs
  if (assetReplacements.size > 0) {
    let contentStr = JSON.stringify(migrated);
    for (const [oldRef, newUrl] of assetReplacements.entries()) {
      contentStr = contentStr.replaceAll(oldRef, newUrl);
    }
    migrated = migrateContent(JSON.parse(contentStr));
  }

  return { content: migrated, importedImagesCount: importedCount };
}
