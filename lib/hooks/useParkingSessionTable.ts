/*
  React Query hooks for fetching parking session data from Supabase.
  - `useUserParkingSessions(userId)` → only the logged-in user's sessions (default)
  - `useAllParkingSessions()` → fetches every session (for admin/testing)
*/

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

/*
  Fetch parking sessions for a single user.
*/
async function fetchUserParkingSessions(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('parking_sessions').select('*').eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
}

export function useUserParkingSessions(userId?: string) {
  return useQuery({
    queryKey: ['parking_sessions_user', userId],
    queryFn: () => (userId ? fetchUserParkingSessions(userId) : Promise.resolve([])),
    enabled: !!userId, // prevent running before userId exists
    staleTime: 1000 * 60, // cache for 1 minute
  });
}

/////////////////
// 1. fetch/use all ParkingSessions
/////////////////
// Zod schema
export const ParkingSessionSchema = z.object({
  parking_session_id: z.uuid(),
  user_id: z.uuid(),
  latitude: z.number(),
  longitude: z.number(),
});

// Zod created type from schema
export type ParkingSession = z.infer<typeof ParkingSessionSchema>;

async function fetchAllParkingSessions(): Promise<ParkingSession[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('parking_sessions').select('*');
  if (error) throw new Error(error.message);

  return z.array(ParkingSessionSchema).parse(data);
}

export function useAllParkingSessions() {
  return useQuery<ParkingSession[]>({
    queryKey: ['parking_sessions_all'],
    queryFn: fetchAllParkingSessions,
    staleTime: 1000 * 60,
  });
}
