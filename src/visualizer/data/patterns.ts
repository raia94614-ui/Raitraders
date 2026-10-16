/** Wallpaper pattern definitions — procedurally drawn onto CanvasTexture.
 *  To add patterns: add an entry and implement its draw() function.
 */
export interface WallpaperPattern {
  id: string;
  name: string;
  code: string;
  category: string;
  /** Draws the pattern onto a 512×512 canvas context */
  draw: (ctx: CanvasRenderingContext2D, tint: string, scale: number, rotation: number) => void;
}

/** Helper: tint an rgba string */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export const WALLPAPER_PATTERNS: WallpaperPattern[] = [
  // ── Geometric ─────────────────────────────────────────────────────────────
  {
    id: 'wp001', name: 'Diamond Lattice', code: 'WP-101', category: 'Geometric',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      const s = 60 * scale;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = `rgba(255,255,255,0.35)`;
      ctx.lineWidth = 1.5;
      for (let x = -s; x < 512 + s; x += s) {
        for (let y = -s; y < 512 + s; y += s) {
          ctx.beginPath();
          ctx.moveTo(x, y - s / 2);
          ctx.lineTo(x + s / 2, y);
          ctx.lineTo(x, y + s / 2);
          ctx.lineTo(x - s / 2, y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    },
  },
  {
    id: 'wp002', name: 'Chevron Wave', code: 'WP-102', category: 'Geometric',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const h = 30 * scale;
      ctx.strokeStyle = `rgba(255,255,255,0.4)`;
      ctx.lineWidth = 3;
      for (let y = 0; y < 512 + h * 2; y += h * 2) {
        ctx.beginPath();
        for (let x = 0; x <= 512; x += 60 * scale) {
          ctx.lineTo(x, y - h);
          ctx.lineTo(x + 30 * scale, y);
          ctx.lineTo(x + 60 * scale, y - h);
        }
        ctx.stroke();
      }
    },
  },
  {
    id: 'wp003', name: 'Moroccan Tiles', code: 'WP-103', category: 'Geometric',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      const s = 50 * scale;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = `rgba(255,220,100,0.5)`;
      ctx.lineWidth = 2;
      for (let x = 0; x < 512; x += s) {
        for (let y = 0; y < 512; y += s) {
          const cx = x + s / 2, cy = y + s / 2, r2 = s * 0.38;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const nx = cx + r2 * Math.cos(angle);
            const ny = cy + r2 * Math.sin(angle);
            i === 0 ? ctx.moveTo(nx, ny) : ctx.lineTo(nx, ny);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    },
  },
  {
    id: 'wp004', name: 'Hexagon Grid', code: 'WP-104', category: 'Geometric',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const s2 = 30 * scale;
      ctx.strokeStyle = `rgba(255,255,255,0.3)`;
      ctx.lineWidth = 1.5;
      const w2 = s2 * Math.sqrt(3);
      for (let y = -s2; y < 512 + s2; y += s2 * 1.5) {
        for (let x = -w2; x < 512 + w2; x += w2) {
          const offset = ((y / (s2 * 1.5)) % 2 !== 0) ? w2 / 2 : 0;
          const cx = x + offset;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * 60 - 30) * (Math.PI / 180);
            const px = cx + s2 * Math.cos(a);
            const py = y + s2 * Math.sin(a);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    },
  },
  // ── Floral ────────────────────────────────────────────────────────────────
  {
    id: 'wp005', name: 'Garden Petals', code: 'WP-201', category: 'Floral',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const s3 = 60 * scale;
      for (let x = 0; x < 512; x += s3) {
        for (let y = 0; y < 512; y += s3) {
          const cx = x + s3 / 2, cy = y + s3 / 2;
          for (let p = 0; p < 5; p++) {
            const a = (p / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(
              cx + Math.cos(a) * s3 * 0.2, cy + Math.sin(a) * s3 * 0.2,
              s3 * 0.18, s3 * 0.1, a, 0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(255,255,255,0.18)`;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(cx, cy, s3 * 0.07, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,220,80,0.6)`;
          ctx.fill();
        }
      }
    },
  },
  {
    id: 'wp006', name: 'Damask Royal', code: 'WP-202', category: 'Floral',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const s4 = 80 * scale;
      for (let x = 0; x < 512; x += s4) {
        for (let y = 0; y < 512; y += s4) {
          const cx = x + s4 / 2, cy = y + s4 / 2;
          ctx.strokeStyle = `rgba(255,255,255,0.25)`;
          ctx.lineWidth = 1;
          // Vertical stem
          ctx.beginPath();
          ctx.moveTo(cx, cy - s4 * 0.4);
          ctx.bezierCurveTo(cx + s4 * 0.15, cy - s4 * 0.2, cx + s4 * 0.15, cy + s4 * 0.2, cx, cy + s4 * 0.4);
          ctx.bezierCurveTo(cx - s4 * 0.15, cy + s4 * 0.2, cx - s4 * 0.15, cy - s4 * 0.2, cx, cy - s4 * 0.4);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        }
      }
    },
  },
  // ── Textures ──────────────────────────────────────────────────────────────
  {
    id: 'wp007', name: 'Marble Veins', code: 'WP-301', category: 'Texture',
    draw(ctx, tint, _scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = `rgba(255,255,255,0.15)`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, 0);
        ctx.bezierCurveTo(
          Math.random() * 512, 120,
          Math.random() * 512, 380,
          Math.random() * 512, 512
        );
        ctx.stroke();
      }
    },
  },
  {
    id: 'wp008', name: 'Natural Wood', code: 'WP-302', category: 'Texture',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${Math.min(r + 20, 255)},${Math.min(g + 10, 255)},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 512; y += 3 * scale) {
        ctx.strokeStyle = `rgba(${Math.max(r - 20, 0)},${Math.max(g - 15, 0)},${Math.max(b - 10, 0)},0.4)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < 512; x += 20) {
          ctx.lineTo(x, y + (Math.random() - 0.5) * 3);
        }
        ctx.stroke();
      }
    },
  },
  {
    id: 'wp009', name: 'Concrete Loft', code: 'WP-303', category: 'Texture',
    draw(ctx, tint, _scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 3000; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 3 + 1, Math.random() * 3 + 1);
      }
    },
  },
  // ── Stripes ───────────────────────────────────────────────────────────────
  {
    id: 'wp010', name: 'Classic Stripes', code: 'WP-401', category: 'Stripes',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const sw = 20 * scale;
      for (let x = 0; x < 512; x += sw * 2) {
        ctx.fillStyle = `rgba(255,255,255,0.12)`;
        ctx.fillRect(x, 0, sw, 512);
      }
    },
  },
  {
    id: 'wp011', name: 'Diagonal Stripe', code: 'WP-402', category: 'Stripes',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = `rgba(255,255,255,0.2)`;
      ctx.lineWidth = 12 * scale;
      for (let i = -512; i < 1024; i += 40 * scale) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 512, 512);
        ctx.stroke();
      }
    },
  },
  // ── 3D Panel ──────────────────────────────────────────────────────────────
  {
    id: 'wp012', name: '3D Brick Panel', code: 'WP-501', category: '3D Panel',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      const bW = 80 * scale, bH = 30 * scale;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      let row = 0;
      for (let y = 0; y < 512; y += bH) {
        const offset = (row % 2) * (bW / 2);
        for (let x = -bW; x < 512 + bW; x += bW) {
          ctx.fillStyle = `rgba(255,255,255,0.07)`;
          ctx.fillRect(x + offset + 1, y + 1, bW - 2, bH - 2);
          ctx.strokeStyle = `rgba(0,0,0,0.2)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x + offset + 1, y + 1, bW - 2, bH - 2);
          // Highlight top-left
          ctx.fillStyle = `rgba(255,255,255,0.12)`;
          ctx.fillRect(x + offset + 1, y + 1, bW - 2, 4);
        }
        row++;
      }
    },
  },
  {
    id: 'wp013', name: '3D Wave Panel', code: 'WP-502', category: '3D Panel',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const amp = 15 * scale, freq = 0.04 / scale;
      for (let y = 0; y < 512; y += 20 * scale) {
        ctx.beginPath();
        for (let x = 0; x <= 512; x++) {
          const yy = y + Math.sin(x * freq) * amp;
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = `rgba(255,255,255,0.15)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    },
  },
  // ── Luxury ────────────────────────────────────────────────────────────────
  {
    id: 'wp014', name: 'Gold Damask', code: 'WP-601', category: 'Luxury',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const s5 = 90 * scale;
      for (let x = 0; x < 512; x += s5) {
        for (let y = 0; y < 512; y += s5) {
          const cx = x + s5 / 2, cy = y + s5 / 2;
          const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, s5 * 0.4);
          grd.addColorStop(0, 'rgba(212,175,55,0.3)');
          grd.addColorStop(1, 'rgba(212,175,55,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(cx, cy, s5 * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },
  {
    id: 'wp015', name: 'Toile Art', code: 'WP-602', category: 'Luxury',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = `rgba(255,255,255,0.2)`;
      ctx.lineWidth = 1.2;
      const s6 = 70 * scale;
      for (let x = 0; x < 512; x += s6) {
        for (let y = 0; y < 512; y += s6) {
          const cx = x + s6 / 2, cy = y + s6 / 2;
          // simple fleur outline
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.ellipse(cx + Math.cos(i * Math.PI / 2) * s6 * 0.2, cy + Math.sin(i * Math.PI / 2) * s6 * 0.2, s6 * 0.12, s6 * 0.06, i * Math.PI / 2, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(cx, cy, s6 * 0.06, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    },
  },
  // ── Kids ──────────────────────────────────────────────────────────────────
  {
    id: 'wp016', name: 'Polka Party', code: 'WP-701', category: 'Kids',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const s7 = 40 * scale;
      const dotColors = ['rgba(255,100,100,0.6)', 'rgba(100,200,100,0.6)', 'rgba(100,150,255,0.6)', 'rgba(255,220,50,0.6)'];
      let i7 = 0;
      for (let x = s7 / 2; x < 512; x += s7) {
        for (let y = s7 / 2; y < 512; y += s7) {
          ctx.beginPath();
          ctx.arc(x, y, s7 * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = dotColors[i7 % dotColors.length];
          ctx.fill();
          i7++;
        }
      }
    },
  },
  {
    id: 'wp017', name: 'Star Sky', code: 'WP-702', category: 'Kids',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = 'rgba(255,240,100,0.7)';
      for (let i = 0; i < 40; i++) {
        const sx = Math.random() * 512, sy = Math.random() * 512, sr = (3 + Math.random() * 6) * scale;
        ctx.beginPath();
        for (let p2 = 0; p2 < 5; p2++) {
          const a2 = (p2 * 4 * Math.PI) / 5 - Math.PI / 2;
          p2 === 0 ? ctx.moveTo(sx + sr * Math.cos(a2), sy + sr * Math.sin(a2))
            : ctx.lineTo(sx + sr * Math.cos(a2), sy + sr * Math.sin(a2));
        }
        ctx.closePath();
        ctx.fill();
      }
    },
  },
  // ── Abstract ──────────────────────────────────────────────────────────────
  {
    id: 'wp018', name: 'Circuit Board', code: 'WP-801', category: 'Abstract',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = `rgba(0,255,150,0.3)`;
      ctx.lineWidth = 1;
      for (let i8 = 0; i8 < 30; i8++) {
        ctx.beginPath();
        const sx2 = Math.random() * 512, sy2 = Math.random() * 512;
        ctx.moveTo(sx2, sy2);
        for (let j = 0; j < 5; j++) {
          if (Math.random() > 0.5) {
            ctx.lineTo(sx2 + (Math.random() - 0.5) * 100 * scale, sy2);
          } else {
            ctx.lineTo(sx2, sy2 + (Math.random() - 0.5) * 100 * scale);
          }
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx2, sy2, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,150,0.5)`;
        ctx.fill();
      }
    },
  },
  {
    id: 'wp019', name: 'Watercolor Wash', code: 'WP-802', category: 'Abstract',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      for (let i9 = 0; i9 < 15; i9++) {
        const grd2 = ctx.createRadialGradient(
          Math.random() * 512, Math.random() * 512, 0,
          Math.random() * 512, Math.random() * 512, 80 * scale
        );
        grd2.addColorStop(0, `rgba(255,255,255,0.15)`);
        grd2.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = grd2;
        ctx.fillRect(0, 0, 512, 512);
      }
    },
  },
  {
    id: 'wp020', name: 'Linen Weave', code: 'WP-901', category: 'Natural',
    draw(ctx, tint, scale) {
      const [r, g, b] = hexToRgb(tint);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, 512, 512);
      const th = 2 * scale;
      for (let y2 = 0; y2 < 512; y2 += th * 2) {
        ctx.fillStyle = `rgba(0,0,0,0.06)`;
        ctx.fillRect(0, y2, 512, th);
      }
      for (let x2 = 0; x2 < 512; x2 += th * 2) {
        ctx.fillStyle = `rgba(255,255,255,0.06)`;
        ctx.fillRect(x2, 0, th, 512);
      }
    },
  },
];

export type PatternCategory = 'Geometric' | 'Floral' | 'Texture' | 'Stripes' | '3D Panel' | 'Luxury' | 'Kids' | 'Abstract' | 'Natural';

export const PATTERN_CATEGORIES = [...new Set(WALLPAPER_PATTERNS.map((p) => p.category))];
