'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { listBatches, isExpired, type Batch } from '@/lib/verimed';

export default function RegulatorDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBatches().then((b) => {
      setBatches(b);
      setLoading(false);
    });
  }, []);

  const flagged = batches.filter((b) => b.status === 'Flagged' || b.flagCount > 0);
  const expired = batches.filter((b) => isExpired(b) && b.status !== 'Flagged');

  const hotspots = useMemo(() => {
    // Stub aggregation: in production this groups by the geolocation attached to
    // custody/flag events (see README Status). For now it groups by manufacturer
    // as a stand-in signal so the dashboard shape is real even though the
    // underlying geolocation data isn't wired up yet.
    const counts = new Map<string, number>();
    for (const b of flagged) {
      counts.set(b.manufacturer, (counts.get(b.manufacturer) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [flagged]);

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Regulator View</h1>
        <p style={{ color: '#a1a1aa', fontSize: '16px' }}>
          Network-wide visibility into flagged batches and custody anomalies.
        </p>
        <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', fontSize: '13px', color: '#fbbf24', display: 'inline-block' }}>
          🧱 Stub: reads from the same seeded batch data as the rest of the demo. A real
          deployment reads live chain state and a proper geolocation-based hotspot map.
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard label="Total Batches Tracked" value={batches.length.toString()} color="var(--accent)" />
        <StatCard label="Flagged Batches" value={flagged.length.toString()} color="#ef4444" />
        <StatCard label="Expired (Undispensed)" value={expired.length.toString()} color="#f59e0b" />
      </div>

      {loading && <p style={{ color: '#a1a1aa' }}>Loading network data…</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Flagged Batches</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {flagged.length === 0 && !loading && <p style={{ color: '#a1a1aa' }}>No flagged batches currently.</p>}
            {flagged.map((batch) => (
              <div key={batch.batchId} className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold' }}>{batch.productName}</h3>
                    <p style={{ fontSize: '12px', color: '#a1a1aa', fontFamily: 'monospace' }}>{batch.batchId} · {batch.manufacturer}</p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
                    {batch.flagCount} report{batch.flagCount === 1 ? '' : 's'}
                  </span>
                </div>
                {batch.lastFlagReason && (
                  <p style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                    &ldquo;{batch.lastFlagReason}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Diversion Hotspots</h2>
          <div className="glass-panel" style={{ padding: '20px' }}>
            {hotspots.length === 0 ? (
              <p style={{ color: '#a1a1aa', fontSize: '14px' }}>No hotspots to report.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {hotspots.map(([source, count]) => (
                  <div key={source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{source}</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{count} flag{count === 1 ? '' : 's'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <p style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: '900', color }}>{value}</p>
    </div>
  );
}
