import { describe, it, expect } from 'vitest';
import { SiteContentSchema } from '../content/schema';
import { defaultSiteContent } from '../content/defaultContent';
import { migrateContent } from '../content/migrations';

describe('SiteContent Schema & Migrations', () => {
  it('validates defaultSiteContent against SiteContentSchema', () => {
    const result = SiteContentSchema.safeParse(defaultSiteContent);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.error(result.error);
    }
  });

  it('migrates legacy v1 string structures into bilingual objects', () => {
    const legacyV1 = {
      schemaVersion: 1,
      brand: {
        businessName: 'RAI TRADERS',
        tagline: 'Old single string tagline',
        phone: '7000302682',
        phoneDisplay: '+91 7000302682',
        email: 'raitraders0006@gmail.com',
        address: 'Zone 1, MP Nagar, Bhopal',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        whatsappNumber: '7000302682',
        googleMapsUrl: 'https://maps.google.com',
      },
      hero: {
        badge: 'Old badge',
        title: 'Old title',
        description: 'Old desc',
        primaryCtaText: 'Old CTA',
        primaryCtaLink: '#contact',
        secondaryCtaText: 'Old Sec',
        secondaryCtaLink: '#gallery',
        backgroundImage: 'https://example.com/hero.jpg',
        statsBadge: 'Old stats',
      },
      services: [],
      gallery: [],
      testimonials: [],
      faqs: [],
    };

    const migrated = migrateContent(legacyV1);
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.brand.tagline.en).toBe('Old single string tagline');
    expect(migrated.brand.tagline.hi).toBe('आपके घर, दुकान और सपनों को दें एक नया और खूबसूरत रूप');
    expect(migrated.hero.badge.en).toBe('Old badge');
  });
});
