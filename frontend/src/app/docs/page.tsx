import React from 'react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'overview', label: 'What Is VeriMed' },
  { id: 'problem', label: 'The Problem' },
  { id: 'solution', label: 'The VeriMed Solution' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'roles', label: 'Who Uses VeriMed' },
  { id: 'navigating', label: 'Navigating the App' },
  { id: 'why', label: 'Why VeriMed' },
  { id: 'faq', label: 'FAQ' },
];

const ROLES: { role: string; does: string }[] = [
  { role: 'Manufacturer', does: 'Registers batches, mints serial codes, logs initial custody.' },
  { role: 'Distributor / Wholesaler', does: 'Logs custody handoff events as stock moves through the chain.' },
  { role: 'Pharmacy / Clinic', does: 'Receives stock (logs handoff), scans to verify before dispensing.' },
  { role: 'Regulator', does: 'Read access to chain-of-custody and counterfeit-report data; dashboard of flagged batches and diversion hotspots.' },
  { role: 'Donor / Sponsor', does: 'Funds an escrow pool tied to a shipment or program; views delivery confirmation and impact reporting.' },
  { role: 'Receiving Clinic / CHW', does: 'Confirms last-mile delivery by scanning on arrival; may be disbursed to from escrow.' },
  { role: 'Consumer / Patient', does: 'Scans a unit at point of use to verify authenticity — no wallet required.' },
  { role: 'Platform Admin', does: 'Oversight dashboard, dispute resolution for contested custody events or counterfeit reports.' },
];

const NAV_GUIDE: { page: string; path: string; who: string; what: string }[] = [
  { page: 'Scan to Verify', path: '/verify', who: 'Anyone', what: 'Check a medicine on the spot — genuine or flagged, in-date or expired. No account, no wallet.' },
  { page: 'Batch Registry', path: '/dashboard', who: 'All supply-chain roles', what: 'A live view of every registered batch and where it currently sits in the custody chain.' },
  { page: 'Register Batch', path: '/dashboard/register-batch', who: 'Manufacturers, distributors', what: 'Register a new batch, or log a custody handoff as stock moves to the next hand.' },
  { page: 'Fund Program', path: '/dashboard/fund-program', who: 'Donors, sponsors', what: 'Lock funds into an escrow tied to a shipment or program, ready to release on confirmed delivery.' },
  { page: 'Donor Impact', path: '/dashboard/donor', who: 'Donors, sponsors', what: 'Track delivery confirmations against funded programs and export impact reports.' },
  { page: 'Regulator View', path: '/dashboard/regulator', who: 'Regulators', what: 'Monitor flagged batches and diversion hotspots across the entire network.' },
  { page: 'Report Counterfeit', path: '/dashboard/report', who: 'Anyone', what: 'Flag a suspicious batch. The report is logged on-chain and surfaces immediately in the Regulator View.' },
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
            What VeriMed is, the problem it exists to solve, and how to find your way around the app.
          </p>
        </section>

        <section className="two-col-grid animate-fade-in delay-100" style={{ position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
          <div>
            <Section id="overview" title="What Is VeriMed 💊">
              <p className="card-desc" style={{ marginBottom: 0 }}>
                VeriMed is a blockchain-based platform that proves two things people currently have to take on faith:
                that a medicine in someone&apos;s hand is genuine, and that donor-funded aid actually reached the
                clinic it was meant for. It does this with an immutable chain of custody from manufacturer to
                patient, and an escrow that only pays out once delivery is confirmed on the ground — not promised
                on paper.
              </p>
            </Section>

            <Section id="problem" title="The Problem 🌍">
              <p className="card-desc">
                An estimated <strong style={{ color: 'var(--foreground)' }}>1 in 10 medical products</strong> in
                low- and middle-income countries is substandard or falsified (WHO). Fake antimalarials, underdosed
                antibiotics, diluted insulin — this kills patients directly and drives antimicrobial resistance
                globally. It isn&apos;t a single-country problem: every country with a pharmaceutical supply chain
                is exposed.
              </p>
              <p className="card-desc" style={{ marginBottom: 0 }}>
                A related, compounding problem: donor-funded medicine routinely leaks before it reaches the clinic
                it was intended for — stock stolen or diverted in transit, with little to no verifiable proof of
                where the loss happened. Donors and aid funders have no reliable way to prove delivery, only to
                hope for it.
              </p>
            </Section>

            <Section id="solution" title="The VeriMed Solution ✅">
              <p className="card-desc">
                VeriMed closes both gaps with two integrated layers, built on the same underlying custody chain:
              </p>
              <ul style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 0 }}>
                <li>
                  <strong style={{ color: 'var(--foreground)' }}>Traceability, manufacturer to pharmacy</strong> —
                  every batch gets a tamper-evident code at manufacture, and every handoff along the way is logged
                  immutably. Anyone can scan a unit and instantly see whether it&apos;s genuine, in-date, and moved
                  through the expected hands.
                </li>
                <li>
                  <strong style={{ color: 'var(--foreground)' }}>Verified, escrow-backed aid delivery</strong> —
                  donor funds sit in escrow, locked to a shipment or program, and release automatically only when
                  the receiving clinic or Community Health Worker confirms arrival. No more funding on a promise.
                </li>
              </ul>
            </Section>

            <Section id="how-it-works" title="How It Works 🔗">
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>Verifying a medicine</h3>
              <ol style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <li>A manufacturer registers a batch on-chain with product details and a unique batch ID.</li>
                <li>Every custody handoff — distributor, wholesaler, pharmacy — is logged as a signed event, building an unbroken trail.</li>
                <li>At the point of dispensing, anyone scans the code and gets an instant, plain-language result: genuine or flagged, in-date or expired.</li>
                <li>Anything that looks wrong can be flagged by any participant, surfacing immediately to regulators.</li>
              </ol>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>Funding verified delivery</h3>
              <ol style={{ paddingLeft: '20px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 0 }}>
                <li>A donor funds a program, and the funds are locked into an on-chain escrow — not just pledged.</li>
                <li>The shipment moves through the same custody chain used for verification.</li>
                <li>The receiving clinic or CHW scans the batch on arrival, confirming delivery on-chain.</li>
                <li>Only then does the escrow release: commission is split out automatically, and the remainder goes to the confirmed recipients. Unspent funds roll over rather than disappearing.</li>
              </ol>
            </Section>

            <Section id="roles" title="Who Uses VeriMed 🗺️">
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

            <Section id="navigating" title="Navigating the App 🧭">
              <p className="card-desc">
                Everything in VeriMed lives in one of two places: the public <strong style={{ color: 'var(--foreground)' }}>Scan to Verify</strong> flow,
                which needs no login, and the <strong style={{ color: 'var(--foreground)' }}>Dashboard</strong>, where
                supply-chain participants, donors, and regulators work.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--primary)', fontSize: '14px' }}>Page</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--primary)', fontSize: '14px' }}>For</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: 'var(--primary)', fontSize: '14px' }}>What you can do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NAV_GUIDE.map((n) => (
                      <tr key={n.path}>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                          <Link href={n.path} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{n.page}</Link>
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: '#cbd5e1', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{n.who}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)', color: '#cbd5e1' }}>{n.what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="why" title="Why VeriMed 💡">
              <p className="card-desc">
                Right now, a patient has to trust that what&apos;s in the packet matches the label, and a donor has
                to trust that the shipment they paid for actually reached the people it was meant for. Neither of
                them has a real way to check. That gap is where counterfeit medicine and diverted aid both live —
                and it&apos;s the gap VeriMed was built to close.
              </p>
              <p className="card-desc" style={{ marginBottom: 0 }}>
                We replace &ldquo;trust me&rdquo; with a shared record anyone can check — one that no single party,
                including us, can quietly edit after the fact. Not because people are assumed to be dishonest, but
                because the people this fails first — patients, and the communities aid is meant to reach — are the
                ones with the least power to demand better. VeriMed exists to move medicine and aid from things we
                hope arrived safely to things we can prove did.
              </p>
            </Section>

            <Section id="faq" title="Frequently Asked Questions ❓">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '6px' }}>Do I need a crypto wallet to verify a medicine?</p>
                  <p className="card-desc" style={{ marginBottom: 0 }}>No. Scanning and verifying is fully walletless — it&apos;s built for patients and pharmacy staff, not crypto users.</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '6px' }}>Who can register a batch or move custody?</p>
                  <p className="card-desc" style={{ marginBottom: 0 }}>Only wallet-authenticated supply-chain participants — manufacturers, distributors, wholesalers, and pharmacies/clinics — can write custody events.</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '6px' }}>What happens when a batch is flagged?</p>
                  <p className="card-desc" style={{ marginBottom: 0 }}>The flag is recorded on-chain against that batch and appears immediately in the Regulator View, alongside its full custody history.</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '6px' }}>How do donor funds actually get released?</p>
                  <p className="card-desc" style={{ marginBottom: 0 }}>Funds are locked in escrow when a program is created. They release automatically once a delivery-confirmation event fires — there&apos;s no manual approval step a donor has to chase.</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '6px' }}>Is the data on VeriMed public?</p>
                  <p className="card-desc" style={{ marginBottom: 0 }}>Custody and delivery events are public and auditable by design — that&apos;s what makes verification possible. Participants are identified by wallet address, not personal identity.</p>
                </div>
              </div>
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
                <Link href="/verify" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%' }}>Try the Demo</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
