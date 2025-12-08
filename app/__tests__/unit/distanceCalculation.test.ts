// app/__tests__/unit/distanceCalculation.test.ts
import { milesBetweenPoints } from '@/lib/utils/distance';

describe('milesBetweenPoints', () => {
  it('returns 0 for identical coordinates', () => {
    expect(milesBetweenPoints(47.6062, -122.3321, 47.6062, -122.3321)).toBe(0);
  });

  it('returns expected distance between two points', () => {
    const dist = milesBetweenPoints(47.6062, -122.3321, 47.6097, -122.3331);
    expect(dist).toBeGreaterThan(300 / 1609); // roughly 0.19 miles
    expect(dist).toBeLessThan(0.5); // rough sanity check
  });

  it('handles negative coordinates correctly', () => {
    const dist = milesBetweenPoints(-33.8688, 151.2093, -37.8136, 144.9631); // Sydney → Melbourne
    expect(dist).toBeGreaterThan(400); // miles
  });
});
