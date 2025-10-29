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
    // Increase intensity as zoom level increases
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
    // Color ramp for heatmap (blue -> cyan -> lime -> yellow -> red)
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      1,
      'rgb(178,24,43)',
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 20],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 15, 0.5],
  },
};

// Map initial view state (Seattle area) TODO: use user's general location via ip
export const initialViewState = {
  longitude: -122.3321,
  latitude: 47.6062,
  zoom: 11,
};

// Map style URL
export const mapStyleURL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
