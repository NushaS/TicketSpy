'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useState } from 'react';
import styles from '@/app/auth/auth.module.css';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      {/* Heading, same style as SignUpForm */}
      <h1 className={styles.authHeading}>reset your password</h1>
      <div style={{ textAlign: 'left', margin: '1.5rem', fontSize: '0.9rem' }}>
        Type in your email and we&apos;ll send you a link to reset your password.
      </div>
      {success ? (
        <div className={styles.loginSuccessMessage}>
          <p>Check your email for password reset instructions.</p>
          <Link href="/auth/login" className={styles.submitButton}>
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleForgotPassword} className={styles.loginForm}>
          <div className={styles.loginFormGroup}>
            <label htmlFor="email" className={styles.loginLabel}>
              email:
            </label>
            <input
              id="email"
              type="email"
              className={styles.loginInput}
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className={styles.loginError}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'sending...' : 'send reset email'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
            Remember your password?{' '}
            <Link href="/auth/login" className="underline underline-offset-4">
              Log in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
