'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { reportFlag } from '@/lib/verimed';

function ReportPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [batchId, setBatchId] = useState(searchParams.get('batchId') ?? '');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!batchId || !reason) {
      setError('Batch code and a reason are both required.');
      return;
    }
    setSubmitting(true);
    try {
      await reportFlag(batchId, reason);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Report Counterfeit / Diversion</h1>
        <p style={{ color: '#a1a1aa', fontSize: '16px' }}>
          Any participant — including consumers with no wallet — can flag a suspicious batch.
        </p>
        <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', fontSize: '13px', color: '#fbbf24', display: 'inline-block' }}>
          🧱 Stub UI on real logic: the flag itself calls the same mock `reportFlag` the
          contract&apos;s <code>batch::report_flag</code> mirrors. A production build relays a
          walletless consumer submission through a backend service address — see README.
        </div>
      </header>

      {done ? (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '520px' }}>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>🚩 Report submitted</p>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '24px' }}>
            Batch {batchId} has been flagged and is now visible on the Regulator View.
          </p>
          <button className="btn-outline" onClick={() => router.push('/dashboard/regulator')}>
            View in Regulator Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Field label="Batch / Unit Code">
            <input value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="e.g. VM-2026-A003" style={inputStyle} />
          </Field>
          <Field label="What's wrong with it?">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. packaging looks altered, no effect after use, sold by an unlicensed vendor…"
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' as const }}
            />
          </Field>
          {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#e2e8f0' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: 'white',
  outline: 'none',
  fontSize: '16px',
  fontFamily: 'inherit',
};

export default function ReportPage() {
  return (
    <Suspense fallback={null}>
      <ReportPageInner />
    </Suspense>
  );
}
