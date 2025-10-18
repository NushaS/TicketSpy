'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';


async function fetchTickets() {
  const supabase = createClient();
  const { data, error } = await supabase.from('tickets').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export default function TestQuery() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['tickets'],   // unique cache key
    queryFn: fetchTickets,
    staleTime: 1000 * 60,    // cache for 1 min
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h2>Tickets</h2>
      <p>{isFetching ? 'Refreshing...' : 'Fresh data'}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
