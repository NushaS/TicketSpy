/**
 * OfficerIcon component
 * Can be used for representing a user or officer
 */

import React from 'react';

// Props for customizing the icon
interface OfficerIconProps {
  size?: number; // width & height base
  color?: string; // stroke color
  className?: string; // optional extra CSS classes
}

// Officer icon
export const OfficerIcon: React.FC<OfficerIconProps> = ({
  size = 22,
  color = '#B08374',
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size * (23 / 19)} // preserve aspect ratio 19x23
    viewBox="0 0 19 23"
    fill="none"
    className={className}
  >
    {/* Head */}
    <path
      d="M9.38843 3.17792C12.2821 3.17815 14.6277 5.52443 14.6277 8.41815C14.6275 11.3117 12.282 13.6572 9.38843 13.6574C6.4947 13.6574 4.14842 11.3118 4.14819 8.41815C4.14819 5.52429 6.49456 3.17792 9.38843 3.17792Z"
      fill="white"
      stroke={color}
      strokeWidth="0.75"
    />

    {/* Body */}
    <path
      d="M9.50049 15C13.4547 15.0001 16.9066 16.9728 18.7579 19.9059C19.4676 21.0305 18.5181 22.3193 17.1883 22.3193H1.81169C0.481883 22.3193 -0.467623 21.0305 0.242168 19.906C2.09358 16.9727 5.54612 15 9.50049 15Z"
      fill="white"
      stroke={color}
      strokeWidth="0.75"
    />

    {/* Hat */}
    <path
      d="M9.36646 0.25C10.9727 0.242149 12.503 0.416618 13.8958 0.733398V5.49121C12.5034 5.18607 10.985 5.02056 9.39673 5.02832C7.79975 5.03615 6.2754 5.21798 4.88013 5.54004V0.768555C6.25951 0.443612 7.77451 0.257833 9.36646 0.25Z"
      fill="white"
      stroke={color}
      strokeWidth="0.75"
    />
  </svg>
);

/** Usage example:
 *   <OfficerIcon size={24} color="#B08374" />
 */
