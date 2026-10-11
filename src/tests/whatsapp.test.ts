import { describe, it, expect } from 'vitest';
import { sanitizePhone, generateWhatsAppUrl, generateQuickInquiryUrl } from '../lib/whatsapp';

describe('WhatsApp Link & Quotation Engine', () => {
  it('sanitizes 10-digit Indian phone numbers with country code', () => {
    expect(sanitizePhone('7000302682')).toBe('917000302682');
    expect(sanitizePhone('917000302682')).toBe('917000302682');
    expect(sanitizePhone('+91 70003-02682')).toBe('917000302682');
  });

  it('generates structured WhatsApp consultation link with encoded parameters', () => {
    const url = generateWhatsAppUrl('7000302682', {
      clientName: 'Rahul Verma',
      service: 'Premium Wallpaper Designing',
      roomType: 'Master Bedroom',
      areaSqFt: 140,
      estimatedRolls: 3,
      estimatedCostRange: '₹8,500 - ₹14,000',
      locality: 'Arera Colony',
    });

    expect(url).toContain('https://wa.me/917000302682?text=');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('Rahul Verma');
    expect(decoded).toContain('Premium Wallpaper Designing');
    expect(decoded).toContain('Master Bedroom');
    expect(decoded).toContain('140 sq. ft.');
    expect(decoded).toContain('3 rolls');
    expect(decoded).toContain('Arera Colony, Bhopal');
  });

  it('generates quick inquiry URL with service context', () => {
    const url = generateQuickInquiryUrl('7000302682', 'Italian Stucco Texture');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('Italian Stucco Texture');
    expect(decoded).toContain('Bhopal');
  });
});
