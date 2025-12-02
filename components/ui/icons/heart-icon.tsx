/**
 * HeartIcon component
 * Can be used both on buttons and as a pin/marker on the map
 */
import React from 'react';

// Props for customizing the icon
interface HeartIconProps {
  size?: number; // width & height of the icon
  color?: string; // fill color
  className?: string; // optional extra CSS classes
}

// Heart icon
export const HeartIcon: React.FC<HeartIconProps> = ({
  size = 17,
  color = '#63705B',
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 21s-6.8-4.9-9.4-10.3C1 6 3.5 2.8 7.3 3c2.2 0.1 3.8 1.3 4.7 2.8 0.9-1.5 2.5-2.7 4.7-2.8C20.5 2.8 23 6 21.4 10.7 18.8 16.1 12 21 12 21Z"
      fill={color}
    />
  </svg>
);

/**
 * Usage example:
 *   <HeartIcon size={24} color="#63705B" />
 */
