'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/profile/profile.module.css';
import { createClient } from '@/lib/supabase/client';

export default function ProfileInfo() {
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

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
        return;
      }

      setUserId(user.id);
      setEmail(user.email || '');

      const { data } = await supabase
        .from('users')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      setDisplayName(data?.display_name || 'Anonymous');
    };

    loadUser();
  }, []);

  return (
    <div className={styles.section}>
      <p>
        <strong>Name:</strong> {displayName}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
}
