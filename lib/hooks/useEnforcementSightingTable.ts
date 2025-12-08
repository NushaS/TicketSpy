/*
  React Query hook for fetching enforcement sighting data from Supabase.
*/
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

async function fetchEnforcementSightings() {
  const supabase = createClient();
  const { data, error } = await supabase.from('enforcement_sightings').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export function useEnforcementSightingTable() {
  return useQuery({
    queryKey: ['enforcement_sightings'], // unique cache key
    queryFn: fetchEnforcementSightings,
    // Light polling for fresh data plus focus/reconnect refetches.
    staleTime: 0, // always stale so focus/reconnect will refetch
    refetchInterval: 120_000, // poll every 2 minutes
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
