import React from 'react';
import { Check, X } from 'lucide-react';
import styles from '@/app/page.module.css';
import { ViolationType, violationEnumToUserLabels } from '@/lib/enums/ticketViolationType';

type TicketReportModalProps = {
  isOpen: boolean;
  ticketDateIssued: string;
  ticketTimeIssued: string;
  ticketViolationType: ViolationType;
  onClose: () => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onViolationChange: (value: ViolationType) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBookmarkClick?: () => void;
};

const TicketReportModal: React.FC<TicketReportModalProps> = ({
  isOpen,
  ticketDateIssued,
  ticketTimeIssued,
  ticketViolationType,
  onClose,
  onDateChange,
  onTimeChange,
  onViolationChange,
  onSubmit,
  onBookmarkClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.ticketReportModalContent}>
        <button onClick={onClose} className={styles.ticketReportCloseButton}>
          <X size={24} />
        </button>

        <h2 className={styles.ticketReportTitle}>Report a ticket:</h2>

        <form onSubmit={onSubmit} className={styles.ticketReportForm}>
          <div className={styles.ticketReportFormGroup}>
            <label className={styles.ticketReportLabel}>Date issued:</label>
            <input
              type="date"
              className={styles.ticketReportInput}
              value={ticketDateIssued}
              onChange={(e) => onDateChange(e.target.value)}
              required
            />
          </div>

          <div className={styles.ticketReportFormGroup}>
            <label className={styles.ticketReportLabel}>Time issued:</label>
            <input
              type="time"
              className={styles.ticketReportInput}
              value={ticketTimeIssued}
              onChange={(e) => onTimeChange(e.target.value)}
              required
            />
          </div>
          <div className={styles.ticketReportFormGroup}>
            <label className={styles.ticketReportLabel}>Violation type:</label>
            <select
              className={styles.ticketReportInput}
              value={ticketViolationType}
              onChange={(e) => {
                const val = e.target.value as keyof typeof ViolationType;
                onViolationChange(ViolationType[val]);
              }}
              required
            >
              {Object.values(ViolationType).map((type) => (
                <option key={type} value={type}>
                  {violationEnumToUserLabels[type]}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.ticketReportSubmitButton}>
            <Check size={20} />
            <span>Submit ticket report</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketReportModal;
