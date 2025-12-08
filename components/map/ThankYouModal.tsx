import React from 'react';
import { X } from 'lucide-react';
import styles from '@/app/page.module.css';

type ThankYouModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  title = 'Thank you for your report! 🎉',
  message = 'Your sighting will remain on the map to inform other users for the next hour.',
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.modalCloseButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        <div className={styles.thankYouModalBody}>
          <h2 className={styles.thankYouModalTitle}>{title}</h2>
          <p className={styles.thankYouModalMessage}>{message}</p>
        </div>
        <div className={styles.modalFooterSpacing}>
          <button type="button" className={styles.ticketReportSubmitButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;
