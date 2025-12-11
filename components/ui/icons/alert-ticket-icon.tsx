import React from 'react';
import { TicketIcon2 } from './ticket-icon';

// Helper to compute ticket alert marker sizing based on map zoom.
export const computeTicketMarkerSizing = (mapZoom: number) => {
  const minZoom = 5; // smallest zoom level we care about for scaling
  const maxZoom = 25; // largest zoom level before we cap growth
  const clamped = Math.min(Math.max(mapZoom, minZoom), maxZoom); // keep zoom within range
  const t = (clamped - minZoom) / (maxZoom - minZoom); // normalize zoom to 0..1
  const scale = t; // 25% size at min zoom, 100% at max zoom
  const baseIcon = 38 * 2; // default icon size to mirror enforcement marker sizing
  const icon = Math.round(baseIcon * scale); // scaled ticket icon size
  return { icon };
};

// Alert variant: white ticket on a red circular background.
export const AlertTicketIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 45,
  className = '',
}) => {
  const innerSize = Math.round(size * 0.5);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e11d48',
        borderRadius: '50%',
      }}
      className={className}
    >
      <TicketIcon2 size={innerSize} color="#ffffff" />
    </div>
  );
};
