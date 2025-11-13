'use client';

import { useState } from 'react';

type EnforcementResult = {
  enforcement_id?: string;
  latitude: number;
  longitude: number;
  enforcement_reported_at?: string | null;
  [key: string]: unknown;
};

export default function TestEnforcementPage() {
  const [result, setResult] = useState<EnforcementResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock enforcement data
  const mockEnforcement = {
    latitude: 47.6062,
    longitude: -122.3321,
    observedAt: new Date().toISOString(), // optional — DB defaults to now()
    // notes: 'Officer seen near Pike Place', // uncomment if you added notes column
  };

  const sendMockEnforcement = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/post-enforcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockEnforcement),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Unknown error');

      setResult(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Enforcement Report Submission</h1>
      <button onClick={sendMockEnforcement} disabled={loading}>
        {loading ? 'Submitting...' : 'Send Mock Enforcement Report'}
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
