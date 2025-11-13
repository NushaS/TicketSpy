// 📁 /lib/utils/mapUtils.ts
/*
  Utility functions for validating and standardizing map pin data.
  Used for rendering pins such as parked cars, bookmarks, or sightings.
*/

export type DataPoint = {
  latitude: number;
  longitude: number;
  type?: string; // identifies what kind of pin it is (e.g., "car", "heart")
};

// Filters out invalid or non-numeric coordinates
// Ensures only rows with valid latitude and longitude values are kept
export function filterValidDataPoints(data: DataPoint[]): DataPoint[] {
  return data.filter(
    (row): row is DataPoint =>
      typeof row.latitude === 'number' &&
      typeof row.longitude === 'number' &&
      Number.isFinite(row.latitude) &&
      Number.isFinite(row.longitude)
  );
}
