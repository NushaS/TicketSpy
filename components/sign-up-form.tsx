'use client';
// import from supabase
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import the same CSS module used by original login page
import styles from '@/app/auth/auth.module.css';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // create a supabase client
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // check if passwords match
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: { display_name: displayName },
        },
      });
      if (error) throw error;
      router.push('/auth/sign-up-success'); // redirect after signup
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className={styles.loginForm}>
      <div className={styles.loginFormGroup}>
        <label htmlFor="displayName" className={styles.loginLabel}>
          display name:
        </label>
        <input
          id="displayName"
          type="text"
          className={styles.loginInput}
          placeholder="Your name here"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

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

      <div className={styles.loginFormGroup}>
        <label htmlFor="password" className={styles.loginLabel}>
          password:
        </label>
        <input
          id="password"
          type="password"
          className={styles.loginInput}
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className={styles.loginFormGroup}>
        <label htmlFor="repeat-password" className={styles.loginLabel}>
          repeat password:
        </label>
        <input
          id="repeat-password"
          type="password"
          className={styles.loginInput}
          placeholder="••••••••"
          required
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </div>

      {error && <p className={styles.loginError}>{error}</p>}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        <span>{isLoading ? 'creating account...' : 'submit'}</span>
      </button>

      {/* row for “login” link */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
