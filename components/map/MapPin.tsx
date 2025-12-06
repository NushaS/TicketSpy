// Defines a reusable MapPin component for rendering a custom icon (like CarIcon or HeartIcon)
// at a specific latitude/longitude on MapLibre map.
'use client';

import React, { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { FaCheck, FaTrash, FaTimes } from 'react-icons/fa';
import { CarIcon2 } from '../ui/icons/car-icon';
import { HeartIcon } from '../ui/icons/heart-icon';
import styles from '@/app/bookmark-and-parking-pins/pins.module.css';

type ParkingInfoModalProps = {
  open: boolean;
  onClose: () => void;
  onEndParking: () => void;
};

// Modal that prompts to end an active parking session.
const ParkingInfoModal: React.FC<ParkingInfoModalProps> = ({ open, onClose, onEndParking }) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          <FaTimes size={22} />
        </button>

        <p className={styles.modalBody}>you have a parking session here</p>

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
const BookmarkConversionModal: React.FC<BookmarkConversionModalProps> = ({
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
const BookmarkActionsModal: React.FC<BookmarkActionsModalProps> = ({
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

// The expected props for the MapPin component:
interface MapPinProps {
  longitude: number;
  latitude: number;
  icon: React.ReactNode;
  type: 'car' | 'heart';
  id: string;
  userId: string;
  bookmarkName?: string | null;
  onDelete?: () => void;
  onConvertToParking?: () => void;
  onConvertToBookmark?: () => void;
  onRequestNamedBookmark?: (location: { lat: number; lng: number }) => void;
}

// Renders a single map pin using the Marker component
export const MapPin: React.FC<MapPinProps> = ({
  longitude,
  latitude,
  icon,
  type,
  id,
  userId,
  bookmarkName,
  onDelete,
  onConvertToParking,
  onConvertToBookmark,
  onRequestNamedBookmark,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showBookmarkActionsModal, setShowBookmarkActionsModal] = useState(false);
  const [showEndParkingModal, setShowEndParkingModal] = useState(false);
  const [showBookmarkConversionModal, setShowBookmarkConversionModal] = useState(false);

  // Deletes bookmark or parking session.
  const deletePin = async (pinType: 'car' | 'heart') => {
    // choose api endpoint based on pin type
    const endpoint = pinType === 'car' ? '/api/delete-parking-session' : '/api/delete-bookmark';
    const response = await fetch(`${endpoint}?id=${id}&user_id=${userId}`, { method: 'DELETE' });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Delete failed');
    }
  };

  // Handles delete click for whichever pin type is active.
  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deletePin(type); // uses the new helper
      setShowBookmarkActionsModal(false);
      setShowBookmarkConversionModal(false);
      setShowEndParkingModal(false);
      onDelete?.();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Convert bookmark -> parking session.
  const handleConvertToParking = async () => {
    if (isConverting) return;

    setIsConverting(true);
    try {
      // delete bookmark
      await deletePin('heart');
      // create parking session at same location
      const parkingResponse = await fetch('/api/new-parking-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          longitude,
          latitude,
        }),
      });

      if (!parkingResponse.ok) {
        throw new Error('Failed to create parking session');
      }

      setShowBookmarkActionsModal(false);
      onConvertToParking?.();
    } catch (error) {
      console.error('Error converting:', error);
      alert('Failed to convert bookmark to parking. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  // Convert parking -> bookmark.
  const handleConvertToBookmark = async () => {
    if (isConverting) return;

    setIsConverting(true);
    try {
      // delete parking session
      await deletePin('car');

      setShowBookmarkConversionModal(false);
      setShowEndParkingModal(false);
      onRequestNamedBookmark?.({ lat: latitude, lng: longitude });
      onConvertToBookmark?.(); // notify parent to refresh pins
    } catch (error) {
      console.error('Error converting:', error);
      alert('Failed to convert parking to bookmark. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  // Decide which modal to show when a pin is clicked.
  const handlePinClick = () => {
    if (type === 'heart') {
      // for bookmarks, show bookmark action options (delete or park)
      setShowBookmarkActionsModal(true);
    } else {
      // for parking sessions, give option to end the parking session
      setShowEndParkingModal(true);
    }
  };

  return (
    <>
      <Marker longitude={longitude} latitude={latitude} anchor="bottom">
        <div
          className={`${styles.markerWrapper} ${isDeleting || isConverting ? styles.disabled : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handlePinClick();
          }}
          title={`Click to ${type === 'car' ? 'end parking session' : 'manage bookmark'}`}
        >
          {icon}
        </div>
      </Marker>

      <ParkingInfoModal
        open={showEndParkingModal && type === 'car'}
        onClose={() => setShowEndParkingModal(false)}
        onEndParking={() => {
          setShowEndParkingModal(false);
          setShowBookmarkConversionModal(true);
        }}
      />

      <BookmarkConversionModal
        open={showBookmarkConversionModal}
        onClose={() => setShowBookmarkConversionModal(false)}
        onDelete={handleDelete}
        onConvertToBookmark={handleConvertToBookmark}
        onRequestNamedBookmark={
          onRequestNamedBookmark
            ? () => onRequestNamedBookmark({ lat: latitude, lng: longitude })
            : undefined
        }
        isDeleting={isDeleting}
        isConverting={isConverting}
      />

      <BookmarkActionsModal
        open={showBookmarkActionsModal && type === 'heart'}
        onClose={() => setShowBookmarkActionsModal(false)}
        onDelete={handleDelete}
        onConvertToParking={handleConvertToParking}
        isDeleting={isDeleting}
        isConverting={isConverting}
        bookmarkName={bookmarkName}
      />
    </>
  );
};
