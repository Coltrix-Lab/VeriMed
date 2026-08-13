'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getBatch, isExpired, isCustodyChainIntact, type Batch } from '@/lib/verimed';

type Verdict = 'genuine' | 'expired' | 'flagged' | 'anomaly';

function verdictFor(batch: Batch): Verdict {
  if (batch.status === 'Flagged' || batch.flagCount > 0) return 'flagged';
  if (isExpired(batch)) return 'expired';
  if (!isCustodyChainIntact(batch)) return 'anomaly';
  return 'genuine';
}

const VERDICT_COPY: Record<Verdict, { label: string; detail: string; color: string; bg: string }> = {
  genuine: {
    label: '✅ Genuine — Safe to Use',
    detail: 'This unit matches a registered batch with an intact, expected chain of custody, and has not expired.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  expired: {
    label: '⚠️ Expired — Do Not Use',
    detail: 'This batch is genuine but past its expiry date. Do not administer — report to your pharmacist.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  flagged: {
    label: '🚫 Flagged — Reported Counterfeit or Diverted',
    detail: 'This batch has been flagged by another participant in the network. Do not use — please report where you obtained it.',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  anomaly: {
    label: '❗ Custody Anomaly Detected',
    detail: 'The recorded chain of custody for this batch is out of expected order. Treat with caution and report.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
};

const DEMO_CODES = ['VM-2026-A001', 'VM-2026-A002', 'VM-2026-A003'];

function VerifyPageInner() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get('code') ?? '';
  const [code, setCode] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);

  async function handleVerify(inputCode: string) {
    if (!inputCode.trim()) return;
    setLoading(true);
    setSearched(true);
    const result = await getBatch(inputCode);
    setBatch(result);
    setLoading(false);
  }

  useEffect(() => {
    if (!prefill) return;
    // Deferred to a microtask so the state updates inside handleVerify don't run
    // synchronously within the effect body itself.
    queueMicrotask(() => handleVerify(prefill));
  }, [prefill]);

  const verdict = batch ? verdictFor(batch) : null;

  return (
    <>
      <div className="mesh-bg" style={{ opacity: 0.4, filter: 'blur(100px)' }}></div>
      <main className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '48px', paddingBottom: '100px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="logo title-gradient" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '22px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                <path d="M12 2a4 4 0 0 1 4 4v3h-8V6a4 4 0 0 1 4-4z"/>
                <rect x="4" y="9" width="16" height="12" rx="2"/>
              </svg>
              VeriMed
            </div>
          </Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', color: '#a1a1aa', fontWeight: '500', fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
              Back to Home
            </div>
          </Link>
        </header>

        <section style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }} className="animate-fade-in">
          <h1 style={{ fontSize: '40px', marginBottom: '16px' }}>Scan to Verify</h1>
          <p style={{ color: '#cbd5e1', fontSize: '17px', marginBottom: '32px' }}>
            No wallet, no account. Enter the code printed on the medicine packaging (or scanned via
            QR/NFC in the deployed version) to check authenticity and see its full custody history.
          </p>

          <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#e2e8f0' }}>
              Batch / Unit Code
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify(code)}
                placeholder="e.g. VM-2026-A001"
                style={{ flex: 1, padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '16px' }}
              />
              <button className="btn-primary" onClick={() => handleVerify(code)} disabled={loading}>
                {loading ? 'Checking…' : 'Verify'}
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '16px' }}>
              Demo codes (this environment uses seeded data, not a live chain — see README):{' '}
              {DEMO_CODES.map((c, i) => (
                <React.Fragment key={c}>
                  <button
                    onClick={() => { setCode(c); handleVerify(c); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline', padding: 0 }}
                  >
                    {c}
                  </button>
                  {i < DEMO_CODES.length - 1 ? ', ' : ''}
                </React.Fragment>
              ))}
            </p>
          </div>

          {searched && !loading && !batch && (
            <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginTop: '24px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <p style={{ color: '#ef4444', fontWeight: 'bold' }}>No registered batch found for this code.</p>
              <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '8px' }}>
                An unregistered code is itself a signal — genuine VeriMed-tracked medicine always resolves to a batch record.
              </p>
            </div>
          )}

          {batch && verdict && (
            <div className="glass-panel animate-fade-in" style={{ padding: '32px', marginTop: '24px', textAlign: 'left' }}>
              <div style={{ padding: '16px', borderRadius: '12px', background: VERDICT_COPY[verdict].bg, border: `1px solid ${VERDICT_COPY[verdict].color}55`, marginBottom: '24px' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: VERDICT_COPY[verdict].color }}>{VERDICT_COPY[verdict].label}</p>
                <p style={{ fontSize: '14px', color: '#e2e8f0', marginTop: '8px' }}>{VERDICT_COPY[verdict].detail}</p>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{batch.productName}</h3>
              <p style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '20px' }}>Batch {batch.batchId} · {batch.unitCount.toLocaleString()} units</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Manufactured</p>
                  <p style={{ fontWeight: '600' }}>{new Date(batch.manufactureDate * 1000).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Expires</p>
                  <p style={{ fontWeight: '600', color: isExpired(batch) ? '#ef4444' : 'inherit' }}>
                    {new Date(batch.expiryDate * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                Chain of Custody
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {batch.custodyLog.map((event, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-secondary)', flexShrink: 0 }} />
                    <span style={{ fontWeight: '600', color: '#e2e8f0', minWidth: '110px' }}>{event.role}</span>
                    <span style={{ color: '#a1a1aa', fontFamily: 'monospace', fontSize: '12px' }}>{event.holder}</span>
                    <span style={{ color: '#71717a', fontSize: '12px', marginLeft: 'auto' }}>{new Date(event.timestamp * 1000).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>

              <Link href={`/dashboard/report?batchId=${encodeURIComponent(batch.batchId)}`}>
                <button className="btn-outline" style={{ width: '100%', marginTop: '28px' }}>
                  🚩 Report This Batch as Suspicious
                </button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyPageInner />
    </Suspense>
  );
}
