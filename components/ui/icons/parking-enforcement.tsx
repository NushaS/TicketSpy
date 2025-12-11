import * as React from 'react';
import { SightingIcon } from './sighting-icon';

type Props = {
  size?: number;
};

// Helper to compute enforcement marker sizing based on map zoom.
export const computeEnforcementMarkerSizing = (mapZoom: number) => {
  const minZoom = 5; // smallest zoom level we care about for scaling
  const maxZoom = 25; // largest zoom level before we cap growth
  const clamped = Math.min(Math.max(mapZoom, minZoom), maxZoom); // keep zoom within the range
  const t = (clamped - minZoom) / (maxZoom - minZoom); // normalize zoom to 0..1
  const scale = t; // 25% size at min zoom, 100% at max zoom
  const baseOuter = 44 * 2; // default outer bubble size
  const baseInner = 40 * 2; // default inner bubble size
  const baseIcon = 38 * 2; // default icon size
  const outer = Math.round(baseOuter * scale); // scaled outer bubble
  const inner = Math.round(baseInner * scale); // scaled inner bubble
  const icon = Math.round(baseIcon * scale); // scaled icon size
  return {
    outer,
    inner,
    icon,
    offset: Math.round(outer * 0.14), // lift the marker slightly above its anchor
  };
};

/**
 * Parking enforcement marker icon: soft circular badge with the exclamation glyph.
 * Styled to match the alert variant but in a calmer color.
 */
export const ParkingEnforcementIcon: React.FC<Props> = ({ size = 28 }) => {
  const innerSize = Math.round(size * 0.55);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eab575ff', // warm, less obtrusive orange
        borderRadius: '50%',
        boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
      }}
      aria-label="Parking enforcement officer"
      role="img"
    >
      <SightingIcon size={innerSize} color="#8e5633ff" />
    </div>
  );
};
