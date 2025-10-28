'use client';

// users cannot access this
// to test that tanstack query works
// will show ticket data at localhost:3000/test-query but need to be logged in
import { useTicketTable } from '@/lib/hooks/useTicketTable';

export default function TestQuery() {
  const { data, error, isLoading, isFetching } = useTicketTable();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h2 className="font-bold">test</h2>
      <p>{isFetching ? 'Refreshing...' : 'Fresh data'}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
