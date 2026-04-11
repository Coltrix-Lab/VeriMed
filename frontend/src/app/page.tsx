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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            EngageX
          </div>
          <nav className="action-buttons">
            <button className="btn-outline">Documentation</button>
            <Link href="/dashboard"><button className="btn-primary">Connect Wallet</button></Link>
          </nav>
        </header>

        <section className="hero animate-fade-in" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255, 42, 133, 0.1)', border: '1px solid rgba(255, 42, 133, 0.3)', borderRadius: '30px', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '32px' }}>
            ✨ The Next Generation of Decentralized Growth
          </div>
          <h1>
            Decentralized Trust.<br/>
            <span className="title-gradient">Real Engagement.</span>
          </h1>
          <p>
            Connect your wallet, claim tasks from top Web3 campaigns, and earn crypto instantly. 
            Smart Contracts lock Escrow funds, ensuring guaranteed payouts for authentic actions.
          </p>
          <div className="action-buttons">
            <Link href="/dashboard"><button className="btn-primary" style={{ padding: '18px 40px', fontSize: '18px' }}>Launch App</button></Link>
            <button className="btn-outline" style={{ padding: '18px 40px', fontSize: '18px' }}>Watch Demo</button>
          </div>
        </section>

        <section className="grid-cols-2 animate-fade-in delay-200" style={{ position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
          
          <div className="glass-panel card-content">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, rgba(255, 42, 133, 0.2), rgba(138, 43, 226, 0.2))', color: 'var(--primary)', border: '1px solid rgba(255, 42, 133, 0.3)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            </div>
            <h2 className="card-title">For Companies 🚀</h2>
            <p className="card-desc">
              Create campaigns, specify tasks (TikTok, X, Instagram), set your budget in XLM or USDC, and deposit funds to our immutable Soroban escrow. We handle user verification—you get authentic traffic.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>0% Upfront</div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Automated Verification</div>
            </div>
            <Link href="/dashboard/create-campaign"><button className="btn-primary" style={{ width: '100%', marginTop: '32px' }}>Create Campaign</button></Link>
          </div>

          <div className="glass-panel card-content delay-100">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 119, 255, 0.2))', color: 'var(--accent)', border: '1px solid rgba(0, 212, 255, 0.3)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h2 className="card-title" style={{ color: 'var(--foreground)' }}>For Users 💎</h2>
            <p className="card-desc">
              Log in with your Stellar wallet, browse active campaigns, perform on-chain and off-chain tasks, and upload your evidence. Once verified by admins, get paid instantly proportional to the pool.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Instant Payouts</div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>No Gas Fees</div>
            </div>
            <Link href="/dashboard"><button className="btn-accent" style={{ width: '100%', marginTop: '32px' }}>Start Earning</button></Link>
          </div>

        </section>
      </main>
    </>
  );
}
