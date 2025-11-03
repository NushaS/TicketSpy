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
    staleTime: 1000 * 60, // cache for 1 min
  });
}
