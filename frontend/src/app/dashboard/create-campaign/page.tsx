import React from 'react';

export default function CreateCampaign() {
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Launch a Campaign <span style={{ fontSize: '24px' }}>🚀</span>
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '16px' }}>
          Lock your XLM/USDC in the Smart Contract Escrow and automate your growth.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '48px' }}>
        
        {/* Creation Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
           <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             
             {/* Platform Selection */}
             <div>
               <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#e2e8f0' }}>Target Platform</label>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', background: 'rgba(255, 42, 133, 0.1)', border: '1px solid var(--primary)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontWeight: '600', color: 'var(--foreground)' }}>Twitter 𝕏</div>
                  <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontWeight: '600', color: '#a1a1aa' }}>TikTok 🎵</div>
                  <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', fontWeight: '600', color: '#a1a1aa' }}>Instagram 📸</div>
               </div>
             </div>

             {/* Task Description */}
             <div>
               <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#e2e8f0' }}>Task Description</label>
               <input 
                 type="text" 
                 placeholder="e.g. Quote Tweet the pinned post using #EngageX" 
                 style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '16px' }}
               />
             </div>

             {/* Reward Structure */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#e2e8f0' }}>Reward Per User</label>
                   <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                      <input type="number" placeholder="5" style={{ flex: 1, padding: '16px', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '16px' }} />
                      <div style={{ padding: '16px', borderLeft: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>XLM</div>
                   </div>
                </div>

                <div>
                   <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#e2e8f0' }}>Max Participants</label>
                   <input type="number" placeholder="1000" style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '16px' }} />
                </div>
             </div>

           </form>
        </div>

        {/* Escrow Tracker Overview */}
        <div>
           <div className="glass-panel" style={{ padding: '32px', position: 'sticky', top: '24px', background: 'linear-gradient(180deg, rgba(20,20,30,0.6) 0%, rgba(20,20,30,0.9) 100%)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Vault Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#cbd5e1' }}>
                 <span>Payout Pool</span>
                 <span style={{ fontWeight: 'bold', color: 'white' }}>5,000 XLM</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: '#cbd5e1' }}>
                 <span>Est. 15% Comm. (Upon success)</span>
                 <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>750 XLM</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '24px', marginBottom: '32px' }}>
                 <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Escrow Lock</span>
                 <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent)' }}>5,750 XLM</span>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '18px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                 Sign & Deploy
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: '#a1a1aa', marginTop: '16px' }}>This will trigger a Soroban Smart Contract transaction.</p>
           </div>
        </div>

      </div>
    </div>
  );
}
