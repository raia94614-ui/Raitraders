import * as THREE from 'three';
import type { SurfaceDesign } from '../materials/PBRMaterialResolver';
import { generateProceduralWallpaperCanvas } from '../materials/proceduralTextures';

export interface SurfaceMaskEntry {
  id: string;
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  avgLuminance: number;
}

export class RecolorTextureManager {
  private width: number;
  private height: number;
  private recolorCanvas: HTMLCanvasElement;
  private recolorCtx: CanvasRenderingContext2D;
  public recolorTexture: THREE.CanvasTexture;

  private selectionCanvas: HTMLCanvasElement;
  private selectionCtx: CanvasRenderingContext2D;
  public selectionTexture: THREE.CanvasTexture;

  private maskMap: Map<string, SurfaceMaskEntry> = new Map();

  constructor(width = 2048, height = 1024) {
    this.width = width;
    this.height = height;

    // Composite recolor canvas
    this.recolorCanvas = document.createElement('canvas');
    this.recolorCanvas.width = width;
    this.recolorCanvas.height = height;
    this.recolorCtx = this.recolorCanvas.getContext('2d', { willReadFrequently: true })!;

    this.recolorTexture = new THREE.CanvasTexture(this.recolorCanvas);
    this.recolorTexture.generateMipmaps = true;
    this.recolorTexture.minFilter = THREE.LinearMipmapLinearFilter;
    this.recolorTexture.magFilter = THREE.LinearFilter;

    // Selection highlight mask canvas
    this.selectionCanvas = document.createElement('canvas');
    this.selectionCanvas.width = width;
    this.selectionCanvas.height = height;
    this.selectionCtx = this.selectionCanvas.getContext('2d')!;

    this.selectionTexture = new THREE.CanvasTexture(this.selectionCanvas);
    this.selectionTexture.minFilter = THREE.LinearFilter;
    this.selectionTexture.magFilter = THREE.LinearFilter;
  }

  /** Load and register a surface mask */
  public async loadSurfaceMask(
    surfaceId: string,
    maskUrl: string,
    avgLuminance = 0.5
  ): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = this.width;
        c.height = this.height;
        const ctx = c.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, this.width, this.height);

        this.maskMap.set(surfaceId, {
          id: surfaceId,
          image: img,
          canvas: c,
          ctx,
          avgLuminance,
        });
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load mask for surface: ${surfaceId} from ${maskUrl}`);
        resolve();
      };
      img.src = maskUrl;
    });
  }

  /** Detect surface at equirectangular UV coordinates under cursor / tap */
  public detectSurfaceAtUV(u: number, v: number): string | null {
    // Equirectangular UV to pixel
    const x = Math.floor(Math.max(0, Math.min(1, u)) * (this.width - 1));
    const y = Math.floor(Math.max(0, Math.min(1, v)) * (this.height - 1));

    let bestId: string | null = null;
    let maxVal = 100; // Threshold

    for (const [id, entry] of this.maskMap.entries()) {
      try {
        const pixel = entry.ctx.getImageData(x, y, 1, 1).data;
        const val = pixel[0]; // Grayscale R channel
        if (val > maxVal) {
          maxVal = val;
          bestId = id;
        }
      } catch {
        // empty
      }
    }

    return bestId;
  }

  /** Update selection mask texture to show soft gold outline around selected wall */
  public updateSelection(selectedSurfaceId: string | null): void {
    this.selectionCtx.clearRect(0, 0, this.width, this.height);

    if (selectedSurfaceId && this.maskMap.has(selectedSurfaceId)) {
      const entry = this.maskMap.get(selectedSurfaceId)!;
      this.selectionCtx.drawImage(entry.canvas, 0, 0);
    }

    this.selectionTexture.needsUpdate = true;
  }

  /** Re-composite all painted/wallpapered surfaces into the composite recolor texture */
  public updateDesigns(designs: Record<string, SurfaceDesign>): void {
    this.recolorCtx.clearRect(0, 0, this.width, this.height);

    for (const [surfaceId, design] of Object.entries(designs)) {
      const entry = this.maskMap.get(surfaceId);
      if (!entry) continue;

      if (design.type === 'color' && design.colorHex) {
        // Draw solid color clipped by mask
        const tempC = document.createElement('canvas');
        tempC.width = this.width;
        tempC.height = this.height;
        const tempCtx = tempC.getContext('2d')!;

        tempCtx.fillStyle = design.colorHex;
        tempCtx.fillRect(0, 0, this.width, this.height);
        tempCtx.globalCompositeOperation = 'destination-in';
        tempCtx.drawImage(entry.canvas, 0, 0);

        this.recolorCtx.drawImage(tempC, 0, 0);
      } else if (design.type === 'wallpaper' && design.wallpaperId) {
        // Render seamless wallpaper pattern
        const patCanvas = generateProceduralWallpaperCanvas(
          design.wallpaperId,
          design.wallpaperTint || '#D4AF37',
          512,
          512
        );

        const tempC = document.createElement('canvas');
        tempC.width = this.width;
        tempC.height = this.height;
        const tempCtx = tempC.getContext('2d')!;

        const scale = design.wallpaperScale || 1.0;
        const pattern = tempCtx.createPattern(patCanvas, 'repeat');
        if (pattern) {
          tempCtx.save();
          const matrix = new DOMMatrix();
          matrix.scaleSelf(scale * 0.25, scale * 0.25);
          if (design.wallpaperRotation) {
            matrix.rotateSelf(design.wallpaperRotation);
          }
          pattern.setTransform(matrix);
          tempCtx.fillStyle = pattern;
          tempCtx.fillRect(0, 0, this.width, this.height);
          tempCtx.restore();
        }

        // Clip to surface mask
        tempCtx.globalCompositeOperation = 'destination-in';
        tempCtx.drawImage(entry.canvas, 0, 0);

        this.recolorCtx.drawImage(tempC, 0, 0);
      }
    }

    this.recolorTexture.needsUpdate = true;
  }

  public getSurfaceAvgLuminance(surfaceId: string): number {
    return this.maskMap.get(surfaceId)?.avgLuminance || 0.5;
  }

  public clear(): void {
    this.maskMap.clear();
    this.recolorCtx.clearRect(0, 0, this.width, this.height);
    this.recolorTexture.needsUpdate = true;
    this.selectionCtx.clearRect(0, 0, this.width, this.height);
    this.selectionTexture.needsUpdate = true;
  }

  public dispose(): void {
    this.clear();
    this.recolorTexture.dispose();
    this.selectionTexture.dispose();
  }
}
