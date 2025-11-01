/**
 * TicketIcon component
 * Can be used for representing documents, files, or notes
 */

import React from 'react';

// Props for customizing the icon
interface TicketIconProps {
  size?: number; // width & height
  color?: string; // stroke/fill color
  className?: string; // optional extra CSS classes
}

// Document icon
export const TicketIcon: React.FC<TicketIconProps> = ({
  size = 22,
  color = '#AD5C5C',
  className = '',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size * (22 / 16)} // preserve original aspect ratio (16x22)
    viewBox="0 0 16 22"
    fill="white"
    className={className}
  >
    <rect x="0.4" y="0.4" width="15.2" height="20.7385" rx="1.6" stroke={color} strokeWidth="0.8" />
    <rect
      x="2.65635"
      y="2.04102"
      width="10.6872"
      height="10.2769"
      rx="1.6"
      stroke={color}
      strokeWidth="0.8"
    />
    <line x1="1.84619" y1="15.1897" x2="14.1539" y2="15.1897" stroke={color} strokeWidth="0.8" />
    <line x1="1.84619" y1="18.4719" x2="14.1539" y2="18.4719" stroke={color} strokeWidth="0.8" />
    <path
      d="M5.73867 4.07C6.01867 4.01667 6.32534 3.97667 6.65867 3.95C6.99867 3.91667 7.33534 3.9 7.66867 3.9C8.01534 3.9 8.36201 3.93 8.70867 3.99C9.06201 4.04333 9.37867 4.15667 9.65867 4.33C9.93867 4.49667 10.1653 4.73333 10.3387 5.04C10.5187 5.34 10.6087 5.73333 10.6087 6.22C10.6087 6.66 10.532 7.03333 10.3787 7.34C10.2253 7.64 10.022 7.88667 9.76867 8.08C9.51534 8.27333 9.22534 8.41333 8.89867 8.5C8.57867 8.58667 8.24534 8.63 7.89867 8.63C7.86534 8.63 7.81201 8.63 7.73867 8.63C7.66534 8.63 7.58867 8.63 7.50867 8.63C7.42867 8.62333 7.34867 8.61667 7.26867 8.61C7.19534 8.60333 7.14201 8.59667 7.10867 8.59V11H5.73867V4.07ZM7.77867 5.08C7.64534 5.08 7.51867 5.08667 7.39867 5.1C7.27867 5.10667 7.18201 5.11667 7.10867 5.13V7.4C7.13534 7.40667 7.17534 7.41333 7.22867 7.42C7.28201 7.42667 7.33867 7.43333 7.39867 7.44C7.45867 7.44 7.51534 7.44 7.56867 7.44C7.62867 7.44 7.67201 7.44 7.69867 7.44C7.87867 7.44 8.05534 7.42333 8.22867 7.39C8.40867 7.35667 8.56867 7.29667 8.70867 7.21C8.84867 7.11667 8.95867 6.99 9.03867 6.83C9.12534 6.67 9.16867 6.46 9.16867 6.2C9.16867 5.98 9.12867 5.8 9.04867 5.66C8.96867 5.51333 8.86201 5.39667 8.72867 5.31C8.60201 5.22333 8.45534 5.16333 8.28867 5.13C8.12201 5.09667 7.95201 5.08 7.77867 5.08Z"
      fill={color}
    />
  </svg>
);

/** Usage example:
 *   <DocumentIcon size={24} color="#AD5C5C" />
 */
