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
  size = 15,
  color = '#63705B',
  className = '',
}) => (
  <svg
    xmlns="xhttp://www.w3.org/2000/svg"
    width={size}
    height={(size * 13) / 15} // keeps original aspect ratio 15x13
    viewBox="0 0 15 13"
    fill="none"
    className={className}
  >
    <path
      d="M13.6647 1.14171C13.3029 0.779755 12.8733 0.492626 12.4005 0.296728C11.9278 0.100829 11.421 0 10.9092 0C10.3975 0 9.89074 0.100829 9.41795 0.296728C8.94517 0.492626 8.51562 0.779755 8.15383 1.14171L7.403 1.89254L6.65216 1.14171C5.92138 0.410928 4.93023 0.00037879 3.89675 0.000378797C2.86327 0.000378805 1.87211 0.410928 1.14133 1.14171C0.410549 1.87249 7.70004e-09 2.86364 0 3.89713C-7.70004e-09 4.93061 0.410549 5.92176 1.14133 6.65254L7.403 12.9142L13.6647 6.65254C14.0266 6.29076 14.3137 5.8612 14.5096 5.38842C14.7055 4.91564 14.8064 4.40889 14.8064 3.89713C14.8064 3.38536 14.7055 2.87862 14.5096 2.40583C14.3137 1.93305 14.0266 1.5035 13.6647 1.14171Z"
      fill={color}
    />
  </svg>
);

/**
 * Usage example:
 *   <HeartIcon size={24} color="#63705B" />
 */
