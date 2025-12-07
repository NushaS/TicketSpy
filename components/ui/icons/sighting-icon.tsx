/**
 * SightingIcon component
 * Can be used both on buttons and as a pin/marker on the map
 */

import React from 'react';

interface SightingIconProps {
  size?: number; // overall width
  color?: string; // stroke/fill color
  className?: string; // optional extra CSS classes
}

export const SightingIcon: React.FC<SightingIconProps> = ({
  size = 23,
  color = '#B08374',
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size * (9 / 23)} // preserve SVG aspect ratio (9x23)
    height={size}
    viewBox="0 0 2 23"
    fill="none"
    className={className}
  >
    <mask id="path-1-inside-1_439_130" fill="white">
      <path d="M6.02832 15.5879H2.97168L0 0H9L6.02832 15.5879Z" />
    </mask>
    <path d="M6.02832 15.5879H2.97168L0 0H9L6.02832 15.5879Z" fill="white" />
    <path
      d="M6.02832 15.5879V16.0879H6.44201L6.51947 15.6815L6.02832 15.5879ZM2.97168 15.5879L2.48053 15.6815L2.55799 16.0879H2.97168V15.5879ZM0 0V-0.5H-0.604325L-0.491154 0.0936338L0 0ZM9 0L9.49115 0.0936338L9.60432 -0.5H9V0ZM6.02832 15.5879V15.0879H2.97168V15.5879V16.0879H6.02832V15.5879ZM2.97168 15.5879L3.46283 15.4943L0.491154 -0.0936338L0 0L-0.491154 0.0936338L2.48053 15.6815L2.97168 15.5879ZM0 0V0.5H9V0V-0.5H0V0ZM9 0L8.50885 -0.0936338L5.53717 15.4943L6.02832 15.5879L6.51947 15.6815L9.49115 0.0936338L9 0Z"
      fill={color}
      mask="url(#path-1-inside-1_439_130)"
    />
    <circle cx="4.5" cy="20.5" r="2.25" fill="white" stroke={color} strokeWidth="0.5" />
  </svg>
);

/** Usage example:
 * <TicketIcon size={23} color="#B08374" />
 */
