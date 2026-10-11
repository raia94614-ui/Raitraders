import { describe, it, expect } from 'vitest';
import { calculateWallpaperEstimate, calculatePaintingEstimate, formatInr } from '../lib/formatters';

describe('Formatters & Estimators', () => {
  it('formats Indian rupee amounts properly', () => {
    const formatted = formatInr(15000);
    expect(formatted).toContain('15,000');
  });

  it('calculates wallpaper rolls with 15% wastage and coverage', () => {
    // 12 ft x 10 ft = 120 sq. ft.
    // At ~50 sq.ft. effective coverage per roll: ceil(120 / 50) = 3 rolls
    const est = calculateWallpaperEstimate(12, 10, 'luxury');
    expect(est.areaSqFt).toBe(120);
    expect(est.rollsNeeded).toBe(3);
    expect(est.totalCostMin).toBeGreaterThan(0);
    expect(est.totalCostMax).toBeGreaterThan(est.totalCostMin);
  });

  it('calculates painting costs based on finish type', () => {
    const est = calculatePaintingEstimate(200, 'texture');
    expect(est.min).toBe(200 * 38);
    expect(est.max).toBe(200 * 65);
  });
});
