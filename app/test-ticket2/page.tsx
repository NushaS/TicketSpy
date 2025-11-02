'use client';

import { useState } from 'react';

export default function TestTicketPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock ticket data matching your Supabase schema
  const mockTicket = {
    latitude: 47.6062,
    longitude: -122.3321,
    violation_type: null,
    ticket_report_date: null, // must match `date` column
    ticket_report_hour: null, // must match `time` column
    // violation_type: 'default parking ticket',
    // ticket_report_date: '2025-11-01', // must match `date` column
    // ticket_report_hour: '15:30', // must match `time` column
    // user_id: null, // optional as per backend
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
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
