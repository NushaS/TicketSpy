import styles from '../auth.module.css';
import { LoginForm } from '@/components/login-form';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../logo.png';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className={styles.authLogoCorner}>
        <Link href="/">
          <Image src={logo} alt="TicketSpy logo" className={styles.authLogo} priority />
        </Link>
      </div>
      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className={`${styles.closeButton} ${styles.pageCloseButton}`}
          aria-label="Close"
        >
          <X />
        </Link>
        <h1 className={styles.authHeading}>log in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
