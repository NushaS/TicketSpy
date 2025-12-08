import React from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import styles from '@/app/page.module.css';

type InstructionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>how to use ticketspy</h2>
          <button
            type="button"
            aria-label="Close instructions"
            onClick={onClose}
            className={styles.modalCloseBtn}
          >
            <FaTimes size={22} />
          </button>
        </header>

        <div className={styles.modalBody}>
          <section>
            <h3>Heatmap overview</h3>
            <p>This map displays a heatmap of parking ticket density based on real user reports.</p>
          </section>

          <section>
            <h3>Reporting a parking ticket you received</h3>
            <ol>
              <li>
                1. Click the location on the map where you got the ticket (as close as possible)
              </li>
              <li>
                2. Select <em>“report a ticket”</em>
              </li>
              <li>3. Enter the date and time of the ticket issued, and violation type</li>
              <li>
                4. Click <em>submit</em> and your report will appear on the map!
              </li>
            </ol>
          </section>

          <section>
            <h3>Reporting parking enforcement you spotted</h3>
            <ol>
              <li>1. Click the location where you saw the parking enforcement officer</li>
              <li>
                2. Select <em>“report parking enforcement nearby”</em>
              </li>
              <li>3. Confirm in popup to submit the report</li>
            </ol>
          </section>

          <section>
            <h3>
              Start a parking session + receive notifs for tickets/parking enforcement near your car
            </h3>
            <ol>
              <li>1. Create an account or log in.</li>
              <li>
                2. Select your parking spot on the map and click <em>“i just parked”</em>
              </li>
              <li>3. Open your profile (person icon, upper-right)</li>
              <li>
                4. Enable notifications for tickets and parking enforcement reported within 0.5
                miles of your parking spot (session)
              </li>
              <li>
                5. To end your session: click the car icon → <em>“end parking session”</em>
              </li>
              <li>6. Optionally bookmark the spot when ending a session</li>
            </ol>
          </section>

          <section>
            <h3>
              Bookmark favorite spots + receive notifs for tickets/parking enforcement near your
              bookmarks
            </h3>
            <ol>
              <li>1. Create an account or log in</li>
              <li>
                2. Select a spot and click <em>“bookmark this spot”</em>
              </li>
              <li>3. A heart icon marks the bookmarked spot.</li>
              <li>4. Open your profile (person icon, upper-right)</li>
              <li>
                5. Enable notifications for tickets and parking enforcement reported within 0.5
                miles of your bookmarked spots
              </li>
              <li>
                6. To remove: click the heart icon → <em>“remove bookmark”</em>
              </li>
            </ol>
          </section>
        </div>

        <footer className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={styles.modalButton}>
            <FaCheck size={16} />
            got it!
          </button>
        </footer>
      </div>
    </div>
  );
};
