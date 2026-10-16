import * as THREE from 'three';

const normalMapCache = new Map<string, THREE.CanvasTexture>();

/**
 * Generate a procedural normal map on an offscreen canvas
 * @param type 'matte' | 'satin' | 'stucco' | 'sponge' | 'emboss'
 */
export function getProceduralNormalMap(
  type: 'matte' | 'satin' | 'stucco' | 'sponge' | 'emboss'
): THREE.CanvasTexture {
  if (normalMapCache.has(type)) return normalMapCache.get(type)!;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Generate height map first into buffer
  const heightMap = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      let h = 0.5;

      if (type === 'matte') {
        // Fine micro-roller stipple
        h += (Math.random() - 0.5) * 0.12;
      } else if (type === 'satin') {
        // Extremely smooth with faint spray texture
        h += (Math.random() - 0.5) * 0.04;
      } else if (type === 'stucco') {
        // Heavy troweled plaster effect
        const s1 = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 0.25;
        const s2 = Math.sin(x * 0.22 + y * 0.18) * 0.15;
        const noise = (Math.random() - 0.5) * 0.2;
        h += s1 + s2 + noise;
      } else if (type === 'sponge') {
        // Royale sponge texture with circular dabs
        const d1 = Math.sin((x % 32) * 0.2) * Math.sin((y % 32) * 0.2) * 0.3;
        const d2 = (Math.random() - 0.5) * 0.15;
        h += d1 + d2;
      } else if (type === 'emboss') {
        // Subtle raised wallpaper emboss ridges
        const v = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 0.2;
        h += v + (Math.random() - 0.5) * 0.05;
      }

      heightMap[idx] = Math.max(0, Math.min(1, h));
    }
  }

  // Sobel filter to compute normal vector (R, G, B) = (X, Y, Z)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xPrev = (x - 1 + size) % size;
      const xNext = (x + 1) % size;
      const yPrev = (y - 1 + size) % size;
      const yNext = (y + 1) % size;

      const dX =
        (heightMap[y * size + xNext] - heightMap[y * size + xPrev]) * 2.0;
      const dY =
        (heightMap[yNext * size + x] - heightMap[yPrev * size + x]) * 2.0;

      // Normal vector
      const nx = -dX;
      const ny = -dY;
      const nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

      // Map from [-1, 1] to [0, 255]
      const pxIdx = (y * size + x) * 4;
      data[pxIdx] = Math.floor(((nx / len) * 0.5 + 0.5) * 255);
      data[pxIdx + 1] = Math.floor(((ny / len) * 0.5 + 0.5) * 255);
      data[pxIdx + 2] = Math.floor(((nz / len) * 0.5 + 0.5) * 255);
      data[pxIdx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(type === 'stucco' ? 3 : 6, type === 'stucco' ? 3 : 6);

  normalMapCache.set(type, texture);
  return texture;
}
