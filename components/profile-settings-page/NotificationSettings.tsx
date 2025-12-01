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
      setSaveMessage('Saved!');
      setTimeout(() => setSaveMessage(null), 1500);

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
      <div>
        <h3 className={styles.notificationHeading}>Events near my parking spot</h3>
        <div className={styles.notificationContent}>
          Notify me when parking enforcement is sighted or a ticket is issued within{' '}
          {distanceMiles.toFixed(2)} miles of my parking location.
          <ToggleSwitch
            checked={enabledParking}
            onCheckedChange={(val) => handleToggle('parking', Boolean(val))}
          />
        </div>
      </div>

      <div>
        <h3 className={styles.notificationHeading}>Events near my bookmarked locations</h3>
        <div className={styles.notificationContent}>
          Notify me when parking enforcement is sighted or a ticket is issued within{' '}
          {distanceMiles.toFixed(2)} miles of a bookmarked location.
          <ToggleSwitch
            checked={enabledBookmarked}
            onCheckedChange={(val) => handleToggle('bookmark', Boolean(val))}
          />
        </div>
      </div>

      <div>
        <h3 className={styles.notificationHeading}> Notification Slider</h3>
        <div className={styles.notificationContent}>
          <div style={{ marginBottom: 8 }}>Miles — {distanceMiles.toFixed(2)} mi</div>
          <Slider
            value={distanceMiles}
            onChange={(e, val) => setDistanceMiles(Number(val))}
            onChangeCommitted={async (e, val) => {
              // Persist to server and localStorage
              try {
                const chosen = Number(val);
                localStorage.setItem('notification_distance_miles', String(chosen));
                // persist via API
                const ok = await persistDirectSupabase({
                  parking: enabledParking,
                  bookmark: enabledBookmarked,
                  distanceMiles: chosen,
                });
                if (ok) {
                  setSaveMessage('Distance saved');
                  setTimeout(() => setSaveMessage(null), 1500);
                }
              } catch (err) {
                // ignore or display error
              }
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${Number(value).toFixed(2)} mi`}
            step={0.05}
            marks={Array.from({ length: Math.round((2 - 0.05) / 0.05) + 1 }, (_, i) => ({
              value: Number((0.05 * i + 0.05).toFixed(2)),
              label: Number((0.05 * i + 0.05).toFixed(2)).toFixed(2),
            }))}
            min={0.05}
            max={2}
            aria-label="Mile distance"
          />
        </div>
      </div>

      {loadingSave && <p className={styles.smallNote}>saving…</p>}
      {saveMessage && <p className={styles.successMessage}>{saveMessage}</p>}
      {error && <p className={styles.loginError}>{error}</p>}
    </div>
  );
}
