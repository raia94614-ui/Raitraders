import * as THREE from 'three';

/** Cached procedural textures so they are created once and shared */
const textureCache = new Map<string, THREE.CanvasTexture>();

/** Create vertical slatted timber batten texture (as seen in luxury architectural villas) */
export function getSlattedWoodTexture(
  woodHex = '#704828',
  grooveHex = '#181008',
  slatWidth = 16
): THREE.CanvasTexture {
  const key = `slats_${woodHex}_${grooveHex}_${slatWidth}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Background grooves
  ctx.fillStyle = grooveHex;
  ctx.fillRect(0, 0, 512, 512);

  // Parse wood hex to RGB
  const r = parseInt(woodHex.slice(1, 3), 16) || 112;
  const g = parseInt(woodHex.slice(3, 5), 16) || 72;
  const b = parseInt(woodHex.slice(5, 7), 16) || 40;

  for (let x = 0; x < 512; x += slatWidth) {
    const sw = slatWidth - 3; // 3px groove
    // Base slat
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, 0, sw, 512);

    // Subtle wood grain streaks
    for (let i = 0; i < 4; i++) {
      const gx = x + (i / 4) * sw;
      const grainVar = (Math.random() - 0.5) * 16;
      ctx.fillStyle = `rgba(${Math.min(255, Math.max(0, r + grainVar))},${Math.min(255, Math.max(0, g + grainVar))},${Math.min(255, Math.max(0, b + grainVar))},0.35)`;
      ctx.fillRect(gx, 0, 2, 512);
    }

    // Left highlight edge
    ctx.fillStyle = 'rgba(255, 230, 180, 0.18)';
    ctx.fillRect(x, 0, 1.5, 512);

    // Right shadow edge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x + sw - 1.5, 0, 1.5, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(key, texture);
  return texture;
}

/** Create horizontal wood decking planks texture */
export function getDeckPlanksTexture(): THREE.CanvasTexture {
  const key = 'deck_planks';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1C140C'; // groove
  ctx.fillRect(0, 0, 512, 512);

  const plankHeight = 28;
  for (let y = 0; y < 512; y += plankHeight) {
    const ph = plankHeight - 3;
    const tone = Math.floor(Math.random() * 15) - 7;
    ctx.fillStyle = `rgb(${58 + tone}, ${40 + tone}, ${26 + tone})`;
    ctx.fillRect(0, y, 512, ph);

    // Wood streaks
    for (let x = 0; x < 512; x += 15) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.12})`;
      ctx.fillRect(x, y, Math.random() * 80 + 20, ph);
    }

    // Top highlight
    ctx.fillStyle = 'rgba(255, 220, 160, 0.12)';
    ctx.fillRect(0, y, 512, 1);

    // Bottom shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, y + ph - 1.5, 512, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  textureCache.set(key, texture);
  return texture;
}

/** Architectural stepping stones on lawn */
export function getSteppingStoneTexture(): THREE.CanvasTexture {
  const key = 'stepping_stones';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#686B70';
  ctx.fillRect(0, 0, 256, 256);

  // Stippled stone noise
  for (let i = 0; i < 4000; i++) {
    const v = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${v},${v},${v},${Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/** Lush manicured grass procedural texture */
export function getLawnTexture(isDark = false): THREE.CanvasTexture {
  const key = `lawn_${isDark}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const baseGreen = isDark ? [18, 38, 20] : [42, 85, 38];
  ctx.fillStyle = `rgb(${baseGreen[0]}, ${baseGreen[1]}, ${baseGreen[2]})`;
  ctx.fillRect(0, 0, 512, 512);

  // Micro grass blades texture
  for (let i = 0; i < 15000; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const gVal = isDark
      ? Math.floor(Math.random() * 25) + 25
      : Math.floor(Math.random() * 45) + 70;
    ctx.fillStyle = `rgba(${Math.floor(gVal * 0.45)}, ${gVal}, ${Math.floor(gVal * 0.35)}, 0.3)`;
    ctx.fillRect(rx, ry, 1.5, Math.random() * 5 + 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache.set(key, texture);
  return texture;
}

/** European Oak / Walnut hardwood flooring procedural texture */
export function getHardwoodFloorTexture(isDark = false): THREE.CanvasTexture {
  const key = `hardwood_${isDark}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const base = isDark ? [44, 32, 22] : [138, 108, 76];
  ctx.fillStyle = `rgb(${base[0]}, ${base[1]}, ${base[2]})`;
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 32;
  for (let y = 0; y < 512; y += plankH) {
    const plankW = 128;
    const offset = ((y / plankH) % 2) * 64;
    for (let x = -64; x < 512 + 64; x += plankW) {
      const px = x + offset;
      const v = Math.floor(Math.random() * 18) - 9;
      ctx.fillStyle = `rgb(${Math.max(0, base[0] + v)}, ${Math.max(0, base[1] + v)}, ${Math.max(0, base[2] + v)})`;
      ctx.fillRect(px + 1, y + 1, plankW - 2, plankH - 2);

      // Fine wood grain streaks
      for (let g = 0; g < 4; g++) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(px + 1, y + 4 + g * 6, plankW - 2, 1);
      }

      // Plank top highlight
      ctx.fillStyle = 'rgba(255, 240, 215, 0.1)';
      ctx.fillRect(px + 1, y + 1, plankW - 2, 1);
    }
    // Shadow bevel between plank rows
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, y, 512, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set(key, texture);
  return texture;
}

/** Luxury Calacatta / Statuario White Marble procedural texture */
export function getMarbleTexture(): THREE.CanvasTexture {
  const key = 'marble_calacatta';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F6F6F4';
  ctx.fillRect(0, 0, 512, 512);

  // Soft misty clouding
  for (let i = 0; i < 28; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const rad = Math.random() * 90 + 30;
    const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rad);
    grad.addColorStop(0, 'rgba(215, 210, 200, 0.22)');
    grad.addColorStop(1, 'rgba(246, 246, 244, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grey branching marble veins
  ctx.strokeStyle = 'rgba(125, 120, 115, 0.28)';
  ctx.lineWidth = 1.8;
  for (let v = 0; v < 4; v++) {
    ctx.beginPath();
    let cx = Math.random() * 512;
    let cy = 0;
    ctx.moveTo(cx, cy);
    while (cy < 512) {
      cx += (Math.random() - 0.48) * 36;
      cy += Math.random() * 32 + 12;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Gold accent veins
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
  ctx.lineWidth = 1.2;
  for (let v = 0; v < 3; v++) {
    ctx.beginPath();
    let cx = Math.random() * 512;
    let cy = 0;
    ctx.moveTo(cx, cy);
    while (cy < 512) {
      cx += (Math.random() - 0.48) * 32;
      cy += Math.random() * 36 + 14;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  textureCache.set(key, texture);
  return texture;
}

/** Acoustic fluted / slatted interior wall texture */
export function getAcousticWoodWallTexture(): THREE.CanvasTexture {
  return getSlattedWoodTexture('#8C5E37', '#1E1208', 12);
}

