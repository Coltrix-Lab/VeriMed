import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Background Mesh (Muted for Dashboard to improve readability) */}
      <div className="mesh-bg" style={{ opacity: 0.4, filter: 'blur(100px)' }}></div>

      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--border-color)', padding: '32px 24px', position: 'relative', zIndex: 10, background: 'rgba(10, 10, 15, 0.4)', backdropFilter: 'blur(20px)' }}>
        <div className="logo title-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px', fontSize: '24px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          VeriMed
        </div>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', color: '#a1a1aa', fontWeight: '500', fontSize: '14px', marginBottom: '24px', border: '1px solid var(--border-color)' }} className="hover:bg-[rgba(255,255,255,0.05)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
            Back to Home
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Batch Registry
            </div>
          </Link>
          <Link href="/dashboard/register-batch" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              Register Batch
            </div>
          </Link>
          <Link href="/dashboard/fund-program" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              Fund Program
            </div>
          </Link>
          <Link href="/dashboard/donor" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              Donor Impact
            </div>
          </Link>
          <Link href="/dashboard/regulator" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Regulator View
            </div>
          </Link>
          <Link href="/dashboard/report" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Report Counterfeit
            </div>
          </Link>
          <Link href="/verify" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="21" y2="21"></line><line x1="21" y1="14" x2="14" y2="21"></line></svg>
              Scan to Verify
            </div>
          </Link>
        </nav>

        <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
             <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '8px' }}>G-D9X...4L2M</p>
             <p style={{ fontSize: '24px', fontWeight: '800', margin: '0' }}>145 <span style={{ fontSize: '16px', color: '#a1a1aa' }}>XLM</span></p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '48px', position: 'relative', zIndex: 10, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
