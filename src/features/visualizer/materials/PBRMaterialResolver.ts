import * as THREE from 'three';
import { getProceduralNormalMap } from './proceduralNormalMaps';
import { WALLPAPER_CATALOG, generateWallpaperTexture } from './proceduralTextures';

export type PaintFinish = 'matte' | 'satin' | 'gloss' | 'texture_stucco' | 'texture_sponge';

export interface SurfaceDesign {
  type: 'color' | 'wallpaper' | 'two_tone' | 'none';
  colorHex?: string;
  finish?: PaintFinish;
  /** Two-tone split second color */
  secondaryColorHex?: string;
  /** Two-tone split height ratio (0.2 to 0.8, default 0.35) */
  splitRatio?: number;
  wallpaperId?: string;
  wallpaperTint?: string;
  wallpaperScale?: number;
  wallpaperRotation?: number;
}

export interface PBRProps {
  color: THREE.Color | string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  map?: THREE.Texture | null;
  normalMap?: THREE.Texture | null;
  normalScale?: [number, number];
  envMapIntensity?: number;
}

const twoToneCache = new Map<string, THREE.CanvasTexture>();

function generateTwoToneTexture(
  topColor: string,
  bottomColor: string,
  splitRatio = 0.35
): THREE.CanvasTexture {
  const key = `${topColor}_${bottomColor}_${splitRatio}`;
  if (twoToneCache.has(key)) return twoToneCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const splitY = Math.floor(512 * (1 - splitRatio));

  // Top wall section
  ctx.fillStyle = topColor;
  ctx.fillRect(0, 0, 512, splitY);

  // Bottom dado section
  ctx.fillStyle = bottomColor;
  ctx.fillRect(0, splitY, 512, 512 - splitY);

  // Decorative border dado moulding line (Gold / shadow line)
  ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
  ctx.fillRect(0, splitY - 4, 512, 4);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, splitY, 512, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  twoToneCache.set(key, texture);
  return texture;
}

/**
 * Resolve PBR material properties based on physical paint finish & wallpaper
 */
export function resolvePBRProps(
  design: SurfaceDesign | undefined,
  defaultColor = '#EAE2D5',
  defaultTexture: THREE.Texture | null = null
): PBRProps {
  if (!design || design.type === 'none') {
    return {
      color: defaultTexture ? '#FFFFFF' : defaultColor,
      roughness: 0.82,
      metalness: 0.0,
      clearcoat: 0.0,
      map: defaultTexture,
      normalMap: getProceduralNormalMap('matte'),
      normalScale: [0.35, 0.35],
      envMapIntensity: 0.6,
    };
  }

  // 1. Two-tone wall (dado split)
  if (design.type === 'two_tone') {
    const top = design.colorHex ?? defaultColor;
    const bottom = design.secondaryColorHex ?? '#1A243B';
    const split = design.splitRatio ?? 0.35;
    const tex = generateTwoToneTexture(top, bottom, split);

    return {
      color: '#FFFFFF',
      roughness: 0.75,
      metalness: 0.02,
      clearcoat: 0.05,
      map: tex,
      normalMap: getProceduralNormalMap('satin'),
      normalScale: [0.3, 0.3],
      envMapIntensity: 0.7,
    };
  }

  // 2. Wallpaper
  if (design.type === 'wallpaper' && design.wallpaperId) {
    const wp = WALLPAPER_CATALOG.find((w) => w.id === design.wallpaperId);
    if (wp) {
      const tex = generateWallpaperTexture(
        wp,
        design.wallpaperTint ?? wp.defaultTint,
        design.wallpaperScale ?? 1.0,
        design.wallpaperRotation ?? 0
      );

      return {
        color: '#FFFFFF',
        roughness: 0.65,
        metalness: wp.category === 'luxury' ? 0.22 : 0.0,
        clearcoat: wp.category === 'luxury' ? 0.35 : 0.05,
        clearcoatRoughness: 0.2,
        map: tex,
        normalMap: getProceduralNormalMap('emboss'),
        normalScale: [0.4, 0.4],
        envMapIntensity: 0.8,
      };
    }
  }

  // 3. Paint Colors with Real Physical Finishes
  const col = design.colorHex ?? defaultColor;
  const finish = design.finish ?? 'matte';

  switch (finish) {
    case 'satin':
      return {
        color: col,
        roughness: 0.38,
        metalness: 0.04,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
        map: null,
        normalMap: getProceduralNormalMap('satin'),
        normalScale: [0.25, 0.25],
        envMapIntensity: 0.85,
      };

    case 'gloss':
      return {
        color: col,
        roughness: 0.16,
        metalness: 0.08,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
        map: null,
        normalMap: getProceduralNormalMap('satin'),
        normalScale: [0.15, 0.15],
        envMapIntensity: 1.1,
      };

    case 'texture_stucco':
      return {
        color: col,
        roughness: 0.88,
        metalness: 0.0,
        clearcoat: 0.0,
        map: null,
        normalMap: getProceduralNormalMap('stucco'),
        normalScale: [0.85, 0.85],
        envMapIntensity: 0.5,
      };

    case 'texture_sponge':
      return {
        color: col,
        roughness: 0.82,
        metalness: 0.02,
        clearcoat: 0.08,
        map: null,
        normalMap: getProceduralNormalMap('sponge'),
        normalScale: [0.75, 0.75],
        envMapIntensity: 0.6,
      };

    case 'matte':
    default:
      return {
        color: col,
        roughness: 0.88,
        metalness: 0.0,
        clearcoat: 0.0,
        map: null,
        normalMap: getProceduralNormalMap('matte'),
        normalScale: [0.35, 0.35],
        envMapIntensity: 0.6,
      };
  }
}
