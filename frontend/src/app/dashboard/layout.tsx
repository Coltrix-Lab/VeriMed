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
          EngageX
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255, 42, 133, 0.1)', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Explore Campaigns
            </div>
          </Link>
          <Link href="/dashboard/create-campaign" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              Create Campaign
            </div>
          </Link>
          <Link href="/dashboard/my-tasks" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              My Tasks
            </div>
          </Link>
          <Link href="/dashboard/wallet" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }} className="hover:bg-[rgba(255,255,255,0.05)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              Wallet & Earnings
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
