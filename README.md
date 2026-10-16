# RAI TRADERS — Luxury Wallpaper Designing & Wall Painting (v2.0 Production Grade)

> **"आपके घर, दुकान और सपनों को दें एक नया और खूबसूरत रूप"**  
> *Zone 1, Maharana Pratap Nagar, Bhopal, Madhya Pradesh, India* &bull; Contact: **+91 70003 02682** &bull; Email: **raitraders0006@gmail.com**

A production-grade, frontend-only luxury website and client-side administration suite for **RAI TRADERS**, Bhopal's premier destination for luxury wallpaper designing, texture wall finishes, Italian stucco, and artisanal wall painting.

---

## 🌟 Highlights of Master Prompt v2 Implementation

### 1. Complete Bilingual Content System (English & Hindi)
- Every user-facing string is modeled as `{ en: string, hi: string }` using Zod validation.
- Instant, zero-layout-shift navbar toggle: **EN / हिं** (persisted in `localStorage`).
- Authentic Bhopal Hindi copy (e.g. *"आपके घर, दुकान और सपनों को दें एक नया और खूबसूरत रूप"*, *"ज़ोन 1, एमपी नगर, भोपाल"*).
- Self-hosted typography: Cormorant Garamond, Noto Serif Devanagari, and Plus Jakarta Sans with **zero runtime Google Fonts CDNs**.

### 2. Pluggable Storage Layer & Isolated Draft Architecture
- **IndexedDB (`idb`) Storage**: Stores documents (`content`), binary image blobs (`images`), and auto-snapshots (`backups`).
- **Draft vs. Published Isolation**: Admin edits are safely staged in a local draft without affecting the public site.
- **Undo / Redo History**: Full state history stack supporting `Ctrl+Z` and `Ctrl+Y` / `Ctrl+Shift+Z` with up to 30 history frames.
- **Automated Snapshots**: Every publish event automatically creates a rollback snapshot in IndexedDB.
- **BroadcastChannel Sync**: Updates across multiple open browser tabs without full page reloads.

### 3. Static Deployment Pack (`fflate` ZIP Exporter)
- Export complete website copy (`content.json`) and all custom-uploaded images (`/content-assets/`) into a single standalone `.zip`.
- Rewrites internal object URLs to relative root static assets.
- Allows the business owner to drag-and-drop onto **Netlify, Vercel, or GitHub Pages** for 100% free permanent hosting with zero database or server runtime.
- Allows importing `.zip` archives on any device to restore the complete studio state.

### 4. Interactive Studio Features
- **Wall Visualizer**: Test wallpaper patterns (Royal Gold Damask, Emerald Botanical Palm, Charcoal Italian Stucco, Pearl Geometry) against authentic living room, bedroom, dining, and executive office scenes with adjustable texture depth.
- **Transparent Area & Roll Cost Calculator**: Accurately computes rolls needed (factoring 15% vertical pattern repeat and trimming waste), material cost ranges, German adhesive labor, and painting rates per square foot in Bhopal.
- **Accessible Before & After Slider**: WAI-ARIA slider (`role="slider"`, `aria-valuenow`, keyboard arrow controls, touch & mouse drag).
- **Client-Side WhatsApp Quotation Engine**: Pre-fills structured inquiry summaries including room dimensions, estimated rolls, and selected patterns.
- **Sample vs Authentic Project Indicators**: Clear badges distinguish concept sample photography from verified Bhopal installations.
- **Privacy-Preserving Location Map**: Fast, click-to-load interactive Google Maps embed for Zone 1, MP Nagar, Bhopal.

---

## 🏗️ Architecture & Folder Structure

```
src/
├── app/
│   └── Router.tsx               # HashRouter for static host safety (/#/ and /#/admin)
├── content/
│   ├── schema.ts                # Strict Zod schemas (BilingualText, Brand, Services, Gallery)
│   ├── migrations.ts            # v1 -> v2 automatic schema migrator
│   └── defaultContent.ts        # Authentic Bhopal seed content
├── storage/
│   ├── StorageAdapter.ts        # Pluggable storage interface & snapshot types
│   ├── indexedDbAdapter.ts      # IDB adapter with snapshots & image store
│   ├── imageProcessing.ts       # Canvas WebP 1080p compression & thumbnails
│   └── zipPack.ts               # fflate Deployment Pack ZIP export/import
├── store/
│   ├── uiStore.ts               # Language toggle, toasts, lightbox, quote modal
│   ├── contentStore.ts          # Published site state & BroadcastChannel sync
│   └── draftStore.ts            # Admin working draft with undo/redo stack
├── features/
│   ├── public/                  # Public luxury website sections & legal pages
│   └── admin/                   # Full browser-based Admin Suite & tabs
├── lib/
│   ├── formatters.ts            # Indian currency (₹) & roll coverage formulas
│   ├── whatsapp.ts              # Sanitized phone & pre-filled WhatsApp links
│   └── seo.ts                   # LocalBusiness JSON-LD & meta title updater
└── tests/
    ├── schema.test.ts           # Zod parsing & migrations test
    ├── whatsapp.test.ts         # Phone validation & quotation link test
    ├── formatters.test.ts       # Area & roll calculation test
    └── zipPack.test.ts          # Deployment pack ZIP export/import round-trip
```

---

## 🔒 Honest Disclosures & Constraints

1. **Strictly Frontend-Only**: There is no Node.js backend, no Firebase, and no cloud database. All editing happens client-side in the browser.
2. **Browser Storage Lifetime**: Clearing browser cache will wipe IndexedDB. To preserve your changes across devices, always use the **Export Deployment Pack (ZIP)** button.
3. **Passcode Protection**: The admin passcode (default: `raitraders2026`) is verified client-side.

---

## 🧪 Testing & Verification

Run the automated test suite with Vitest:
```bash
npm test
```
All 4 test suites pass:
- `schema.test.ts`: Validates `defaultSiteContent` schema and legacy migration.
- `whatsapp.test.ts`: Verifies Indian phone sanitization and parameter encoding.
- `formatters.test.ts`: Validates roll formulas and coverage estimates.
- `zipPack.test.ts`: Verifies end-to-end `.zip` export and re-import.

Typecheck the codebase:
```bash
npm run typecheck
```

Build the production bundle:
```bash
npm run build
```

---

## 🎨 RAI Visualizer — Photoreal 360° Room Painter (Pre-Rendered Panorama + Mask Recolor)

Flagship feature mounted at `/#/visualizer` and accessible from the homepage hero CTA ("Apna Ghar Design Karein (3D)").

### Core Architecture & Shader Mathematics
Photorealism is achieved using **real equirectangular 360° pre-rendered panoramas** combined with **anti-aliased grayscale surface masks** and real-time WebGL GLSL fragment shader recoloring:

1. **Inside-Out Sphere**:
   Rendered on an inverted 360° sphere (`radius = 500, scale = [-1, 1, 1]` with `THREE.BackSide`), supporting drag/touch rotate with inertia, pinch/scroll zoom (FOV 40°–90°), mobile gyroscope orientation, and fullscreen view.
2. **Luminance-Preserving Recolor Equation**:
   $$L_{\text{pixel}} = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B \quad (\text{in linear space})$$
   $$\text{New Color} = \text{Target Color} \times \left(\frac{L_{\text{pixel}}}{L_{\text{surface\_avg}}}\right) + \text{HighPassDetail}$$
   This ensures that **100% of physical shadows, directional light falloffs, ambient occlusion, and corner darkening are preserved**—the wall never looks flat.
3. **Plaster Grain & High-Pass Detail Term**:
   Preserves original high-frequency wall micro-texture and plaster stipple.
4. **Physically Plausible Finish Controls**:
   - **Matte**: Purely diffuse, original shadow retention.
   - **Satin**: Subtle specular highlight sheen boost on bright spots.
   - **Gloss**: Rich reflective highlight boost derived from source luminance.
5. **Seamless Wallpaper Projection**:
   Seamless patterns are projected onto surface masks with perspective-aware repeat scale and rotation controls, multiplied by the same physical luminance map so patterns sit naturally in the room's light.
6. **Smooth 400ms Color Cross-Fade & Before/After Comparison Split Slider**.

---

### How to Add a New Room (No Code Changes Needed!)
Adding a new room to RAI Visualizer is 100% data-driven:

1. **Create Room Folder**:
   Create a folder at `/public/rooms/{roomId}/` (e.g. `/public/rooms/executive_office/`).
2. **Add 360° Panorama (`base.jpg`)**:
   Save a 2:1 equirectangular panorama image (e.g. 4096×2048 or 2048×1024) as `/public/rooms/{roomId}/base.jpg`.
3. **Add Grayscale Surface Masks (`masks/{surfaceId}.png`)**:
   Create anti-aliased grayscale PNGs in `/public/rooms/{roomId}/masks/`:
   - White (`#FFFFFF`) = Paintable surface.
   - Black (`#000000`) = Background / unpaintable furniture / floor.
   - E.g. `masks/accent-wall.png`, `masks/wall-left.png`, `masks/ceiling.png`.
4. **Create `room.json`**:
   Save `/public/rooms/{roomId}/room.json` matching this schema:
   ```json
   {
     "id": "executive_office",
     "name": "Executive Office Suite",
     "nameHi": "एग्जीक्यूटिव ऑफिस",
     "initialView": { "yaw": 0, "pitch": 0, "fov": 75 },
     "surfaces": [
       {
         "id": "accent-wall",
         "label": "Mahogany Desk Accent Wall",
         "labelHi": "डेस्क एक्सेंट वॉल",
         "defaultColor": "#0E1B33",
         "maskFile": "masks/accent-wall.png",
         "avgLuminance": 0.52
       }
     ],
     "hotspots": [
       {
         "toRoomId": "living",
         "yaw": 180,
         "pitch": -2,
         "label": "Living Room",
         "labelHi": "लिविंग रूम"
       }
     ]
   }
   ```
5. **Register in `/public/rooms/rooms.json`**:
   Add an entry with `id`, `name`, `nameHi`, `emoji`, `folder`, and `areaDefaultSqFt`.
   The studio will automatically discover and render the room!

---

## 🚀 Deployment Instructions

### Permanent Free Hosting (Netlify, Vercel, Cloudflare Pages)
1. Fork or clone this repository.
2. Connect to Netlify or Vercel with build command `npm run build` and publish directory `dist`.
3. To update site copy without touching code, open `/#/admin`, make edits, click **Export ZIP Pack**, and drop the unzipped `content.json` and `content-assets/` into `public/`.

