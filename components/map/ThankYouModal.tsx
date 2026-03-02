import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
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
  title = 'thank you for your report! 🎉',
  message = 'Your sighting will remain on the map to inform other users for the next hour.',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#7ba17b', '#f6c16c', '#f58a7a', '#7ea9d6', '#f4e8c1'];
    const particleCount = 120;
    const durationMs = 1600;
    const start = performance.now();

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      spin: number;
    };

    const particles: Particle[] = [];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4,
        y: canvas.height * 0.6 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 8 - 2,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
      });
    }

    let frameId = 0;

    const draw = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.13;
        p.rotation += p.spin;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1 - progress;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', setCanvasSize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
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
