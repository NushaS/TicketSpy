'use client';
import React from 'react';

// Tanstack: GET requests w/ caching & efficiency
// basic API req -> POST/one-off actions like emails
export default function TestSendEmailPage() {
  const handleClick = async () => {
    const res = await fetch('/api/send-email');
    const data = await res.json();

    console.log(data);
    alert(JSON.stringify(data));
  };

  return (
    <div>
      <h1>Send Test Email</h1>
      <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send Email to Leo
      </button>
    </div>
  );
}
