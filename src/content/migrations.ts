import { type SiteContent, SiteContentSchema } from './schema';

/**
 * Ensures any string or partially migrated object converts into a valid BilingualText { en, hi }
 */
export function ensureBilingual(value: any, fallbackHi = ''): { en: string; hi: string } {
  if (value && typeof value === 'object' && 'en' in value && 'hi' in value) {
    return { en: String(value.en || ''), hi: String(value.hi || '') };
  }
  const str = String(value || '');
  return { en: str, hi: fallbackHi || str };
}

/**
 * Migration pipeline: inspects document schemaVersion and transforms to the latest schema.
 */
export function migrateContent(raw: any): SiteContent {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid content structure: expected an object.');
  }

  // Auto-heal known broken image URLs
  const rawString = JSON.stringify(raw);
  if (rawString.includes('1594897030560-69273c5b597c')) {
    raw = JSON.parse(
      rawString.replaceAll(
        'https://images.unsplash.com/photo-1594897030560-69273c5b597c',
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119'
      )
    );
  }

  const version = raw.schemaVersion || 1;

  if (version === 1) {
    // Migrate v1 to v2 (convert plain strings to bilingual text)
    const migrated: any = {
      schemaVersion: 2,
      brand: {
        businessName: raw.brand?.businessName || 'RAI TRADERS',
        tagline: {
          en: raw.brand?.tagline || 'Wallpaper Designing • Wall Painting',
          hi: raw.brand?.hindiTagline || 'आपके घर, दुकान और सपनों को दें एक नया और खूबसूरत रूप',
        },
        phone: raw.brand?.phone || '7000302682',
        phoneDisplay: raw.brand?.phoneDisplay || '+91 70003 02682',
        email: raw.brand?.email || 'raitraders0006@gmail.com',
        address: {
          en: raw.brand?.address || 'Zone 1, MP Nagar, Bhopal, Madhya Pradesh, India',
          hi: 'ज़ोन 1, एमपी नगर, भोपाल, मध्य प्रदेश, भारत',
        },
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        whatsappNumber: raw.brand?.whatsappNumber || '917000302682',
        googleMapsUrl: raw.brand?.googleMapsUrl || 'https://maps.google.com/?q=Zone+1+MP+Nagar+Bhopal',
        googleMapsEmbed: raw.brand?.googleMapsEmbed || '',
        instagram: raw.brand?.instagram || '',
        facebook: raw.brand?.facebook || '',
      },
      hero: {
        badge: ensureBilingual(raw.hero?.badge, 'प्रीमियम वॉल डिज़ाइन एवं फिनिशिंग'),
        title: {
          en: raw.hero?.title || 'Transform Your Walls. Elevate Your Space.',
          hi: raw.hero?.hindiTitle || 'दीवारों को दें आपकी पसंद और सपनों का खूबसूरत रूप।',
        },
        description: ensureBilingual(raw.hero?.description),
        primaryCtaText: ensureBilingual(raw.hero?.primaryCtaText, 'डिज़ाइन देखें'),
        primaryCtaLink: raw.hero?.primaryCtaLink || '#gallery',
        secondaryCtaText: ensureBilingual(raw.hero?.secondaryCtaText, 'मुफ़्त कोटेशन प्राप्त करें'),
        secondaryCtaLink: raw.hero?.secondaryCtaLink || '#contact',
        backgroundImage: raw.hero?.backgroundImage || '',
        statsBadge: ensureBilingual(raw.hero?.statsBadge, 'भोपाल का विश्वसनीय वॉल स्टूडियो'),
      },
      trustHighlights: (raw.trustHighlights || []).map((t: any) => ({
        id: t.id || `t-${Math.random()}`,
        title: ensureBilingual(t.title),
        description: ensureBilingual(t.description),
        icon: t.icon || 'ShieldCheck',
      })),
      about: {
        heading: ensureBilingual(raw.about?.heading),
        subheading: ensureBilingual(raw.about?.subheading),
        description: ensureBilingual(raw.about?.description),
        quote: {
          en: raw.about?.quote || 'Beautiful walls create welcoming homes.',
          hi: raw.about?.hindiQuote || 'हम समझते हैं कि हर दीवार सिर्फ एक ढांचा नहीं, बल्कि आपकी पहचान है।',
        },
        image: raw.about?.image || '',
        experienceBadge: ensureBilingual(raw.about?.experienceBadge, 'क्राफ्ट्समैनशिप एवं गुणवत्ता'),
        values: (raw.about?.values || []).map((v: any) => ({
          id: v.id || `v-${Math.random()}`,
          title: ensureBilingual(v.title),
          description: ensureBilingual(v.description),
        })),
      },
      services: (raw.services || []).map((s: any) => ({
        id: s.id || `s-${Math.random()}`,
        title: ensureBilingual(s.title),
        description: ensureBilingual(s.description),
        fullDescription: s.fullDescription ? ensureBilingual(s.fullDescription) : undefined,
        image: s.image || '',
        icon: s.icon || 'Layers',
        category: s.category || 'Wallpaper',
        features: (s.features || []).map((f: any) => ensureBilingual(f)),
        isActive: s.isActive !== false,
        sortOrder: s.sortOrder || 0,
      })),
      gallery: (raw.gallery || []).map((g: any) => ({
        id: g.id || `g-${Math.random()}`,
        title: ensureBilingual(g.title),
        category: g.category || 'Wallpaper',
        image: g.image || '',
        caption: ensureBilingual(g.caption),
        roomType: g.roomType || 'Living Room',
        isFeatured: Boolean(g.isFeatured),
        isSampleImage: g.isSampleImage !== false,
        sortOrder: g.sortOrder || 0,
      })),
      beforeAfter: {
        isEnabled: raw.beforeAfter?.isEnabled !== false,
        items: [
          {
            id: 'ba-default',
            title: ensureBilingual(raw.beforeAfter?.title || 'The Power of Transformation'),
            description: ensureBilingual(raw.beforeAfter?.description || 'Realizing the potential of plain walls'),
            beforeImage: raw.beforeAfter?.beforeImage || '',
            afterImage: raw.beforeAfter?.afterImage || '',
            beforeLabel: ensureBilingual(raw.beforeAfter?.beforeLabel || 'Original Wall', 'शुरुआती दीवार'),
            afterLabel: ensureBilingual(raw.beforeAfter?.afterLabel || 'RAI TRADERS Finish', 'तैयार दीवार'),
            isActive: true,
          },
        ],
      },
      process: (raw.process || []).map((p: any) => ({
        step: p.step || '01',
        title: ensureBilingual(p.title),
        description: ensureBilingual(p.description),
        detail: ensureBilingual(p.detail),
      })),
      whyChooseUs: (raw.whyChooseUs || []).map((w: any) => ({
        id: w.id || `w-${Math.random()}`,
        title: ensureBilingual(w.title),
        description: ensureBilingual(w.description),
        icon: w.icon || 'Sparkles',
      })),
      testimonials: (raw.testimonials || []).map((tm: any) => ({
        id: tm.id || `tm-${Math.random()}`,
        clientName: tm.clientName || 'Client',
        location: ensureBilingual(tm.location, 'भोपाल'),
        rating: tm.rating || 5,
        review: ensureBilingual(tm.review),
        serviceUsed: ensureBilingual(tm.serviceUsed),
        isApproved: tm.isApproved !== false,
        date: tm.date || '2026',
      })),
      faqs: (raw.faqs || []).map((f: any) => ({
        id: f.id || `f-${Math.random()}`,
        question: ensureBilingual(f.question),
        answer: ensureBilingual(f.answer),
        category: f.category || 'General',
        sortOrder: f.sortOrder || 0,
      })),
      appearance: {
        accentColor: raw.appearance?.accentColor || '#D6A34D',
        enableAnimations: raw.appearance?.enableAnimations !== false,
        animationSpeed: raw.appearance?.animationSpeed || 'normal',
        fontHeading: raw.appearance?.fontHeading || 'Cormorant Garamond',
      },
      lastPublished: raw.lastPublished || raw.lastUpdated || new Date().toISOString(),
    };

    return SiteContentSchema.parse(migrated);
  }

  // Already version 2, parse with Zod
  return SiteContentSchema.parse(raw);
}
