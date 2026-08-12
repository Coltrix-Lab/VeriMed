'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerBatch, logCustodyTransfer, confirmDelivery, getBatch, type CustodyRole, type Batch } from '@/lib/verimed';

const ROLES: CustodyRole[] = ['Distributor', 'Wholesaler', 'Pharmacy', 'Clinic'];

function toEpoch(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

function RegisterBatchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logCustodyFor = searchParams.get('logCustody');

  if (logCustodyFor) {
    return <LogCustodyForm batchId={logCustodyFor} onDone={() => router.push('/dashboard')} />;
  }
  return <RegisterForm onDone={() => router.push('/dashboard')} />;
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [batchId, setBatchId] = useState('');
  const [manufacturer, setManufacturer] = useState('GVCXFQ7...MFR1');
  const [productName, setProductName] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [unitCount, setUnitCount] = useState('1000');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!batchId || !productName || !manufactureDate || !expiryDate) {
      setError('All fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      await registerBatch({
        batchId,
        manufacturer,
        productName,
        manufactureDate: toEpoch(manufactureDate),
        expiryDate: toEpoch(expiryDate),
        unitCount: parseInt(unitCount, 10) || 0,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register batch');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Register a Batch <span style={{ fontSize: '24px' }}>💊</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '16px' }}>
          Mints an on-chain batch record and opens its chain of custody under your address.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '48px' }}>
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Field label="Batch ID">
            <input value={batchId} onChange={(e) => setBatchId(e.target.value)} placeholder="e.g. VM-2026-B014" style={inputStyle} />
          </Field>
          <Field label="Product Name">
            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Amoxicillin 500mg (100 caps)" style={inputStyle} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Field label="Manufacture Date">
              <input type="date" value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Expiry Date">
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} style={inputStyle} />
            </Field>
          </div>
          <Field label="Unit Count">
            <input type="number" value={unitCount} onChange={(e) => setUnitCount(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Manufacturer Wallet">
            <input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} style={inputStyle} />
          </Field>

          {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register Batch On-Chain'}
          </button>
        </form>

        <div>
          <div className="glass-panel" style={{ padding: '32px', position: 'sticky', top: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              What Happens On-Chain
            </h3>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '20px', color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
              <li><code>batch::register_batch</code> creates the record keyed by batch ID.</li>
              <li>An opening custody event is logged with you as <strong>Manufacturer</strong>.</li>
              <li>The batch becomes scannable immediately at <code>/verify</code> for anyone downstream.</li>
              <li>Distributors/pharmacies then call <code>log_custody_transfer</code> as it moves; a clinic calls <code>confirm_delivery</code> on arrival.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogCustodyForm({ batchId, onDone }: { batchId: string; onDone: () => void }) {
  const [batch, setBatch] = useState<Batch | null | undefined>(undefined);
  const [holder, setHolder] = useState('GDPLM3X...NEW1');
  const [role, setRole] = useState<CustodyRole>('Distributor');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getBatch(batchId).then(setBatch);
  }, [batchId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (role === 'Clinic') {
        await confirmDelivery(batchId, holder);
      } else {
        await logCustodyTransfer(batchId, holder, role);
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log handoff');
    } finally {
      setSubmitting(false);
    }
  }

  if (batch === undefined) return <p style={{ color: '#a1a1aa' }}>Loading batch…</p>;
  if (batch === null) return <p style={{ color: '#ef4444' }}>Batch {batchId} not found.</p>;

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Log Custody Handoff</h1>
        <p style={{ color: '#a1a1aa', fontSize: '16px' }}>{batch.productName} · {batch.batchId}</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Field label="Receiving Party Wallet">
          <input value={holder} onChange={(e) => setHolder(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Role">
          <select value={role} onChange={(e) => setRole(e.target.value as CustodyRole)} style={inputStyle}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}{r === 'Clinic' ? ' (confirms last-mile delivery)' : ''}</option>
            ))}
          </select>
        </Field>
        {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Logging…' : role === 'Clinic' ? 'Confirm Delivery' : 'Log Handoff On-Chain'}
        </button>
      </form>
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

export default function RegisterBatchPage() {
  return (
    <Suspense fallback={null}>
      <RegisterBatchInner />
    </Suspense>
  );
}
