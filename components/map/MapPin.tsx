// Defines a reusable MapPin component for rendering a custom icon (like CarIcon or HeartIcon)
// at a specific latitude/longitude on MapLibre map.
'use client';

import React, { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { FaCheck, FaTrash, FaTimes } from 'react-icons/fa';
import { CarIcon2 } from '../ui/icons/car-icon';
import { HeartIcon } from '../ui/icons/heart-icon';
import styles from '@/app/bookmark-and-parking-pins/pins.module.css';

// The expected props for the MapPin component:
interface MapPinProps {
  longitude: number;
  latitude: number;
  icon: React.ReactNode;
  type: 'car' | 'heart';
  id: string;
  userId: string;
  onDelete?: () => void;
  onConvertToParking?: () => void;
  onConvertToBookmark?: () => void;
}

// Renders a single map pin using the Marker component
export const MapPin: React.FC<MapPinProps> = ({
  longitude,
  latitude,
  icon,
  type,
  id,
  userId,
  onDelete,
  onConvertToParking,
  onConvertToBookmark,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showBookmarkActionsModal, setShowBookmarkActionsModal] = useState(false);
  const [showEndParkingModal, setShowEndParkingModal] = useState(false);
  const [showBookmarkConversionModal, setShowBookmarkConversionModal] = useState(false);

  // Deletes bookmark or parking session
  const deletePin = async (pinType: 'car' | 'heart') => {
    // choose api endpoint based on pin type
    const endpoint = pinType === 'car' ? '/api/delete-parking-session' : '/api/delete-bookmark';
    const response = await fetch(`${endpoint}?id=${id}&user_id=${userId}`, { method: 'DELETE' });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Delete failed');
    }
  };

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

  // Convert bookmark -> parking session
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

  // Convert parking -> bookmark
  const handleConvertToBookmark = async () => {
    if (isConverting) return;

    setIsConverting(true);
    try {
      // delete parking session
      await deletePin('car');

      // create a bookmark at same location
      const bookmarkResponse = await fetch('/api/bookmark-location', {
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

      if (!bookmarkResponse.ok) {
        throw new Error('Failed to create bookmark');
      }

      setShowBookmarkConversionModal(false);
      setShowEndParkingModal(false);
      onConvertToBookmark?.();
    } catch (error) {
      console.error('Error converting:', error);
      alert('Failed to convert parking to bookmark. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

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

      {/* Parking Info Modal (only for parking sessions) */}
      {showEndParkingModal && type === 'car' && (
        <div className={styles.modalOverlay} onClick={() => setShowEndParkingModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseButton}
              onClick={() => setShowEndParkingModal(false)}
            >
              <FaTimes size={22} />
            </button>

            <p className={styles.modalBody}>you have a parking session here</p>

            <button
              onClick={() => {
                setShowEndParkingModal(false);
                setShowBookmarkConversionModal(true);
              }}
              className={styles.parkingButtonVariant}
            >
              <CarIcon2 />
              end parking
            </button>
          </div>
        </div>
      )}

      {/* Bookmark Conversion Modal (after ending parking) */}
      {showBookmarkConversionModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBookmarkConversionModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseButton}
              onClick={() => setShowBookmarkConversionModal(false)}
            >
              <FaTimes size={22} />
            </button>

            <span className={styles.modalBodyWithIcon}>
              <HeartIcon size={16} />
              do you want to bookmark this location?
            </span>

            <div className={styles.yesNoButtonGroup}>
              <button onClick={handleDelete} disabled={isDeleting} className={styles.noButton}>
                <FaTimes />
                {isDeleting ? 'ending...' : 'no'}
              </button>

              <button
                onClick={handleConvertToBookmark}
                disabled={isConverting}
                className={styles.yesButton}
              >
                <FaCheck />
                {isConverting ? 'saving...' : 'yes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark Actions Modal (only for bookmarks) */}
      {showBookmarkActionsModal && type === 'heart' && (
        <div className={styles.modalOverlay} onClick={() => setShowBookmarkActionsModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseButton}
              onClick={(e) => {
                setShowBookmarkActionsModal(false);
              }}
            >
              <FaTimes size={22} />
            </button>
            <div className={styles.modalButtonGroup}>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={styles.bookmarkButtonVariant}
              >
                <FaTrash />
                {isDeleting ? 'deleting...' : 'delete bookmark'}
              </button>
              <button
                onClick={handleConvertToParking}
                disabled={isConverting}
                className={styles.parkingButtonVariant}
              >
                <CarIcon2 />
                {isConverting ? 'saving...' : 'just parked here'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
