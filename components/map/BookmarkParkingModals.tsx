import React from 'react';
import { FaCheck, FaTrash, FaTimes } from 'react-icons/fa';
import { CarIcon2 } from '../ui/icons/car-icon';
import { HeartIcon } from '../ui/icons/heart-icon';
import styles from '@/app/bookmark-and-parking-pins/pins.module.css';

type ParkingInfoModalProps = {
  open: boolean;
  startTime?: string | null;
  onClose: () => void;
  onEndParking: () => void;
};

// Modal that prompts to end an active parking session.
export const ParkingInfoModal: React.FC<ParkingInfoModalProps> = ({
  open,
  startTime,
  onClose,
  onEndParking,
}) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          <FaTimes size={22} />
        </button>

        <p className={styles.modalBody}>
          {startTime ? (
            <>
              you parked here at
              <span>
                {' '}
                {new Date(startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
              </span>
              on
              <span> {new Date(startTime).toLocaleDateString()}</span>
            </>
          ) : (
            <>you have a parking session here.</>
          )}
        </p>

        <button onClick={onEndParking} className={styles.parkingButtonVariant}>
          <CarIcon2 />
          end parking
        </button>
      </div>
    </div>
  );
};

type BookmarkConversionModalProps = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onConvertToBookmark: () => void;
  onRequestNamedBookmark?: () => void;
  isDeleting: boolean;
  isConverting: boolean;
};

// Modal shown after ending parking to confirm making a bookmark.
export const BookmarkConversionModal: React.FC<BookmarkConversionModalProps> = ({
  open,
  onClose,
  onDelete,
  onConvertToBookmark,
  onRequestNamedBookmark,
  isDeleting,
  isConverting,
}) => {
  if (!open) return null;

  const handleRequestNamedBookmark = () => {
    onClose();
    onRequestNamedBookmark?.();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          <FaTimes size={22} />
        </button>

        <button
          type="button"
          className={styles.modalBodyWithIcon}
          onClick={handleRequestNamedBookmark}
          style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
        >
          <HeartIcon size={16} />
          do you want to bookmark this location?
        </button>

        <div className={styles.yesNoButtonGroup}>
          <button onClick={onDelete} disabled={isDeleting} className={styles.noButton}>
            <FaTimes />
            {isDeleting ? 'ending...' : 'no'}
          </button>

          <button
            onClick={onConvertToBookmark}
            disabled={isConverting}
            className={styles.yesButton}
          >
            <FaCheck />
            {isConverting ? 'saving...' : 'yes'}
          </button>
        </div>
      </div>
    </div>
  );
};

type BookmarkActionsModalProps = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onConvertToParking: () => void;
  isDeleting: boolean;
  isConverting: boolean;
  bookmarkName?: string | null;
};

// Modal with actions available for a bookmark pin.
export const BookmarkActionsModal: React.FC<BookmarkActionsModalProps> = ({
  open,
  onClose,
  onDelete,
  onConvertToParking,
  isDeleting,
  isConverting,
  bookmarkName,
}) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          <FaTimes size={22} />
        </button>
        {bookmarkName && (
          <h2 className={styles.modalBody} style={{ fontSize: '2.6rem' }}>
            {bookmarkName}
          </h2>
        )}
        <div className={styles.modalButtonGroup}>
          <button onClick={onDelete} disabled={isDeleting} className={styles.bookmarkButtonVariant}>
            <FaTrash />
            {isDeleting ? 'deleting...' : 'delete bookmark'}
          </button>
          <button
            onClick={onConvertToParking}
            disabled={isConverting}
            className={styles.parkingButtonVariant}
          >
            <CarIcon2 />
            {isConverting ? 'saving...' : 'just parked here'}
          </button>
        </div>
      </div>
    </div>
  );
};
