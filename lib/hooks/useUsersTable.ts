import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export type UserNotificationRow = {
  user_id: string;
  email: string | null;
  display_name?: string | null;
  bookmark_notifications_on: boolean | null;
  parking_notifications_on: boolean | null;
};

// --- fetch single user ---
async function fetchUserNotificationSettings(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('user_id, email, display_name, bookmark_notifications_on, parking_notifications_on')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle(); // returns row | null
  if (error) throw new Error(error.message);
  return data as UserNotificationRow | null;
}

export function useUserNotificationSettings(userId?: string | null) {
  return useQuery({
    queryKey: ['user_notif_settings', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve(null);
      return fetchUserNotificationSettings(userId);
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60, // 1 minute
  });
}
