// Defines a reusable MapPin component for rendering a custom icon (like CarIcon or HeartIcon)
// at a specific latitude/longitude on MapLibre map.
'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import styles from '@/app/bookmark-and-parking-pins/pins.module.css';

interface MapPinProps {
  longitude: number;
  latitude: number;
  icon: React.ReactNode;
  type: 'car' | 'heart';
  id: string;
  bookmarkName?: string | null;
  startTime?: string | null;
  onDismissPinActionPopup?: () => void;
  onOpenBookmarkActions?: (pin: {
    id: string;
    latitude: number;
    longitude: number;
    bookmarkName?: string | null;
  }) => void;
  onOpenEndParking?: (pin: {
    id: string;
    latitude: number;
    longitude: number;
    startTime?: string | null;
  }) => void;
}

// Renders a single map pin using the Marker component
export const MapPin: React.FC<MapPinProps> = ({
  longitude,
  latitude,
  icon,
  type,
  id,
  bookmarkName,
  startTime,
  onDismissPinActionPopup,
  onOpenBookmarkActions,
  onOpenEndParking,
}) => {
  // Decide which modal to show when a pin is clicked.
  const handlePinClick = () => {
    onDismissPinActionPopup?.(); // hide the pin action popup when interacting with an existing pin
    if (type === 'heart') {
      onOpenBookmarkActions?.({ id, latitude, longitude, bookmarkName });
    } else {
      onOpenEndParking?.({ id, latitude, longitude, startTime });
    }
  };

  return (
    <Marker longitude={longitude} latitude={latitude} anchor="bottom">
      <div
        className={styles.markerWrapper}
        onClick={(e) => {
          e.stopPropagation();
          handlePinClick();
        }}
        title={`Click to ${type === 'car' ? 'end parking session' : 'manage bookmark'}`}
      >
        {icon}
      </div>
    </Marker>
  );
};
