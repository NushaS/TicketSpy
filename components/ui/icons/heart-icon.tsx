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
    style={{ filter: 'drop-shadow(0 8px 18px rgba(16, 24, 40, 0.32))' }}
  >
    <path
      d="M12 21s-6.8-4.9-9.4-10.3C1 6 3.5 2.8 7.3 3c2.2 0.1 3.8 1.3 4.7 2.8 0.9-1.5 2.5-2.7 4.7-2.8C20.5 2.8 23 6 21.4 10.7 18.8 16.1 12 21 12 21Z"
      fill={color}
    />
  </svg>
);

export const HeartIcon2: React.FC = () => (
  <svg width="26" height="36" viewBox="0 0 22 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.5 0C5.14214 0 0 5.008 0 11.2C0 19.6 11.5 32 11.5 32C11.5 32 23 19.6 23 11.2C23 5.008 17.8579 0 11.5 0Z"
      fill="#B08374"
    />
    <path
      d="M11.5 18C11.5 18 7.71898 15.2791 6.27329 12.2806C5.38364 9.67077 6.77372 7.89387 8.88665 8.00493C10.1099 8.06045 10.9996 8.72679 11.5 9.55972C12.0004 8.72679 12.8901 8.06045 14.1134 8.00493C16.2263 7.89387 17.6164 9.67077 16.7267 12.2806C15.281 15.2791 11.5 18 11.5 18Z"
      fill="white"
    />
  </svg>
);

/**
 * Usage example:
 *   <HeartIcon size={24} color="#63705B" />
 */
