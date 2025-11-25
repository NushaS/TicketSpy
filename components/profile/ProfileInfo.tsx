'use client';

import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import styles from '@/app/profile/profile.module.css';
import { createClient } from '@/lib/supabase/client';

export default function ProfileInfo() {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  // Original values for comparison and reset
  const [originalDisplayName, setOriginalDisplayName] = useState<string>('');
  const [originalEmail, setOriginalEmail] = useState<string>('');

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        setUserId(null);
        setEmail('');
        setDisplayName('');
        setOriginalEmail('');
        setOriginalDisplayName('');
        return;
      }

      setUserId(user.id);
      const userEmail = user.email || '';
      setEmail(userEmail);
      setOriginalEmail(userEmail);

      const { data } = await supabase
        .from('users')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      const userDisplayName = data?.display_name || 'Anonymous';
      setDisplayName(userDisplayName);
      setOriginalDisplayName(userDisplayName);
    };

    loadUser();
  }, []);

  // Check if any changes have been made
  const hasChanges = displayName !== originalDisplayName || email !== originalEmail;

  const handleDiscard = () => {
    setDisplayName(originalDisplayName);
    setEmail(originalEmail);
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          displayName,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update original values to reflect saved changes
      setOriginalDisplayName(displayName);
      setOriginalEmail(email);
      setIsEditing(false);
      setSuccessMessage('profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleFieldChange = () => {
    if (!isEditing) {
      setIsEditing(true);
      setError(null);
      setSuccessMessage(null);
    }
  };

  if (!userId) {
    return (
      <div className={styles.unauthenticated}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className={styles.accountForm}>
      <div className={styles.accountFormGroup}>
        <label htmlFor="displayName" className={styles.accountLabel}>
          Name:
        </label>
        <input
          id="displayName"
          type="text"
          className={styles.accountInput}
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            handleFieldChange();
          }}
        />
      </div>
      <div className={styles.accountFormGroup}>
        <label htmlFor="email" className={styles.accountLabel}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          className={styles.accountInput}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleFieldChange();
          }}
        />
      </div>
      {error && <p className={styles.loginError}>{error}</p>}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

      {isEditing && hasChanges ? (
        <div className={styles.buttonGroup}>
          <button type="button" onClick={handleDiscard} className={styles.discardButton}>
            <FaTimes />
            Discard Changes
          </button>
          <button type="submit" className={styles.saveButton}>
            <FaCheck />
            Save Changes
          </button>
        </div>
      ) : (
        <div className={styles.accountFormGroup}>
          <div className={styles.forgotPasswordLink}>
            <Link href="/auth/forgot-password">Forgot your password?</Link>
          </div>
        </div>
      )}
    </form>
  );
}
