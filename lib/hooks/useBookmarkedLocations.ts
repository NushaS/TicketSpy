/*
  React Query hooks for fetching bookmarked locations from Supabase.
  - `useUserBookmarkedLocations(userId)` → only fetches the logged-in user's bookmarks (default & safe)
  - `useAllBookmarkedLocations()` → fetches *all* bookmarks (for admin/debug/testing only)
*/

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

/*
  Fetch bookmarks for a specific user.
*/
async function fetchUserBookmarkedLocations(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookmarked_locations')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
}

/*
  Fetch all bookmarks
*/
async function fetchAllBookmarkedLocations() {
  const supabase = createClient();
  const { data, error } = await supabase.from('bookmarked_locations').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export function useUserBookmarkedLocations(userId?: string) {
  return useQuery({
    queryKey: ['bookmarked_locations_user', userId],
    queryFn: () => (userId ? fetchUserBookmarkedLocations(userId) : Promise.resolve([])),
    enabled: !!userId, // prevents running until userId exists
    staleTime: 1000 * 60, // cache for 1 minute
  });
}

export function useAllBookmarkedLocations() {
  return useQuery({
    queryKey: ['bookmarked_locations_all'],
    queryFn: fetchAllBookmarkedLocations,
    staleTime: 1000 * 60,
  });
}
