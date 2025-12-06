/*
  React Query hooks for fetching parking session data from Supabase.
  - `useUserParkingSessions(userId)` → only the logged-in user's sessions (default)
  - `useAllParkingSessions()` → fetches every session (for admin/testing)
*/

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { ParkingSessionSchema, ParkingSession } from '@/lib/schemas/parkingSessionSchema';

/**************
// 1) Fetch parking sessions for a single user.
***************/
export function useUserParkingSessions(userId?: string) {
  return useQuery({
    queryKey: ['parking_sessions_user', userId],
    queryFn: () => (userId ? fetchUserParkingSessions(userId) : Promise.resolve([])),
    enabled: !!userId, // prevent running before userId exists
    staleTime: 1000 * 60, // cache for 1 minute
  });
}

async function fetchUserParkingSessions(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('parking_sessions').select('*').eq('user_id', userId);

  if (error) {
    console.log('ERROR fetching user parking sessions:', error);
    throw new Error(error.message);
  }
  return z.array(ParkingSessionSchema).parse(data);
}

/**************
// 2) fetch/use all ParkingSessions
***************/
export function useAllParkingSessions() {
  return useQuery<ParkingSession[]>({
    queryKey: ['parking_sessions_all'],
    queryFn: fetchAllParkingSessions,
    staleTime: 1000 * 60,
  });
}

async function fetchAllParkingSessions(): Promise<ParkingSession[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('parking_sessions').select('*');
  if (error) {
    console.log('ERROR fetching all parking sessions:', error);

    throw new Error(error.message);
  }
  return z.array(ParkingSessionSchema).parse(data);
}
