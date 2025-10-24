"use client";

import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './welcome.module.css';

const WelcomePage: React.FC = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // Use phone number as email for now (you can modify this logic)
      const email = `${phoneNumber.replace(/\D/g, '')}@ticketspy.com`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone_number: phoneNumber,
          }
        }
      });
      
      if (error) throw error;
      
      // Redirect to map page after successful signup
      router.push('/');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={32} color="white" />
        </Link>
        <div className={styles.logoContainer}>
          <span className={styles.logoText}>ticketspy</span>
        </div>
      </header>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.welcomeText}>welcome!</h1>
        
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>create account</h2>
          
          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>name:</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Abigail M."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>phone number:</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="000-000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>password:</label>
              <input
                type="password"
                className={styles.input}
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button 
              type="submit" 
              className={styles.createButton}
              disabled={isLoading}
            >
              <Check size={20} />
              <span>{isLoading ? 'creating...' : 'create'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
