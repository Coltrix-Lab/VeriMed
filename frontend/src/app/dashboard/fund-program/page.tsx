'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fundProgram } from '@/lib/verimed';

export default function FundProgramPage() {
  const router = useRouter();
  const [programId, setProgramId] = useState('');
  const [sponsor, setSponsor] = useState('GDONR...SPONSOR');
  const [treasury, setTreasury] = useState('GTREAS...URY01');
  const [totalFunds, setTotalFunds] = useState('10000');
  const [commissionBps, setCommissionBps] = useState('800');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const funds = parseFloat(totalFunds) || 0;
  const bps = parseInt(commissionBps, 10) || 0;
  const commission = useMemo(() => (funds * bps) / 10000, [funds, bps]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!programId || !sponsor || !treasury) {
      setError('All fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      await fundProgram({
        programId,
        sponsor,
        treasury,
        totalFunds: funds,
        commissionBps: bps,
      });
      router.push('/dashboard/donor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fund program');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Fund a Program <span style={{ fontSize: '24px' }}>🏛️</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '16px' }}>
          Lock funds in escrow, released automatically only when a receiving clinic or CHW
          confirms delivery — not on a promise.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '48px' }}>
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Field label="Program ID">
            <input value={programId} onChange={(e) => setProgramId(e.target.value)} placeholder="e.g. KOICA-NG-2026-02" style={inputStyle} />
          </Field>
          <Field label="Sponsor Wallet">
            <input value={sponsor} onChange={(e) => setSponsor(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Treasury Wallet (platform commission recipient)">
            <input value={treasury} onChange={(e) => setTreasury(e.target.value)} style={inputStyle} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Field label="Total Funds (USDC)">
              <input type="number" value={totalFunds} onChange={(e) => setTotalFunds(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Platform Commission (bps)">
              <input type="number" value={commissionBps} onChange={(e) => setCommissionBps(e.target.value)} style={inputStyle} />
            </Field>
          </div>
          <p style={{ fontSize: '12px', color: '#71717a' }}>
            100 bps = 1%. Configurable per program — donor verification fees, manufacturer SaaS
            fees, and regulator data-licensing all warrant different rates.
          </p>

          {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Locking Funds…' : 'Sign & Lock Escrow'}
          </button>
        </form>

        <div>
          <div className="glass-panel" style={{ padding: '32px', position: 'sticky', top: '24px', background: 'linear-gradient(180deg, rgba(20,20,30,0.6) 0%, rgba(20,20,30,0.9) 100%)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Escrow Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#cbd5e1' }}>
              <span>Total Locked</span>
              <span style={{ fontWeight: 'bold', color: 'white' }}>{funds.toLocaleString()} USDC</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: '#cbd5e1' }}>
              <span>Est. Commission ({(bps / 100).toFixed(2)}%, on payout)</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{commission.toLocaleString()} USDC</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '24px', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>To Confirmed Recipients</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent)' }}>{(funds - commission).toLocaleString()} USDC</span>
            </div>
            <p style={{ fontSize: '12px', color: '#a1a1aa' }}>
              Split proportionally across every beneficiary confirmed by a delivery event before payout executes.
            </p>
          </div>
        </div>
      </div>
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
};
