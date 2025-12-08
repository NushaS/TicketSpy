import React from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import { TicketIcon2 } from '@/components/ui/icons/ticket-icon';
import { SightingIcon } from '@/components/ui/icons/sighting-icon';
import { HeartIcon } from '@/components/ui/icons/heart-icon';
import { CarIcon2 } from '@/components/ui/icons/car-icon';
import styles from '@/app/page.module.css';

type PinActionPopupProps = {
  isLoggedIn: boolean;
  pinLocation: { lat: number; lng: number } | null;
  onClose: () => void;
  onReportTicket: (loc: { lat: number; lng: number } | null) => void;
  onReportEnforcement: (loc: { lat: number; lng: number } | null) => void;
  onBookmark: (loc: { lat: number; lng: number } | null) => void;
  onStartParking: () => void;
  router: ReturnType<typeof import('next/navigation').useRouter>;
};

export const PinActionPopup: React.FC<PinActionPopupProps> = ({
  isLoggedIn,
  pinLocation,
  onClose,
  onReportTicket,
  onReportEnforcement,
  onBookmark,
  onStartParking,
  router,
}) => {
  if (!pinLocation) return null;

  if (isLoggedIn) {
    return (
      <div className={styles.pinPopupWrapper}>
        <div className={styles.authOptionsContent}>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes size={22} />
          </button>

          <div className={styles.actionButtons}>
            <button
              className={styles.reportTicketButton}
              onClick={() => onReportTicket(pinLocation)}
            >
              <TicketIcon2 />
              <span>report a ticket</span>
            </button>

            <button
              className={styles.reportEnforcementButton}
              onClick={() => onReportEnforcement(pinLocation)}
            >
              <SightingIcon />
              report parking enforcement nearby
            </button>

            <button className={styles.bookmarkButton} onClick={() => onBookmark(pinLocation)}>
              <HeartIcon color="white" />
              <span>bookmark this spot</span>
            </button>

            <button className={styles.parkingSessionButton} onClick={onStartParking}>
              <CarIcon2 size={46} />
              <span>just parked here</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pinPopupWrapper}>
      <div className={styles.unauthInstructionsContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <FaTimes size={22} />
        </button>

        <div className={styles.actionButtons}>
          <button className={styles.reportTicketButton} onClick={() => onReportTicket(pinLocation)}>
            <TicketIcon2 />
            <span>report a ticket</span>
          </button>
          <button
            className={styles.reportEnforcementButton}
            onClick={() => onReportEnforcement(pinLocation)}
          >
            <SightingIcon />
            report parking enforcement nearby
          </button>
        </div>

        <div className={styles.instructionsText}>
          <p>
            to <strong>mark where you parked</strong>, get{' '}
            <strong>notifications for tickets issued</strong> or{' '}
            <strong>parking enforcement spotted</strong> near your important locations, and{' '}
            <strong>bookmark your favorite parking spots:</strong>
          </p>
        </div>

        <div className={styles.authButtons}>
          <Link href="/auth/sign-up">
            <button className={styles.createAccountBtn}>create an account</button>
          </Link>
          <span className={styles.orText}>or</span>
          <button
            onClick={() => {
              onClose();
              router.push('/auth/login');
            }}
            className={styles.logInBtn}
          >
            log in
          </button>
        </div>
      </div>
    </div>
  );
};
