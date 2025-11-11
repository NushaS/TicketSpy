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
    // keep weight driven by an 'intensity' property if available
    'heatmap-weight': ['get', 'intensity'],

    // slightly stronger intensity scaling with zoom so clusters darken more at high zoom
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.8, 12, 1.6, 18, 2.4],

    // color ramp: transparent -> cool desaturated blue -> warm pink -> vivid red
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(255,255,255,0)', // transparent at zero
      0.06,
      'rgba(210,235,255,0.22)', // faint cool hint
      0.18,
      'rgba(180,205,255,0.30)', // airy blue
      0.35,
      'rgba(246,178,190,0.58)', // slightly pinker mid
      0.55,
      'rgba(249,125,140,0.82)', // warm pink
      0.85,
      'rgba(220,70,50,0.88)', // vivid orange-red
      1,
      'rgba(140,18,36,0.96)', // deep red at max density
    ],

    // radius tuned for smooth blending but still localized
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 6, 12, 22, 18, 36],

    // overall opacity curve (UI slider will multiply on top of this)
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.55, 8, 0.48, 15, 0.38],
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
