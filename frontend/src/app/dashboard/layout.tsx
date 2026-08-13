'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Batch Registry',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    ),
  },
  {
    href: '/dashboard/register-batch',
    label: 'Register Batch',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
    ),
  },
  {
    href: '/dashboard/fund-program',
    label: 'Fund Program',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
    ),
  },
  {
    href: '/dashboard/donor',
    label: 'Donor Impact',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
    ),
  },
  {
    href: '/dashboard/regulator',
    label: 'Regulator View',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    ),
  },
  {
    href: '/dashboard/report',
    label: 'Report Counterfeit',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    ),
  },
  {
    href: '/verify',
    label: 'Scan to Verify',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="21" y2="21"></line><line x1="21" y1="14" x2="14" y2="21"></line></svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="dashboard-shell">
      {/* Background Mesh (Muted for Dashboard to improve readability) */}
      <div className="mesh-bg" style={{ opacity: 0.4, filter: 'blur(100px)' }}></div>

      {/* Mobile top bar */}
      <div className="dashboard-topbar">
        <div className="logo title-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          VeriMed
        </div>
        <button
          className="hamburger-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </div>

      {/* Overlay for mobile drawer */}
      <div
        className={`dashboard-overlay${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar${menuOpen ? ' is-open' : ''}`}>
        <div className="logo title-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px', fontSize: '24px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          VeriMed
        </div>

        <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', color: '#a1a1aa', fontWeight: '500', fontSize: '14px', marginBottom: '24px', border: '1px solid var(--border-color)' }} className="hover:bg-[rgba(255,255,255,0.05)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
            Back to Home
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                <div
                  style={
                    active
                      ? { padding: '12px 16px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(20, 184, 166, 0.2)' }
                      : { padding: '12px 16px', borderRadius: '12px', color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid transparent', transition: 'all 0.2s ease' }
                  }
                  className={active ? undefined : 'hover:bg-[rgba(255,255,255,0.05)]'}
                >
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
             <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '8px' }}>G-D9X...4L2M</p>
             <p style={{ fontSize: '24px', fontWeight: '800', margin: '0' }}>145 <span style={{ fontSize: '16px', color: '#a1a1aa' }}>XLM</span></p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
