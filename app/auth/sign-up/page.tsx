import styles from '../auth.module.css';
import { SignUpForm } from '@/components/sign-up-form';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className={`${styles.closeButton} ${styles.pageCloseButton}`}
          aria-label="Close"
        >
          <X />
        </Link>
        <h1 className={styles.authHeading}>Create Account</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
