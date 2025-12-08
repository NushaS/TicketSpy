import * as React from 'react';
import { SightingIcon } from './sighting-icon';

type Props = {
  size?: number;
};

// Alert variant: sighting icon centered on a red circular background.
export const AlertParkingEnforcementIcon: React.FC<Props> = ({ size = 45 }) => {
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
    >
      <SightingIcon size={innerSize} color="#ffffff" />
    </div>
  );
};
