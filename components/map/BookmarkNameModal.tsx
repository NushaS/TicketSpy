import React from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import styles from '@/app/page.module.css';

type BookmarkNameModalProps = {
  isOpen: boolean;
  name: string;
  onNameChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

const BookmarkNameModal: React.FC<BookmarkNameModalProps> = ({
  isOpen,
  name,
  onNameChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.ticketReportModalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FaTimes size={22} />
        </button>

        <h3 className={styles.ticketReportTitle}>bookmark this spot</h3>

        <form
          className={styles.ticketReportForm}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className={styles.ticketReportFormGroup}>
            <label className={styles.ticketReportLabel} htmlFor="bookmarkName">
              Bookmark name:
            </label>
            <input
              id="bookmarkName"
              type="text"
              className={styles.ticketReportInput}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Home, Work, Favorite spot"
              required
            />
          </div>
          <span className={styles.linkToProfileText}>
            To receive notifications for events near this spot, ensure that{' '}
            <a href="profile-settings/" className={styles.profileLink}>
              notifications are enabled
            </a>{' '}
            .
          </span>
          <button className={styles.ticketReportSubmitButton} disabled={isSubmitting} type="submit">
            <FaCheck size={16} />
            {isSubmitting ? 'saving...' : 'save bookmark'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookmarkNameModal;
