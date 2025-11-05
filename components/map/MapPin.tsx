// Defines a reusable MapPin component for rendering a custom icon (like CarIcon or HeartIcon)
// at a specific latitude/longitude on the MapLibre map.
'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';

// The expected props for the MapPin component:
interface MapPinProps {
  longitude: number;
  latitude: number;
  icon: React.ReactNode;
}

// Renders a single map pin using the Marker component
export const MapPin: React.FC<MapPinProps> = ({ longitude, latitude, icon }) => (
  <Marker longitude={longitude} latitude={latitude} anchor="bottom">
    {icon}
  </Marker>
);
