import * as React from 'react';
import { SightingIcon } from './sighting-icon';

type Props = {
  size?: number;
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
