import ProfileInfo from '@/components/profile/ProfileInfo';
import NotificationSettings from '@/components/profile/NotificationSettings';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../logo.png';
import styles from './profile.module.css';

// page.tsx
export default function ProfilePage() {
  return (
    <>
      <header className={styles.profileHeader}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft className={styles.arrowLeft} />
        </Link>
        <h1 className={styles.headerTitle}>profile settings</h1>
        {/* <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="TicketSpy Logo"
            width={150}
            height={50}
            priority
            className={styles.logo}
          />
        </div> */}
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
            <ProfileInfo />
          </div>
        </section>
      </div>
    </>
  );
}
