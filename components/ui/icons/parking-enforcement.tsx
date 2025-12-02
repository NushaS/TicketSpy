import * as React from 'react';

type Props = {
  size?: number;
};

/**
 * Parking enforcement officer icon: simplified badge + cap.
 */
export const ParkingEnforcementIcon: React.FC<Props> = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Parking enforcement officer"
  >
    <path
      d="M18 20c0-4.418 5.82-8 14-8s14 3.582 14 8v4H18v-4Z"
      fill="#0f172a"
      stroke="#0f172a"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M22 26.5c0-1.933 1.79-3.5 4-3.5h12c2.21 0 4 1.567 4 3.5 0 8.008-3.582 15.5-10 15.5s-10-7.492-10-15.5Z"
      fill="#e5e7eb"
      stroke="#0f172a"
      strokeWidth="2.5"
    />
    <circle cx="32" cy="29" r="3" fill="#0f172a" />
    <path
      d="M24 46c2.2-1.6 4.951-2.5 8-2.5s5.8.9 8 2.5"
      stroke="#0f172a"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M18 48c0-3.866 6.268-7 14-7s14 3.134 14 7v6H18v-6Z"
      fill="#1d4ed8"
      stroke="#0f172a"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M32 41c3.038 0 5.5-2.91 5.5-6.5S35.038 28 32 28s-5.5 2.91-5.5 6.5S28.962 41 32 41Z"
      fill="#38bdf8"
      stroke="#0f172a"
      strokeWidth="2"
    />
  </svg>
);
