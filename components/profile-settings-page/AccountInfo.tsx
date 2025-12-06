'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCheck, FaTimes, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import styles from '@/app/profile-settings/profile-settings.module.css';
import { createClient } from '@/lib/supabase/client';
import { useUserProfileDetails } from '@/lib/hooks/useUsersTable';

export default function AccountInfo() {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  // original values for comparison and reset
  const [originalDisplayName, setOriginalDisplayName] = useState<string>('');
  const [originalEmail, setOriginalEmail] = useState<string>('');

  // edit mode state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // logout redirect
  const router = useRouter();

  // delete account confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // get UserId
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  // use the hook to fetch user data
  const { data: userData, isLoading, refetch } = useUserProfileDetails(userId);

  // update local state when userData changes
  useEffect(() => {
    if (userData) {
      const userDisplayName = userData.display_name || 'Anonymous';
      const userEmail = userData.email || '';

      setDisplayName(userDisplayName);
      setEmail(userEmail);
      setOriginalDisplayName(userDisplayName);
      setOriginalEmail(userEmail);
    }
  }, [userData]);

  // check if any changes have been made
  const hasChanges = displayName !== originalDisplayName || email !== originalEmail;

  // discard changes
  const handleDiscard = () => {
    setDisplayName(originalDisplayName);
    setEmail(originalEmail);
    setError(null);
    setSuccessMessage(null);
  };

  // save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/account/update', {
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

      // update original values to reflect saved changes
      await refetch();
      setSuccessMessage('profile updated successfully!');

      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  // delete account
  const handleDeleteAccount = async () => {
    if (!userId) return;

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      setShowDeleteModal(false);

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      const message = (err instanceof Error && err.message) || 'Failed to delete account';
      setDeleteError(message);
      setTimeout(() => setDeleteError(null), 3000);
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
    <>
      {/* Editable form */}
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
              setError(null);
              setSuccessMessage(null);
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
              setError(null);
              setSuccessMessage(null);
            }}
          />
        </div>

        {error && <p className={styles.accountError}>Error: {error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        {hasChanges && (
          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleDiscard} className={styles.discardButton}>
              <FaTimes /> discard changes
            </button>
            <button type="submit" className={styles.saveButton}>
              <FaCheck /> save changes
            </button>
          </div>
        )}
      </form>

      {/* Password reset, logout, delete account */}
      {!hasChanges && (
        <div>
          <div className={styles.accountFormGroup}>
            <div className={styles.forgotPasswordLink}>
              <Link href="/auth/forgot-password">forgot your password?</Link>
            </div>
          </div>

          <div className={styles.accountActionButtons}>
            <button type="button" onClick={handleLogout} className={styles.logoutButton}>
              <FaSignOutAlt /> log out
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className={styles.deleteButton}
            >
              <FaTrash /> delete account
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDeleteModal(false)}
          role="presentation"
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalBody}>
              <p>Are you sure you want to permanently delete your account?</p>
              {deleteError && <p className={styles.loginError}>{deleteError}</p>}
            </div>
            <div className={styles.modalButtonGroup}>
              <button
                className={styles.cancelDeleteButton}
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes /> cancel
              </button>
              <button className={styles.confirmDeleteButton} onClick={handleDeleteAccount}>
                <FaTrash /> delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
