'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listPrograms, type Program } from '@/lib/verimed';

const STATUS_STYLE: Record<Program['status'], { label: string; color: string; bg: string }> = {
  Active: { label: 'Active', color: 'var(--accent)', bg: 'rgba(37, 99, 235, 0.1)' },
  PayoutExecuted: { label: 'Payout Executed', color: 'var(--accent-secondary)', bg: 'rgba(16, 185, 129, 0.1)' },
  RolledOver: { label: 'Rolled Over', color: '#a1a1aa', bg: 'rgba(255,255,255,0.08)' },
};

function toCsv(programs: Program[]): string {
  const header = ['Program ID', 'Sponsor', 'Total Funds', 'Commission (bps)', 'Confirmed Beneficiaries', 'Status', 'Created'];
  const rows = programs.map((p) => [
    p.programId,
    p.sponsor,
    p.totalFunds.toString(),
    p.commissionBps.toString(),
    p.confirmedBeneficiaries.length.toString(),
    p.status,
    new Date(p.createdAt * 1000).toISOString(),
  ]);
  return [header, ...rows].map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

function downloadCsv(programs: Program[]) {
  const blob = new Blob([toCsv(programs)], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `verimed-impact-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DonorDashboard() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPrograms().then((p) => {
      setPrograms(p);
      setLoading(false);
    });
  }, []);

  const totalLocked = programs.reduce((sum, p) => sum + p.totalFunds, 0);
  const totalConfirmed = programs.reduce((sum, p) => sum + p.confirmedBeneficiaries.length, 0);

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Donor Impact</h1>
          <p style={{ color: '#a1a1aa', fontSize: '16px' }}>Funded programs, delivery confirmations, and exportable M&amp;E reporting.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={() => downloadCsv(programs)} disabled={programs.length === 0}>
            ⬇ Export Impact Report (CSV)
          </button>
          <Link href="/dashboard/fund-program"><button className="btn-primary">+ Fund Program</button></Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard label="Total Programs" value={programs.length.toString()} />
        <StatCard label="Total Locked" value={`${totalLocked.toLocaleString()} USDC`} />
        <StatCard label="Confirmed Deliveries" value={totalConfirmed.toString()} />
      </div>

      {loading && <p style={{ color: '#a1a1aa' }}>Loading programs…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {programs.map((program) => {
          const style = STATUS_STYLE[program.status];
          return (
            <div key={program.programId} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold' }}>{program.programId}</h3>
                <p style={{ fontSize: '13px', color: '#a1a1aa', fontFamily: 'monospace' }}>{program.sponsor}</p>
              </div>
              <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Locked</p>
                  <p style={{ fontWeight: 'bold' }}>{program.totalFunds.toLocaleString()} USDC</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Commission</p>
                  <p style={{ fontWeight: 'bold' }}>{(program.commissionBps / 100).toFixed(2)}%</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#a1a1aa' }}>Confirmed Deliveries</p>
                  <p style={{ fontWeight: 'bold' }}>{program.confirmedBeneficiaries.length}</p>
                </div>
                <span style={{ fontSize: '12px', color: style.color, background: style.bg, padding: '6px 12px', borderRadius: '8px', fontWeight: '600' }}>
                  {style.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <p style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: '900' }}>{value}</p>
    </div>
  );
}
