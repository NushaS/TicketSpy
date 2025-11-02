'use client';

import { useState } from 'react';

type TicketResult = {
  // Adjust these keys to match the expected API response
  id?: number;
  latitude: number;
  longitude: number;
  violation_type: string | null;
  ticket_report_date: string | null;
  ticket_report_hour: string | null;
  // Add additional fields as needed
  [key: string]: unknown;
};

export default function TestTicketPage() {
  const [result, setResult] = useState<TicketResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock ticket data matching your Supabase schema
  const mockTicket = {
    latitude: 47.6062,
    longitude: -122.3321,
    violation_type: null,
    ticket_report_date: null,
    ticket_report_hour: null,
  };

  const sendMockTicket = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/post-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockTicket),
      });
      const data: TicketResult = await res.json();
      if (!res.ok) throw new Error((data as any).error || 'Unknown error');
      setResult(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Mock Ticket Submission</h1>
      <button onClick={sendMockTicket} disabled={loading}>
        {loading ? 'Submitting...' : 'Send Mock Ticket'}
      </button>

      {result && (
        <div style={{ marginTop: 20, color: 'green' }}>
          <h2>Success!</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
