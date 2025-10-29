import type { LayerProps } from 'react-map-gl/maplibre';
import { useTicketTable } from '@/lib/hooks/useTicketTable';

export type DataPoint = {
  latitude: number;
  longitude: number;
  intensity: number;
};
// Mock data points representing parking ticket locations with intensity values for testing
const globalIntensity = 1;
export function useDynamicDatapoints() {
  const { data, error, isLoading, isFetching } = useTicketTable();
  const longLatOnlyData = data?.map((currRow) => {
    return {
      latitude: Number(currRow.latitude),
      longitude: Number(currRow.longitude),
      intensity: globalIntensity,
    };
  });
  // const filteredPoints: DataPoint[] = longLatOnlyData?.filter(row => typeof row.latitude === 'number' && typeof row.longitude === 'number' && typeof row.intensity === 'number');
  const filteredPoints: DataPoint[] = (longLatOnlyData ?? []).filter(
    (row): row is DataPoint =>
      typeof row.latitude === 'number' &&
      typeof row.longitude === 'number' &&
      Number.isFinite(row.latitude) &&
      Number.isFinite(row.longitude) &&
      typeof row.intensity === 'number' &&
      Number.isFinite(row.intensity)
  );

  // TODO: use .filter() to validate data!
  console.log(JSON.stringify(filteredPoints));

  console.log('test');

  return filteredPoints;
}

// Convert data points to GeoJSON format
export function getGeoJsonData(data: DataPoint[]) {
  const geojsonData = {
    type: 'FeatureCollection' as const,
    features: data.map((point, index) => ({
      type: 'Feature' as const,
      properties: { intensity: point.intensity },
      geometry: {
        type: 'Point' as const,
        coordinates: [point.longitude, point.latitude],
      },
    })),
  };
  return geojsonData;
}

// Heatmap layer configuration
export const heatmapLayer: LayerProps = {
  id: 'heatmap',
  type: 'heatmap',
  source: 'tickets',
  paint: {
    // Increase weight as intensity increases
    'heatmap-weight': ['get', 'intensity'],
    // Increase intensity as zoom level increases (boosted so dense areas darken more)
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 4],
    // Classic heatmap ramp: transparent at 0 (so background shows through),
    // then light-blue -> darker blue -> cyan -> yellow/orange -> red.
    // Higher density stops are more opaque/darker so areas with lots of data
    // read as stronger/darker colors.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      // 0 is transparent so the background (light blue) shows where there's no data
      0,
      'rgba(230,247,255,0)',
      // very low density: faint light-blue tint
      0.05,
      'rgba(173,216,230,0.22)',
      // low-medium: soft steel blue
      0.2,
      'rgba(70,130,180,0.38)',
      // medium: stronger blue
      0.4,
      'rgba(0,99,255,0.56)',
      // high: yellow/orange (becomes visible and moves toward red)
      0.6,
      'rgba(255,200,0,0.72)',
      0.8,
      'rgba(255,120,0,0.86)',
      // highest density: red (less transparent but not fully black)
      1,
      'rgba(178,24,43,0.95)',
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 20],
    // Baseline opacity increased moderately so colors are less transparent at 100%.
    // Slider still multiplies these values in the UI.
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.6, 8, 0.5, 15, 0.35],
  },
};

// (background managed via map style onLoad in page.tsx)

// Map initial view state (Seattle area) TODO: use user's general location via ip
export const initialViewState = {
  longitude: -122.3321,
  latitude: 47.6062,
  zoom: 11,
};

// Map style URL
export const mapStyleURL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
