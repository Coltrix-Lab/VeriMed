'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listBatches, isExpired, type Batch } from '@/lib/verimed';

const STATUS_STYLE: Record<Batch['status'], { label: string; color: string; bg: string }> = {
  Registered: { label: 'Registered', color: '#a1a1aa', bg: 'rgba(255,255,255,0.08)' },
  InTransit: { label: 'In Transit', color: 'var(--accent)', bg: 'rgba(37, 99, 235, 0.1)' },
  Delivered: { label: 'Delivered', color: 'var(--accent-secondary)', bg: 'rgba(16, 185, 129, 0.1)' },
  Flagged: { label: 'Flagged', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function Dashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBatches().then((b) => {
      setBatches(b);
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Batch Registry</h1>
          <p style={{ color: '#a1a1aa', fontSize: '16px' }}>Every registered batch and its current custody status, network-wide.</p>
        </div>
        <Link href="/dashboard/register-batch"><button className="btn-primary">+ Register Batch</button></Link>
      </header>

      {loading && <p style={{ color: '#a1a1aa' }}>Loading registry…</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {batches.map((batch, index) => {
          const style = STATUS_STYLE[batch.status];
          const expired = isExpired(batch);
          return (
            <div key={batch.batchId} className="glass-panel" style={{ padding: '24px', animationDelay: `${index * 100}ms` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold' }}>{batch.productName}</h3>
                  <p style={{ fontSize: '12px', color: '#a1a1aa', fontFamily: 'monospace' }}>{batch.batchId}</p>
                </div>
                <span style={{ fontSize: '12px', color: style.color, background: style.bg, padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
                  {style.label}
                </span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                <p style={{ color: '#e2e8f0' }}>
                  📦 {batch.unitCount.toLocaleString()} units · {batch.custodyLog.length} custody event{batch.custodyLog.length === 1 ? '' : 's'}
                </p>
                <p style={{ color: expired ? '#ef4444' : '#a1a1aa', marginTop: '4px' }}>
                  {expired ? '⚠️ Expired ' : 'Expires '}
                  {new Date(batch.expiryDate * 1000).toLocaleDateString()}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/verify?code=${encodeURIComponent(batch.batchId)}`} style={{ flex: 1 }}>
                  <button className="btn-outline" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>🔍 Verify</button>
                </Link>
                {batch.status !== 'Delivered' && batch.status !== 'Flagged' && (
                  <Link href={`/dashboard/register-batch?logCustody=${encodeURIComponent(batch.batchId)}`} style={{ flex: 1 }}>
                    <button className="btn-outline" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>➜ Log Handoff</button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
