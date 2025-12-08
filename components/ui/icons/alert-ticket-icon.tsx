import React from 'react';
import { TicketIcon2 } from './ticket-icon';

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
