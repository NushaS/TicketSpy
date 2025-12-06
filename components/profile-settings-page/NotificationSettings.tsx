'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/profile-settings/profile-settings.module.css';
import ToggleSwitch from '../ui/toggle-switch';
import { createClient } from '@/lib/supabase/client';
import { useUserProfileDetails } from '@/lib/hooks/useUsersTable';
import Slider from '@mui/material/Slider';

export default function NotificationSettings() {
  const [userId, setUserId] = useState<string | null>(null);

  // Local toggle state (controlled by user interactions)
  const [enabledParking, setEnabledParking] = useState<boolean>(false);
  const [enabledBookmarked, setEnabledBookmarked] = useState<boolean>(false);

  // UI feedback
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // notification distance (miles)
  const [distanceMiles, setDistanceMiles] = useState<number>(0.5);

  // get userId from supabase session
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;
        setUserId(user?.id ?? null);
      } catch (err) {
        // ignore - unauthenticated
        setUserId(null);
      }
    };
    loadUser();
  }, []);

  // use hook to fetch profile details
  const { data: userData, isLoading: loadingProfile, refetch } = useUserProfileDetails(userId);

  // when the profile data arrives, populate local toggle state
  useEffect(() => {
    if (!userData) return;
    // fall back to false if null
    setEnabledParking(Boolean(userData.parking_notifications_on));
    setEnabledBookmarked(Boolean(userData.bookmark_notifications_on));
    // Use backend value if present; otherwise keep the local value or default
    if (typeof userData.notification_distance_miles === 'number') {
      setDistanceMiles(Number(userData.notification_distance_miles));
    }
  }, [userData]);

  // load distance from localStorage if present (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notification_distance_miles');
      if (stored) setDistanceMiles(Number(stored));
    } catch (err) {
      // ignore errors (e.g., server-side render or restricted storage)
    }
  }, []);

  async function persistDirectSupabase(newVals: {
    parking: boolean;
    bookmark: boolean;
    distanceMiles?: number;
  }) {
    if (!userId) {
      setError('Not authenticated');
      return false;
    }

    setError(null);
    setLoadingSave(true);

    try {
      const res = await fetch('/api/update-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          parking: newVals.parking,
          bookmark: newVals.bookmark,
          notification_distance_miles: newVals.distanceMiles,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save');

      await refetch();
      setSaveMessage('saved!');
      setTimeout(() => setSaveMessage(null), 2000);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      return false;
    } finally {
      setLoadingSave(false);
    }
  }

  // call this when either toggle changes; it optimistically updates UI then persists.
  const handleToggle = async (which: 'parking' | 'bookmark', value: boolean) => {
    // snapshot for rollback
    const prevParking = enabledParking;
    const prevBookmark = enabledBookmarked;

    // optimistic update
    if (which === 'parking') setEnabledParking(value);
    else setEnabledBookmarked(value);

    const ok = await persistDirectSupabase({
      parking: which === 'parking' ? value : prevParking,
      bookmark: which === 'bookmark' ? value : prevBookmark,
      distanceMiles,
    });

    if (!ok) {
      // rollback on failure
      setEnabledParking(prevParking);
      setEnabledBookmarked(prevBookmark);
    }
  };

  if (loadingProfile) {
    return (
      <div className={styles.sectionContent}>
        <p>Loading notification settings…</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionContent}>
      <div className={styles.notificationSettingGroup}>
        <div>
          <h3 className={styles.notificationHeading}>Events near my parking spot</h3>
          <div className={styles.notificationContent}>
            <span>
              Notify me when parking enforcement is sighted or a parking ticket is issued within{' '}
              <span className={styles.mileRadius}>{distanceMiles.toFixed(2)}</span> miles of my
              parking location.
            </span>
            <ToggleSwitch
              checked={enabledParking}
              onCheckedChange={(val) => handleToggle('parking', Boolean(val))}
            />
          </div>
        </div>

        <div>
          <h3 className={styles.notificationHeading}>Events near my bookmarked locations</h3>
          <div className={styles.notificationContent}>
            <span>
              Notify me when parking enforcement is sighted or a parking ticket is issued within{' '}
              <span className={styles.mileRadius}>{distanceMiles.toFixed(2)}</span> miles of a
              bookmarked location.
            </span>
            <ToggleSwitch
              checked={enabledBookmarked}
              onCheckedChange={(val) => handleToggle('bookmark', Boolean(val))}
            />
          </div>
        </div>

        <div>
          <h3 className={styles.notificationHeading}> Notification radius</h3>
          <div className={styles.notificationContent}>
            <div style={{ marginBottom: 8 }}>
              {' '}
              Receive notifications about events (parking enforcement sighting or parking ticket
              issued) within {distanceMiles.toFixed(2)} miles of your parking location and/or
              bookmarked locations
            </div>
            <Slider
              value={distanceMiles}
              onChange={(e, val) => setDistanceMiles(Number(val))}
              onChangeCommitted={async (e, val) => {
                try {
                  const chosen = Number(val);
                  localStorage.setItem('notification_distance_miles', String(chosen));
                  const ok = await persistDirectSupabase({
                    parking: enabledParking,
                    bookmark: enabledBookmarked,
                    distanceMiles: chosen,
                  });
                  if (ok) {
                    setSaveMessage('distance saved!');
                    setTimeout(() => setSaveMessage(null), 2000);
                  }
                } catch {
                  /* ignore */
                }
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Number(value).toFixed(2)} mi`}
              step={0.05}
              marks={[
                { value: 0.25, label: '0.25' },
                { value: 0.5, label: '0.5' },
                { value: 0.75, label: '0.75' },
                { value: 1, label: '1.0' },
                { value: 1.25, label: '1.25' },
                { value: 1.5, label: '1.5' },
                { value: 1.75, label: '1.75' },
                { value: 2, label: '2.0' },
              ]}
              min={0.05}
              max={2}
              aria-label="Mile distance"
              sx={{
                color: '#6b856b',
                height: 12,
                '& .MuiSlider-rail': {
                  opacity: 1,
                  background: '#e9ecef',
                },
                '& .MuiSlider-track': {
                  border: 'none',
                  background: 'linear-gradient(90deg, #6b856b 0%, #7f9d7f 100%)',
                },
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  backgroundColor: '#fff',
                  boxShadow: '0 6px 18px rgba(16,24,40,0.22)',
                  border: '2px solid #6b856b',
                  '&:focus, &:hover, &.Mui-active': {
                    boxShadow: '0 8px 22px rgba(16,24,40,0.28)',
                  },
                },
                '& .MuiSlider-mark': {
                  height: 7,
                  width: 3,
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: '#6b856b',
                  opacity: 0.9,
                },
                '& .MuiSlider-markLabel': {
                  color: '#555',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#fff',
                  color: '#2f3c2f',
                  border: '1px solid #6b856b',
                  borderRadius: 10,
                  boxShadow: '0 8px 16px rgba(16,24,40,0.18)',
                  fontWeight: 700,
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.messageContainer}>
        {error ? (
          <p className={styles.accountError}>Error: {error}</p>
        ) : saveMessage ? (
          <p className={styles.successMessage}>{saveMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
