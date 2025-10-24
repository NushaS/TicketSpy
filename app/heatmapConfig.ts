import type { LayerProps } from 'react-map-gl/maplibre';

// Mock data points representing parking ticket locations with intensity values for testing

export const dataPoints = [
  // Downtown Seattle cluster (high intensity)
  { longitude: -122.3321, latitude: 47.6062, intensity: 0.9 },
  { longitude: -122.3315, latitude: 47.6065, intensity: 0.95 },
  { longitude: -122.3330, latitude: 47.6060, intensity: 0.85 },
  { longitude: -122.3310, latitude: 47.6070, intensity: 0.9 },
  { longitude: -122.3325, latitude: 47.6055, intensity: 0.88 },
  { longitude: -122.3335, latitude: 47.6068, intensity: 0.92 },
  { longitude: -122.3305, latitude: 47.6058, intensity: 0.87 },
  { longitude: -122.3318, latitude: 47.6072, intensity: 0.91 },
  { longitude: -122.3328, latitude: 47.6050, intensity: 0.86 },
  
  // Capitol Hill cluster (moderate-high intensity)
  { longitude: -122.3150, latitude: 47.6205, intensity: 0.7 },
  { longitude: -122.3145, latitude: 47.6208, intensity: 0.75 },
  { longitude: -122.3155, latitude: 47.6203, intensity: 0.72 },
  { longitude: -122.3148, latitude: 47.6210, intensity: 0.78 },
  { longitude: -122.3152, latitude: 47.6200, intensity: 0.74 },
  { longitude: -122.3158, latitude: 47.6207, intensity: 0.76 },
  
  // Queen Anne cluster
  { longitude: -122.3493, latitude: 47.6205, intensity: 0.8 },
  { longitude: -122.3488, latitude: 47.6208, intensity: 0.82 },
  { longitude: -122.3498, latitude: 47.6203, intensity: 0.78 },
  { longitude: -122.3490, latitude: 47.6210, intensity: 0.81 },
  
  // South Lake Union cluster
  { longitude: -122.3284, latitude: 47.6188, intensity: 0.85 },
  { longitude: -122.3280, latitude: 47.6190, intensity: 0.83 },
  { longitude: -122.3288, latitude: 47.6186, intensity: 0.87 },
  { longitude: -122.3282, latitude: 47.6192, intensity: 0.84 },
  { longitude: -122.3290, latitude: 47.6185, intensity: 0.86 },
  
  // Pike Place Market cluster (very high intensity)
  { longitude: -122.3400, latitude: 47.6097, intensity: 0.95 },
  { longitude: -122.3405, latitude: 47.6095, intensity: 0.98 },
  { longitude: -122.3395, latitude: 47.6099, intensity: 0.93 },
  { longitude: -122.3403, latitude: 47.6100, intensity: 0.96 },
  { longitude: -122.3398, latitude: 47.6094, intensity: 0.94 },
  
  // University District cluster
  { longitude: -122.3124, latitude: 47.6553, intensity: 0.75 },
  { longitude: -122.3120, latitude: 47.6555, intensity: 0.73 },
  { longitude: -122.3128, latitude: 47.6551, intensity: 0.77 },
  { longitude: -122.3122, latitude: 47.6558, intensity: 0.74 },
  
  // Ballard cluster
  { longitude: -122.3900, latitude: 47.6588, intensity: 0.6 },
  { longitude: -122.3895, latitude: 47.6590, intensity: 0.62 },
  { longitude: -122.3905, latitude: 47.6586, intensity: 0.58 },
  
  // Central District cluster
  { longitude: -122.3015, latitude: 47.6101, intensity: 0.65 },
  { longitude: -122.3010, latitude: 47.6103, intensity: 0.67 },
  { longitude: -122.3020, latitude: 47.6099, intensity: 0.63 },
  
  // West Seattle
  { longitude: -122.3863, latitude: 47.5615, intensity: 0.7 },
  { longitude: -122.3200, latitude: 47.6150, intensity: 0.8 },
];

// Convert data points to GeoJSON format
export const geojsonData = {
  type: 'FeatureCollection' as const,
  features: dataPoints.map((point, index) => ({
    type: 'Feature' as const,
    properties: { intensity: point.intensity },
    geometry: {
      type: 'Point' as const,
      coordinates: [point.longitude, point.latitude]
    }
  }))
};

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
      0, 'rgba(33,102,172,0)',
      0.2, 'rgb(103,169,207)',
      0.4, 'rgb(209,229,240)',
      0.6, 'rgb(253,219,199)',
      0.8, 'rgb(239,138,98)',
      1, 'rgb(178,24,43)'
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 20],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 15, 0.5]
  }
};

// Map initial view state (Seattle area) TODO: use user's general location via ip
export const initialViewState = {
  longitude: -122.3321,
  latitude: 47.6062,
  zoom: 11
};

// Map style URL
export const mapStyleURL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
