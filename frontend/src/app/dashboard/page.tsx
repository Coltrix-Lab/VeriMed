import React from 'react';

const mockCampaigns = [
  { id: 1, company: "DefiLlama", task: "Retweet Pinned Post", reward: "5 XLM", platform: "Twitter 𝕏", pool: "5000 XLM left", logo: "🦙" },
  { id: 2, company: "Stellar Org", task: "Create TikTok explaining Soroban", reward: "250 XLM", platform: "TikTok 🎵", pool: "10,000 XLM left", logo: "⭐" },
  { id: 3, company: "Opensea", task: "Like & Comment on IG reel", reward: "2 USDC", platform: "Instagram 📸", pool: "50 USDC left", logo: "🌊" },
  { id: 4, company: "Polygon Labs", task: "Quote Tweet with #Polygon", reward: "8 MATIC", platform: "Twitter 𝕏", pool: "800 MATIC left", logo: "💜" },
  { id: 5, company: "EngageX App", task: "Join Discord & Verify", reward: "10 XLM", platform: "Discord 👾", pool: "2000 XLM left", logo: "✨" },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Explore Campaigns</h1>
          <p style={{ color: '#a1a1aa', fontSize: '16px' }}>Claim verified tasks and get paid directly to your Stellar wallet.</p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <select style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '12px', outline: 'none', cursor: 'pointer' }}>
            <option>All Platforms</option>
            <option>Twitter 𝕏</option>
            <option>TikTok 🎵</option>
            <option>Instagram 📸</option>
          </select>
          <button className="btn-outline">Sort By Reward</button>
        </div>
      </header>

      {/* Campaign Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {mockCampaigns.map((camp, index) => (
          <div key={camp.id} className="glass-panel" style={{ padding: '24px', animationDelay: `${index * 100}ms` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                   {camp.logo}
                 </div>
                 <div>
                   <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{camp.company}</h3>
                   <span style={{ fontSize: '12px', color: 'var(--accent)', background: 'rgba(0, 212, 255, 0.1)', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>{camp.platform}</span>
                 </div>
               </div>
               <div style={{ textAlign: 'right' }}>
                 <p style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>{camp.reward}</p>
                 <p style={{ fontSize: '11px', color: '#a1a1aa' }}>Per task</p>
               </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <p style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>📋 Task: <span style={{ color: 'white' }}>{camp.task}</span></p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-secondary)" }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>{camp.pool}</span>
               </div>
               <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>Claim Slot</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
