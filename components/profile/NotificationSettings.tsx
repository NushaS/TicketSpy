'use client';

import { useState } from 'react';
import styles from '@/app/profile/profile.module.css';
import ToggleSwitch from '../ui/toggle-switch';

export default function NotificationSettings() {
  const [enabledParking, setEnabledParking] = useState(false);
  const [enabledBookmarked, setEnabledBookmarked] = useState(false);

  return (
    <div className={styles.sectionContent}>
      <div>
        <h3 className={styles.notificationHeading}>Events near my parking spot</h3>
        <div className={styles.notificationContent}>
          Notify me when parking enforcement is sighted or a ticket is issued within 0.5 miles of my
          parking location.
          <ToggleSwitch checked={enabledParking} onCheckedChange={setEnabledParking} />
        </div>
      </div>

      <div>
        <h3 className={styles.notificationHeading}>Events near my bookmarked locations</h3>
        <div className={styles.notificationContent}>
          Notify me when parking enforcement is sighted or a ticket is issued within 0.5 miles of a
          bookmarked location.
          <ToggleSwitch checked={enabledBookmarked} onCheckedChange={setEnabledBookmarked} />
        </div>
      </div>
    </div>
  );
}
