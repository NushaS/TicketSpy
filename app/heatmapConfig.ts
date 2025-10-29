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
  const filteredPoints: DataPoint[] = longLatOnlyData || [];
  // TODO: use .filter() to validate data!
  console.log(JSON.stringify(filteredPoints));

  console.log('test');

  return filteredPoints;
}

export const oldDataPoints: DataPoint[] = [
  // Downtown Seattle cluster (high intensity)
  { longitude: -122.3321, latitude: 47.6062, intensity: 0.9 },
  { longitude: -122.3315, latitude: 47.6065, intensity: 0.95 },
  { longitude: -122.333, latitude: 47.606, intensity: 0.85 },
  { longitude: -122.331, latitude: 47.607, intensity: 0.9 },
  { longitude: -122.3325, latitude: 47.6055, intensity: 0.88 },
  { longitude: -122.3335, latitude: 47.6068, intensity: 0.92 },
  { longitude: -122.3305, latitude: 47.6058, intensity: 0.87 },
  { longitude: -122.3318, latitude: 47.6072, intensity: 0.91 },
  { longitude: -122.3328, latitude: 47.605, intensity: 0.86 },

  // Capitol Hill cluster (moderate-high intensity)
  { longitude: -122.315, latitude: 47.6205, intensity: 0.7 },
  { longitude: -122.3145, latitude: 47.6208, intensity: 0.75 },
  { longitude: -122.3155, latitude: 47.6203, intensity: 0.72 },
  { longitude: -122.3148, latitude: 47.621, intensity: 0.78 },
  { longitude: -122.3152, latitude: 47.62, intensity: 0.74 },
  { longitude: -122.3158, latitude: 47.6207, intensity: 0.76 },

  // Queen Anne cluster
  { longitude: -122.3493, latitude: 47.6205, intensity: 0.8 },
  { longitude: -122.3488, latitude: 47.6208, intensity: 0.82 },
  { longitude: -122.3498, latitude: 47.6203, intensity: 0.78 },
  { longitude: -122.349, latitude: 47.621, intensity: 0.81 },

  // South Lake Union cluster
  { longitude: -122.3284, latitude: 47.6188, intensity: 0.85 },
  { longitude: -122.328, latitude: 47.619, intensity: 0.83 },
  { longitude: -122.3288, latitude: 47.6186, intensity: 0.87 },
  { longitude: -122.3282, latitude: 47.6192, intensity: 0.84 },
  { longitude: -122.329, latitude: 47.6185, intensity: 0.86 },

  // Pike Place Market cluster (very high intensity)
  { longitude: -122.34, latitude: 47.6097, intensity: 0.95 },
  { longitude: -122.3405, latitude: 47.6095, intensity: 0.98 },
  { longitude: -122.3395, latitude: 47.6099, intensity: 0.93 },
  { longitude: -122.3403, latitude: 47.61, intensity: 0.96 },
  { longitude: -122.3398, latitude: 47.6094, intensity: 0.94 },

  // University District cluster
  { longitude: -122.3124, latitude: 47.6553, intensity: 0.75 },
  { longitude: -122.312, latitude: 47.6555, intensity: 0.73 },
  { longitude: -122.3128, latitude: 47.6551, intensity: 0.77 },
  { longitude: -122.3122, latitude: 47.6558, intensity: 0.74 },

  // Ballard cluster
  { longitude: -122.39, latitude: 47.6588, intensity: 0.6 },
  { longitude: -122.3895, latitude: 47.659, intensity: 0.62 },
  { longitude: -122.3905, latitude: 47.6586, intensity: 0.58 },

  // Central District cluster
  { longitude: -122.3015, latitude: 47.6101, intensity: 0.65 },
  { longitude: -122.301, latitude: 47.6103, intensity: 0.67 },
  { longitude: -122.302, latitude: 47.6099, intensity: 0.63 },

  // West Seattle
  { longitude: -122.3863, latitude: 47.5615, intensity: 0.7 },
  { longitude: -122.32, latitude: 47.615, intensity: 0.8 },
];

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
