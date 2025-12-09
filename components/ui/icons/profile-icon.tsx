/**
 * UserIcon component
 * Filled version to match TicketSpy's design system
 */

import React from 'react';

// Props for customizing size, color, etc.
interface ProfileIconProps {
  size?: number; // overall width
  color?: string; // fill color
  className?: string;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  size = 36,
  color = '#B08374',
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={(size * 52) / 38} // maintain the 36x47 ratio
    viewBox="0 0 38 40"
    fill="currentColor"
    className={className}
    style={{ color, filter: 'drop-shadow(0 2px 6px rgba(15, 23, 42, 0.18))' }}
  >
    <path
      d="M27.636 10C27.636 15.5228 23.1588 20 17.636 20C12.1131 20 7.63599 15.5228 7.63599 10C7.63599 4.47715 12.1131 0 17.636 0C23.1588 0 27.636 4.47715 27.636 10Z"
      fill="currentColor"
    />
    <path
      d="M17.7961 23.1923C25.1911 23.1925 31.6598 29.2868 35.1969 38.3883C36.7686 42.4327 33.422 46.3847 29.083 46.3847H6.50829C2.1693 46.3847 -1.17731 42.4327 0.394485 38.3884C3.93179 29.2867 10.401 23.1923 17.7961 23.1923Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Usage example:
 *   <ProfileIcon size={32} color="#865858" />
 */
