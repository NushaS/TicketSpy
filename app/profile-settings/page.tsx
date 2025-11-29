import AccountInfo from '@/components/profile-settings-page/AccountInfo';
import NotificationSettings from '@/components/profile-settings-page/NotificationSettings';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import styles from './profile-settings.module.css';

// page.tsx
export default function ProfilePage() {
  return (
    <>
      <header className={styles.profileHeader}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft className={styles.arrowLeft} />
        </Link>
        <h1 className={styles.headerTitle}>profile settings</h1>
        <div>ticketspy</div>
      </header>
      <div className={styles.profilePage}>
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>notification settings</h2>
          <NotificationSettings />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>my account</h2>
          <div className={styles.sectionContent}>
            <AccountInfo />
          </div>
        </section>
      </div>
    </>
  );
}
