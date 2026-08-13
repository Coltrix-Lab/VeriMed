import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="mesh-bg"></div>
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
            <Link href="/docs"><button className="btn-outline">Documentation</button></Link>
            <Link href="/dashboard"><button className="btn-primary">Enter Dashboard</button></Link>
          </nav>
        </header>

        <section className="hero animate-fade-in" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.3)', borderRadius: '30px', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '32px' }}>
            🌍 1 in 10 medicines in circulation is falsified or substandard — WHO
          </div>
          <h1>
            Verified Medicine.<br/>
            <span className="title-gradient">Verified Delivery.</span>
          </h1>
          <p>
            An immutable chain of custody from manufacturer to patient, and donor-funded aid
            that releases only when delivery is confirmed on the ground — not promised on paper.
          </p>
          <div className="action-buttons">
            <Link href="/verify"><button className="btn-primary" style={{ padding: '18px 40px', fontSize: '18px' }}>Scan to Verify a Medicine</button></Link>
            <Link href="/dashboard"><button className="btn-outline" style={{ padding: '18px 40px', fontSize: '18px' }}>Enter Dashboard</button></Link>
          </div>
        </section>

        <section className="grid-cols-2 animate-fade-in delay-200" style={{ position: 'relative', zIndex: 10, paddingBottom: '48px' }}>

          <div className="glass-panel card-content">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(16, 185, 129, 0.2))', color: 'var(--primary)', border: '1px solid rgba(20, 184, 166, 0.3)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            </div>
            <h2 className="card-title">For the Supply Chain 💊</h2>
            <p className="card-desc">
              Manufacturers register batches on-chain with tamper-evident serials. Distributors,
              wholesalers, and pharmacies log every custody handoff. Any break in the expected
              chain, a duplicate scan, or a counterfeit report is visible immediately — to you and to regulators.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Immutable Custody Log</div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Regulator-Visible</div>
            </div>
            <Link href="/dashboard/register-batch"><button className="btn-primary" style={{ width: '100%', marginTop: '32px' }}>Register a Batch</button></Link>
          </div>

          <div className="glass-panel card-content delay-100">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(0, 119, 255, 0.2))', color: 'var(--accent)', border: '1px solid rgba(37, 99, 235, 0.3)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h2 className="card-title" style={{ color: 'var(--foreground)' }}>For Donors &amp; Regulators 🏛️</h2>
            <p className="card-desc">
              Fund a program, lock it in escrow, and release funds automatically only when a
              receiving clinic or CHW confirms delivery on-chain. Regulators get a live view of
              flagged batches and diversion hotspots across the whole network.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Release-on-Delivery Escrow</div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Exportable Impact Reports</div>
            </div>
            <Link href="/dashboard/fund-program"><button className="btn-accent" style={{ width: '100%', marginTop: '32px' }}>Fund a Program</button></Link>
          </div>

        </section>

        <section className="animate-fade-in delay-300" style={{ position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
          <div className="glass-panel card-content" style={{ textAlign: 'center' }}>
            <h2 className="card-title">For Patients — No Wallet Needed 📱</h2>
            <p className="card-desc" style={{ maxWidth: '640px', margin: '0 auto 24px' }}>
              Scan the code on any unit at the point of dispensing. Get a plain-language answer:
              genuine or flagged, in-date or expired — no crypto knowledge, no app install, no account.
            </p>
            <Link href="/verify"><button className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>Try the Scan-to-Verify Demo</button></Link>
          </div>
        </section>
      </main>
    </>
  );
}
