import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import styles from '@/app/page.module.css';
import confetti from 'canvas-confetti';

type ThankYouModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  title = 'thank you for your report! 🎉',
  message = 'Your sighting will remain on the map to inform other users for the next hour.',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const confettiInstance = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
      confettiInstance({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
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
          <button type="button" className={styles.modalButton} onClick={onClose}>
            <FaCheck size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;
