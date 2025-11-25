// Defines a reusable MapPin component for rendering a custom icon (like CarIcon or HeartIcon)
// at a specific latitude/longitude on MapLibre map.
'use client';

import React, { useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { X, Trash2 } from 'lucide-react';

// The expected props for the MapPin component:
interface MapPinProps {
  longitude: number;
  latitude: number;
  icon: React.ReactNode;
  type: 'car' | 'heart';
  id: string;
  userId: string;
  onDelete?: () => void;
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
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const endpoint = type === 'car' ? '/api/delete-parking-session' : '/api/delete-bookmark';

      const response = await fetch(`${endpoint}?id=${id}&user_id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteModal(false);
        onDelete?.();
      } else {
        const result = await response.json();
        console.error('Delete failed:', result.error);
        alert('Failed to delete item. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Marker longitude={longitude} latitude={latitude} anchor="bottom">
        <div
          style={{
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            opacity: isDeleting ? 0.5 : 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          title={`Click to delete ${type === 'car' ? 'parking location' : 'bookmark'}`}
        >
          {icon}
        </div>
      </Marker>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                }}
              >
                Delete {type === 'car' ? 'Parking Location' : 'Bookmark'}
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  color: '#6b7280',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p
              style={{
                margin: '0 0 20px 0',
                fontSize: '14px',
                color: '#4b5563',
                lineHeight: '1.5',
              }}
            >
              Are you sure you want to delete this{' '}
              {type === 'car' ? 'parking location' : 'bookmark'}? This action cannot be undone.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: isDeleting ? '#9ca3af' : '#dc2626',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Trash2 size={16} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
