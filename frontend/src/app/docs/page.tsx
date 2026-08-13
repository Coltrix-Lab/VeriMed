import React from 'react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'roles', label: 'Roles' },
  { id: 'features', label: 'Key Features' },
  { id: 'contracts', label: 'Smart Contracts' },
  { id: 'stack', label: 'Technology Stack' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'status', label: 'Status' },
];

const ROLES: { role: string; does: string }[] = [
  { role: 'Manufacturer', does: 'Registers batches, mints serial codes, logs initial custody.' },
  { role: 'Distributor / Wholesaler', does: 'Logs custody handoff events as stock moves through the chain.' },
  { role: 'Pharmacy / Clinic', does: 'Receives stock (logs handoff), scans to verify before dispensing.' },
  { role: 'Regulator', does: 'Read access to chain-of-custody and counterfeit-report data; dashboard of flagged batches and diversion hotspots.' },
  { role: 'Donor / Sponsor', does: 'Funds an escrow pool tied to a shipment/program; views delivery-confirmation and impact/M&E reporting.' },
  { role: 'Receiving Clinic / CHW', does: 'Confirms last-mile delivery by scanning on arrival; may be disbursed to from escrow.' },
  { role: 'Consumer / Patient', does: 'Scans a unit at point of use to verify authenticity — no wallet required.' },
  { role: 'Platform Admin', does: 'Oversight dashboard, dispute resolution for contested custody events or counterfeit reports.' },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="glass-panel card-content" style={{ scrollMarginTop: '24px', marginBottom: '24px' }}>
      <h2 className="card-title">{title}</h2>
      {children}
    </div>
  );
}

export default function DocsPage() {
  return (
    <>
      <div className="mesh-bg" style={{ opacity: 0.4, filter: 'blur(100px)' }}></div>
      <main className="container">
        <header className="header" style={{ position: 'relative', zIndex: 10 }}>
          <div className="logo title-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
              <path d="M12 2a4 4 0 0 1 4 4v3h-8V6a4 4 0 0 1 4-4z"/>
              <rect x="4" y="9" width="16" height="12" rx="2"/>
              <path d="M12 13v4M10 15h4"/>
            </svg>
            VeriMed
          </div>
          <nav className="action-buttons">
            <Link href="/"><button className="btn-outline">Back to Home</button></Link>
            <Link href="/dashboard"><button className="btn-primary">Enter Dashboard</button></Link>
          </nav>
        </header>

        <section className="animate-fade-in" style={{ position: 'relative', zIndex: 10, padding: 'clamp(24px, 6vw, 56px) 0 32px' }}>
          <h1 style={{ fontSize: 'clamp(30px, 6vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>
            Documentation
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#e2e8f0', maxWidth: '720px' }}>
            Blockchain-verified pharmaceutical provenance and aid delivery, built on Stellar (Soroban).
            This page covers what VeriMed does, how the pieces fit together, and how to run it yourself.
          </p>
        </section>

        <section className="two-col-grid animate-fade-in delay-100" style={{ position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
          <div>
            <Section id="overview" title="Overview 🌍">
              <p className="card-desc">
                An estimated 1 in 10 medical products in low- and middle-income countries is substandard or
                falsified (WHO). Fake antimalarials, underdosed antibiotics, diluted insulin — this kills patients
                directly and drives antimicrobial resistance globally.
              </p>
              <p className="card-desc" style={{ marginBottom: 0 }}>
                A related, compounding problem: donor-funded medicine routinely leaks before it reaches the clinic
                it was meant for, with little to no verifiable proof of where the loss happened. VeriMed addresses
                both problems with two integrated layers: manufacturer-to-pharmacy traceability, and verified,
                escrow-backed aid delivery.
              </p>
            </Section>

            <Section id="how-it-works" title="How It Works 🔗">
              <p className="card-desc">
                <strong style={{ color: 'var(--foreground)' }}>1. Manufacturer-to-Pharmacy Traceability</strong> — every
                drug batch gets a tamper-evident code at manufacture. Every custody transfer (manufacturer →
                distributor → pharmacy/clinic) is logged on an immutable chain. Anyone can scan a unit to instantly
                verify authenticity, expiry, and custody history — no wallet or crypto knowledge required.
              </p>
              <p className="card-desc" style={{ marginBottom: 0 }}>
                <strong style={{ color: 'var(--foreground)' }}>2. Verified Aid & Donor-Funded Delivery</strong> — donors
                fund an escrow pool tied to a shipment or program. Funds release automatically, and only when the
                receiving clinic or Community Health Worker confirms last-mile delivery by scanning the batch on
                arrival.
              </p>
            </Section>

            <Section id="roles" title="Roles 🗺️">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--primary)', fontSize: '14px' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--primary)', fontSize: '14px' }}>What they do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROLES.map((r) => (
                      <tr key={r.role}>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{r.role}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: '#cbd5e1' }}>{r.does}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="features" title="Key Features 🎯">
              <ul style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><strong style={{ color: 'var(--foreground)' }}>Batch & Custody Registry</strong> — manufacturers register batches on-chain with product metadata, manufacture/expiry dates, and unit serials; every custody handoff is a signed on-chain event.</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Scan-to-Verify</strong> — a public, walletless web flow that returns a plain-language authenticity result: genuine or flagged, in-date or expired, expected custody chain or anomaly.</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Trigger-Agnostic Escrow</strong> — locks a sponsor&apos;s funds and releases them automatically when a defined verification event fires, such as a delivery confirmation.</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Configurable Commission</strong> — platform commission is set per program (basis points), not hardcoded.</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Rollover Mechanics</strong> — unspent program/shipment funds roll over into the next round rather than defaulting to reversion.</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Counterfeit & Diversion Reporting</strong> — any participant, including consumers, can flag a suspicious batch, notifying the regulator role.</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Wallet-Based Authentication</strong> — supply-chain participants authenticate via Stellar wallet; consumers never need one.</li>
              </ul>
            </Section>

            <Section id="contracts" title="Smart Contract Mechanics 🏛️">
              <p className="card-desc">
                Rust / Soroban contracts, split into two modules.
              </p>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>escrow</h3>
              <ul style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <li><code>initialize_program(program_id, sponsor, token, total_funds, commission_bps, treasury)</code> — sponsor deposits tokens, locking them; commission is configurable per program.</li>
                <li><code>confirm_event(verifier, program_id, beneficiary, trigger)</code> — records a verified release-trigger event against a beneficiary.</li>
                <li><code>execute_payout(admin, program_id)</code> — transfers commission to the treasury and splits the remainder across confirmed beneficiaries.</li>
                <li><code>rollover_program(admin, program_id)</code> — unspent funds continue into the next round.</li>
              </ul>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>batch</h3>
              <ul style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 0 }}>
                <li><code>register_batch(manufacturer, batch_id, product_name, manufacture_date, expiry_date, unit_count)</code> — creates the on-chain batch record and opening custody event.</li>
                <li><code>log_custody_transfer(holder, batch_id, role)</code> — appends a signed custody handoff event.</li>
                <li><code>confirm_delivery(receiver, batch_id)</code> — last-mile confirmation by a receiving clinic/CHW; feeds the escrow delivery trigger.</li>
                <li><code>report_flag(batch_id, reason)</code> — records a counterfeit/diversion flag against a batch.</li>
                <li><code>get_batch(batch_id)</code> — read-only view returning the full batch record and custody log.</li>
              </ul>
            </Section>

            <Section id="stack" title="Technology Stack 🛠️">
              <ul style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: 'var(--foreground)' }}>Blockchain Core</strong> — Stellar Network</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Smart Contracts / Escrow</strong> — Rust (<code>#![no_std]</code>), Soroban SDK</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Frontend App</strong> — Next.js, React</li>
                <li><strong style={{ color: 'var(--foreground)' }}>Backend Infrastructure</strong> — off-chain metadata storage, counterfeit-report evidence, and custody geolocation logs (planned)</li>
              </ul>
            </Section>

            <Section id="getting-started" title="Getting Started 🚀">
              <p className="card-desc">
                Fastest path — no setup: the frontend is fully clickable at{' '}
                <a href="https://verimeds.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>verimeds.netlify.app</a>.
                It runs against the same mock data layer described below, so every flow works exactly as it does locally.
              </p>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '20px 0 10px' }}>Smart contracts (Rust / Soroban)</h3>
              <pre style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', overflowX: 'auto', fontSize: '14px', marginBottom: '20px' }}>
{`cd contracts/verimed-contract
cargo test                                       # 5/5 unit tests
cargo build --target wasm32-unknown-unknown --release`}
              </pre>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>Frontend (Next.js)</h3>
              <pre style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', overflowX: 'auto', fontSize: '14px', marginBottom: 0 }}>
{`cd frontend
npm install
npm run dev   # http://localhost:3000`}
              </pre>
            </Section>

            <Section id="status" title="Status: What's Real vs. What's a Stub 📍">
              <ul style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: 0 }}>
                <li>
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>✅ Working — </span>
                  <code>escrow</code> and <code>batch</code> Soroban contracts: real logic, real token transfers, 5/5 <code>cargo test</code> unit tests passing, compiles cleanly to <code>wasm32-unknown-unknown</code>.
                </li>
                <li>
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>✅ Working (frontend, session-local mock data) — </span>
                  the full register → hand off → confirm delivery → scan-to-verify → flag loop is genuinely interactive within a browser session, reading and writing through one typed data layer (<code>frontend/src/lib/verimed.ts</code>).
                </li>
                <li>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>🧱 Stub (real UI, seeded data) — </span>
                  <code>/dashboard/donor</code> and <code>/dashboard/regulator</code>: genuine aggregation logic reading from seeded mock data rather than live chain state.
                </li>
                <li>
                  <span style={{ color: '#f87171', fontWeight: 700 }}>❌ Not yet done — </span>
                  testnet/mainnet deployment, off-chain backend for evidence/geolocation storage, wallet-connect integration in the UI, camera-based QR/NFC scanning (the verify flow takes a typed/pasted code today).
                </li>
              </ul>
            </Section>
          </div>

          <div className="sticky-panel">
            <div className="glass-panel" style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
                On this page
              </p>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                    {s.label}
                  </a>
                ))}
              </nav>
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <a href="https://github.com/Coltrix-Lab/EngageX" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="btn-outline" style={{ width: '100%' }}>View on GitHub</button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
