// ApprovePageInner.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ApprovePageInner() {
  const searchParams = useSearchParams();
  const rfqId = searchParams.get('id');
  const customerId = searchParams.get('customer_id');
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleApprove = async () => {
    setStatus('loading');

    const response = await fetch('/api/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok) {
      setStatus('success');
      setMessage('RFQ approved successfully!');
    } else {
      setStatus('error');
      setMessage(data.error || 'Approval failed.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Approve RFQ</h2>
      {status === 'success' ? (
        <p style={{ color: 'green' }}>{message}</p>
      ) : (
        <>
          <p>
            Do you approve the RFQ ID: <strong>{rfqId}</strong>?
          </p>
          <button
            style={{
              marginRight: 10,
              padding: '8px 16px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: 5,
            }}
            onClick={handleApprove}
          >
            Yes
          </button>
          <button
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: 5,
            }}
            onClick={() => alert('Approval rejected.')}
          >
            No
          </button>
          {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
        </>
      )}
    </div>
  );
}
