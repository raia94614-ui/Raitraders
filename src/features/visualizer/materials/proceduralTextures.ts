import * as THREE from 'three';

export interface WallpaperDefinition {
  id: string;
  name: string;
  nameHi: string;
  category:
    | 'luxury'
    | 'geometric'
    | 'floral'
    | 'texture'
    | 'scandinavian'
    | 'kids';
  defaultTint: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    tint: string,
    scale: number,
    rotation: number
  ) => void;
}

const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * 30+ Procedurally Generated Seamless Wallpaper Patterns
 */
export const WALLPAPER_CATALOG: WallpaperDefinition[] = [
  // ── 1. Luxury Gold & Royal ──
  {
    id: 'royal-damask',
    name: 'Royal Gold Damask',
    nameHi: 'शाही गोल्ड दमास्क',
    category: 'luxury',
    defaultTint: '#D4AF37',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#0F1626';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.fillStyle = tint;
      ctx.lineWidth = 2.5 * scale;

      const step = 128 * scale;
      for (let y = 0; y < 512 + step; y += step) {
        for (let x = 0; x < 512 + step; x += step) {
          ctx.save();
          ctx.translate(x, y);

          // Damask central medallion
          ctx.beginPath();
          ctx.ellipse(0, 0, 24 * scale, 38 * scale, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Acanthus leaf flourishes
          ctx.beginPath();
          ctx.moveTo(0, -38 * scale);
          ctx.bezierCurveTo(24 * scale, -24 * scale, 34 * scale, 0, 0, 38 * scale);
          ctx.bezierCurveTo(-34 * scale, 0, -24 * scale, -24 * scale, 0, -38 * scale);
          ctx.stroke();

          // Gold center jewel
          ctx.beginPath();
          ctx.arc(0, 0, 8 * scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }
    },
  },
  {
    id: 'gold-vein-marble',
    name: 'Imperial Gold Vein',
    nameHi: 'इंपीरियल गोल्ड वेन',
    category: 'luxury',
    defaultTint: '#D4AF37',
    draw: (ctx, tint) => {
      ctx.fillStyle = '#141822';
      ctx.fillRect(0, 0, 512, 512);

      // Gold shimmer veins
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = tint;
      ctx.shadowBlur = 8;

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        let cx = (i * 90) % 512;
        let cy = 0;
        ctx.moveTo(cx, cy);
        while (cy < 512) {
          cx += (Math.sin(cy * 0.05 + i) * 25);
          cy += 20;
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    },
  },
  {
    id: 'lotus-mandala',
    name: 'Royal Lotus Mandala',
    nameHi: 'शाही कमल मंडला',
    category: 'luxury',
    defaultTint: '#E5C158',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#161B2E';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2 * scale;

      const cx = 256;
      const cy = 256;
      const petals = 12;
      for (let r = 30 * scale; r <= 180 * scale; r += 30 * scale) {
        for (let p = 0; p < petals; p++) {
          const ang = (p * Math.PI * 2) / petals;
          ctx.beginPath();
          ctx.arc(
            cx + Math.cos(ang) * r,
            cy + Math.sin(ang) * r,
            14 * scale,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }
    },
  },
  {
    id: 'mughal-jali',
    name: 'Mughal Architectural Jali',
    nameHi: 'मुगल आर्किटेक्चरल जाली',
    category: 'luxury',
    defaultTint: '#C9A048',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#0D111A';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2.2 * scale;

      const s = 64 * scale;
      for (let y = 0; y < 512 + s; y += s) {
        for (let x = 0; x < 512 + s; x += s) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.strokeRect(-s * 0.35, -s * 0.35, s * 0.7, s * 0.7);
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
    },
  },
  {
    id: 'baroque-scroll',
    name: 'Venetian Baroque Scroll',
    nameHi: 'वेनेटियन बारोक स्क्रॉल',
    category: 'luxury',
    defaultTint: '#DFC168',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#111520';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2.8 * scale;

      for (let y = 30; y < 512; y += 96 * scale) {
        for (let x = 30; x < 512; x += 96 * scale) {
          ctx.beginPath();
          ctx.arc(x, y, 22 * scale, 0, Math.PI * 1.5);
          ctx.bezierCurveTo(x + 20, y + 30, x - 20, y + 40, x, y + 20);
          ctx.stroke();
        }
      }
    },
  },

  // ── 2. Geometric ──
  {
    id: 'chevron-luxe',
    name: 'Chevron Gold Zig-Zag',
    nameHi: 'शेवरॉन ज़िग-ज़ैग',
    category: 'geometric',
    defaultTint: '#D4AF37',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#1A2130';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 3 * scale;

      const stepY = 48 * scale;
      const stepX = 64 * scale;
      for (let y = 0; y < 512 + stepY; y += stepY) {
        ctx.beginPath();
        for (let x = 0; x <= 512 + stepX; x += stepX * 2) {
          ctx.lineTo(x, y);
          ctx.lineTo(x + stepX, y + stepY * 0.5);
        }
        ctx.stroke();
      }
    },
  },
  {
    id: 'moroccan-trellis',
    name: 'Moroccan Trellis',
    nameHi: 'मोरक्कन ट्रेलिस',
    category: 'geometric',
    defaultTint: '#B89742',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#F8F6F2';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 3.5 * scale;

      const s = 80 * scale;
      for (let y = -s; y < 512 + s; y += s) {
        for (let x = -s; x < 512 + s; x += s) {
          ctx.beginPath();
          ctx.moveTo(x + s * 0.5, y);
          ctx.bezierCurveTo(x + s, y + s * 0.2, x + s, y + s * 0.8, x + s * 0.5, y + s);
          ctx.bezierCurveTo(x, y + s * 0.8, x, y + s * 0.2, x + s * 0.5, y);
          ctx.stroke();
        }
      }
    },
  },
  {
    id: 'art-deco-arch',
    name: 'Art Deco Archways',
    nameHi: 'आर्ट डेको आर्च',
    category: 'geometric',
    defaultTint: '#D4AF37',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#0E1726';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2 * scale;

      const s = 64 * scale;
      for (let y = 0; y < 512 + s; y += s) {
        for (let x = 0; x < 512 + s; x += s) {
          for (let r = 8; r <= s * 0.5; r += 10 * scale) {
            ctx.beginPath();
            ctx.arc(x + s * 0.5, y + s, r, Math.PI, 0);
            ctx.stroke();
          }
        }
      }
    },
  },
  {
    id: 'hexagon-honeycomb',
    name: 'Honeycomb Hex Grid',
    nameHi: 'हनीकॉम्ब हेक्सागन',
    category: 'geometric',
    defaultTint: '#D4AF37',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#131A29';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2.2 * scale;

      const r = 32 * scale;
      const h = r * Math.sqrt(3);
      for (let y = -h; y < 512 + h; y += h) {
        const row = Math.round(y / h);
        const offsetX = (row % 2) * (r * 1.5);
        for (let x = -r * 3; x < 512 + r * 3; x += r * 3) {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = (i * Math.PI) / 3;
            const px = x + offsetX + Math.cos(ang) * r;
            const py = y + Math.sin(ang) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    },
  },
  {
    id: 'diamond-quilt',
    name: 'Diamond Tufted Lattice',
    nameHi: 'डायमंड टफ्टेड जाली',
    category: 'geometric',
    defaultTint: '#A88E3E',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#1D2433';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2 * scale;

      const d = 50 * scale;
      for (let i = -512; i < 1024; i += d) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 512, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 512);
        ctx.lineTo(i + 512, 0);
        ctx.stroke();
      }
    },
  },

  // ── 3. Botanical & Floral ──
  {
    id: 'tropical-palm',
    name: 'Tropical Royal Palm',
    nameHi: 'ट्रॉपिकल रॉयल पाम',
    category: 'floral',
    defaultTint: '#2C5A38',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#F4EFE6';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.fillStyle = tint;
      ctx.lineWidth = 2 * scale;

      for (let y = 50; y < 512; y += 140 * scale) {
        for (let x = 50; x < 512; x += 140 * scale) {
          ctx.save();
          ctx.translate(x, y);
          for (let l = -4; l <= 4; l++) {
            ctx.beginPath();
            ctx.ellipse(l * 8 * scale, -25 * scale, 5 * scale, 32 * scale, (l * 12 * Math.PI) / 180, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    },
  },
  {
    id: 'japanese-sakura',
    name: 'Kyoto Cherry Blossom',
    nameHi: 'क्योतो चेरी ब्लॉसम',
    category: 'floral',
    defaultTint: '#D47E88',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#FBF8F5';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = tint;

      for (let y = 30; y < 512; y += 90 * scale) {
        for (let x = 30; x < 512; x += 90 * scale) {
          ctx.save();
          ctx.translate(x + (y % 2) * 20, y);
          for (let p = 0; p < 5; p++) {
            const ang = (p * Math.PI * 2) / 5;
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * 12 * scale, Math.sin(ang) * 12 * scale, 7 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.arc(0, 0, 4 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = tint;
          ctx.restore();
        }
      }
    },
  },
  {
    id: 'banana-leaves',
    name: 'Emerald Banana Canopy',
    nameHi: 'एमराल्ड बनाना लीव्स',
    category: 'floral',
    defaultTint: '#1D452B',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#0D1A12';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 3 * scale;

      for (let y = 0; y < 512; y += 120 * scale) {
        for (let x = 0; x < 512; x += 120 * scale) {
          ctx.beginPath();
          ctx.ellipse(x, y, 22 * scale, 60 * scale, Math.PI / 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    },
  },
  {
    id: 'english-rose',
    name: 'Vintage English Rose',
    nameHi: 'विंटेज इंग्लिश रोज़',
    category: 'floral',
    defaultTint: '#C97D7D',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#F5ECE8';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2.5 * scale;

      for (let y = 40; y < 512; y += 110 * scale) {
        for (let x = 40; x < 512; x += 110 * scale) {
          for (let r = 8 * scale; r <= 28 * scale; r += 7 * scale) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 1.8);
            ctx.stroke();
          }
        }
      }
    },
  },

  // ── 4. Architectural Textures & Stripes ──
  {
    id: 'fluted-timber',
    name: 'Acoustic Fluted Wood Slats',
    nameHi: 'अकूस्टिक फ़्लूटेड वुड स्लेट्स',
    category: 'texture',
    defaultTint: '#7A4D29',
    draw: (ctx, tint) => {
      ctx.fillStyle = '#1A0E06';
      ctx.fillRect(0, 0, 512, 512);

      const slatW = 16;
      for (let x = 0; x < 512; x += slatW) {
        ctx.fillStyle = tint;
        ctx.fillRect(x + 2, 0, slatW - 4, 512);
        // Highlight edge
        ctx.fillStyle = 'rgba(255, 230, 180, 0.25)';
        ctx.fillRect(x + 2, 0, 2, 512);
        // Shadow edge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x + slatW - 3, 0, 2, 512);
      }
    },
  },
  {
    id: 'venetian-stucco',
    name: 'Venetian Lime Stucco',
    nameHi: 'वेनेटियन लाइम स्टुको',
    category: 'texture',
    defaultTint: '#D4C7B2',
    draw: (ctx, tint) => {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 12 + 4, Math.random() * 6 + 2);
      }
    },
  },
  {
    id: 'raw-linen-weave',
    name: 'Natural Belgian Linen Weave',
    nameHi: 'बेल्जियन लिनेन वीव',
    category: 'texture',
    defaultTint: '#DDD4C4',
    draw: (ctx, tint) => {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 512; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
    },
  },
  {
    id: 'classic-pinstripe',
    name: 'Tailored Gold Pinstripes',
    nameHi: 'गोल्ड पिनस्ट्राइप्स',
    category: 'texture',
    defaultTint: '#D4AF37',
    draw: (ctx, tint) => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = tint;
      for (let x = 0; x < 512; x += 32) {
        ctx.fillRect(x, 0, 2.5, 512);
      }
    },
  },
  {
    id: 'brutalist-concrete',
    name: 'Board-Formed Architectural Concrete',
    nameHi: 'आर्किटेक्चरल कंक्रीट',
    category: 'texture',
    defaultTint: '#8A8E94',
    draw: (ctx, tint) => {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, 512, 512);
      // Horizontal form board seams
      for (let y = 0; y < 512; y += 64) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, y, 512, 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, y + 2, 512, 1);
        // Tie-rod holes
        for (let x = 40; x < 512; x += 120) {
          ctx.beginPath();
          ctx.arc(x, y + 32, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fill();
        }
      }
    },
  },

  // ── 5. Scandinavian & Natural ──
  {
    id: 'terrazzo-luxe',
    name: 'Milano Marble Terrazzo',
    nameHi: 'मिलानो मार्बल टेराज़ो',
    category: 'scandinavian',
    defaultTint: '#E8E2D6',
    draw: (ctx, tint) => {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, 512, 512);
      const fleckColors = ['#D4AF37', '#2A364F', '#8C4D35', '#4A6B53', '#888'];
      for (let i = 0; i < 450; i++) {
        ctx.fillStyle = fleckColors[i % fleckColors.length];
        ctx.beginPath();
        const rx = Math.random() * 512;
        const ry = Math.random() * 512;
        const s = Math.random() * 10 + 3;
        ctx.arc(rx, ry, s, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  {
    id: 'boho-arches',
    name: 'Minimalist Sunset Arches',
    nameHi: 'मिनिमलिस्ट सनसेट आर्च',
    category: 'scandinavian',
    defaultTint: '#C98A6A',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#FAF6F0';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = tint;

      const s = 120 * scale;
      for (let y = 0; y < 512 + s; y += s) {
        for (let x = 0; x < 512 + s; x += s) {
          ctx.beginPath();
          ctx.arc(x + s * 0.5, y + s, s * 0.4, Math.PI, 0);
          ctx.fill();
        }
      }
    },
  },
  {
    id: 'japanese-waves',
    name: 'Traditional Seigaiha Waves',
    nameHi: 'सीगाईहा वेव्स',
    category: 'scandinavian',
    defaultTint: '#2B425B',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#F4EDE2';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2 * scale;

      const s = 60 * scale;
      for (let y = 0; y < 512 + s; y += s * 0.5) {
        const row = Math.round(y / (s * 0.5));
        const offsetX = (row % 2) * (s * 0.5);
        for (let x = -s; x < 512 + s; x += s) {
          for (let r = 10 * scale; r <= s * 0.5; r += 8 * scale) {
            ctx.beginPath();
            ctx.arc(x + offsetX, y, r, Math.PI, 0);
            ctx.stroke();
          }
        }
      }
    },
  },
  {
    id: 'minimal-grid',
    name: 'Tokyo Fine Grid',
    nameHi: 'टोक्यो फाइन ग्रिड',
    category: 'scandinavian',
    defaultTint: '#A0988A',
    draw: (ctx, tint) => {
      ctx.fillStyle = '#FAF9F6';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = tint;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
    },
  },

  // ── 6. Kids Room ──
  {
    id: 'stars-galaxy',
    name: 'Starlight Dreamer',
    nameHi: 'स्टारलाइट ड्रीमर',
    category: 'kids',
    defaultTint: '#E8C547',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#171E36';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = tint;

      for (let i = 0; i < 40; i++) {
        const x = (i * 97) % 512;
        const y = (i * 131) % 512;
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          const a1 = (s * Math.PI * 2) / 5 - Math.PI / 2;
          const a2 = a1 + Math.PI / 5;
          ctx.lineTo(Math.cos(a1) * 12 * scale, Math.sin(a1) * 12 * scale);
          ctx.lineTo(Math.cos(a2) * 5 * scale, Math.sin(a2) * 5 * scale);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    },
  },
  {
    id: 'clouds-pastel',
    name: 'Fluffy Pastel Clouds',
    nameHi: 'सॉफ्ट पेस्टल क्लाउड्स',
    category: 'kids',
    defaultTint: '#B8D5E5',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = tint;

      for (let y = 40; y < 512; y += 120 * scale) {
        for (let x = 40; x < 512; x += 120 * scale) {
          ctx.beginPath();
          ctx.arc(x, y, 16 * scale, 0, Math.PI * 2);
          ctx.arc(x + 18 * scale, y, 22 * scale, 0, Math.PI * 2);
          ctx.arc(x + 36 * scale, y, 16 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },
  {
    id: 'pastel-rainbows',
    name: 'Nordic Mini Rainbows',
    nameHi: 'नॉर्डिक मिनी रेनबो',
    category: 'kids',
    defaultTint: '#E8A598',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#FBF9F5';
      ctx.fillRect(0, 0, 512, 512);
      ctx.lineWidth = 4 * scale;

      const colors = [tint, '#E5C478', '#99C7B2'];
      for (let y = 50; y < 512; y += 110 * scale) {
        for (let x = 50; x < 512; x += 110 * scale) {
          colors.forEach((col, idx) => {
            ctx.strokeStyle = col;
            ctx.beginPath();
            ctx.arc(x, y, (18 - idx * 5) * scale, Math.PI, 0);
            ctx.stroke();
          });
        }
      }
    },
  },
  {
    id: 'polka-confetti',
    name: 'Playful Polka Dots',
    nameHi: 'प्लेफुल पोल्का डॉट्स',
    category: 'kids',
    defaultTint: '#E07A5F',
    draw: (ctx, tint, scale) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 512, 512);
      const dots = [tint, '#F4A261', '#2A9D8F', '#E76F51', '#E9C46A'];
      for (let y = 30; y < 512; y += 60 * scale) {
        for (let x = 30; x < 512; x += 60 * scale) {
          ctx.fillStyle = dots[Math.floor(Math.random() * dots.length)];
          ctx.beginPath();
          ctx.arc(x + (y % 2) * 15, y, 8 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },
];

/**
 * Generate a high-resolution CanvasTexture from wallpaper definition
 */
export function generateWallpaperTexture(
  wp: WallpaperDefinition,
  tint: string,
  scale = 1,
  rotation = 0
): THREE.CanvasTexture {
  const key = `wp_${wp.id}_${tint}_${scale}_${rotation}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (rotation !== 0) {
    ctx.translate(256, 256);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-256, -256);
  }

  wp.draw(ctx, tint, scale, rotation);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  textureCache.set(key, texture);
  return texture;
}

/**
 * Generate a seamless HTMLCanvasElement for a wallpaper pattern
 */
export function generateProceduralWallpaperCanvas(
  wallpaperId: string,
  tint: string,
  width = 512,
  height = 512
): HTMLCanvasElement {
  const wp = WALLPAPER_CATALOG.find((w) => w.id === wallpaperId) || WALLPAPER_CATALOG[0];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  wp.draw(ctx, tint, 1, 0);
  return canvas;
}
