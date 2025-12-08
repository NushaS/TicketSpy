'use client';
// import from supabase
import { createClient } from '@/lib/supabase/client';
import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import the same CSS module used by original login page
import styles from '@/app/auth/auth.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // create a supabase client
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/'); // goes back to map page after log in
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.loginForm}>
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

      {/* row for “forgot password?” link */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
        <Link href="/auth/forgot-password" className="text-sm underline underline-offset-4">
          Forgot your password?
        </Link>
      </div>

      {error && <p className={styles.loginError}>{error}</p>}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        <FaCheck size={16} />
        <span>{isLoading ? 'logging in...' : 'submit'}</span>
      </button>

      {/* row for “sign up” link */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
        Don&apos;t have an account?{' '}
        <Link href="/auth/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
