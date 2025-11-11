// this hook is not being used anywhere

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

async function fetchTickets() {
  const supabase = createClient();
  const { data, error } = await supabase.from('tickets').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export function useTicketTable() {
  const query = useQuery({
    queryKey: ['tickets'], // unique cache key
    queryFn: fetchTickets,
    staleTime: 1000 * 60, // cache for 1 min
  });

  return {
    ...query,
    refetch: query.refetch, // Explicitly expose refetch for manual updates
  };
}
