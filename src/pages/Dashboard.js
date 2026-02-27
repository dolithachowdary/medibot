export const Dashboard = (parent, user) => {
    const render = () => {
        parent.innerHTML = `
      <div class="fade-in">
        <div class="dashboard-header" style="background: var(--primary); padding: 2.5rem 1.5rem 4rem 1.5rem; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; color: white;">
          <p style="opacity: 0.8; font-size: 0.9rem;">Welcome back,</p>
          <h1 style="font-size: 1.8rem; font-weight: 700;">${user?.name || 'User'}</h1>
          <div style="position: absolute; top: 2.5rem; right: 1.5rem; width: 44px; height: 44px; border-radius: 14px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
        </div>
        
        <div class="health-score-card">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">Health Score</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">You're doing great!</p>
          </div>
          <div class="score-circle">78</div>
        </div>
        
        <div style="padding: 0 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-weight: 700;">Daily Medication</h3>
            <span style="color: var(--primary); font-size: 0.85rem; font-weight: 600;">View All</span>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 0.8rem;">
            <div style="background: white; border-radius: 20px; padding: 1.2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 48px; height: 48px; background: #fee2e2; border-radius: 14px; display: flex; align-items: center; justify-content: center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg></div>
                <div>
                  <p style="font-weight: 700; color: var(--text-main);">Aspirin</p>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">8:00 AM • 500mg</p>
                </div>
              </div>
              <div style="width: 24px; height: 24px; border: 2px solid #e2e8f0; border-radius: 6px;"></div>
            </div>
            
            <div style="background: white; border-radius: 20px; padding: 1.2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 48px; height: 48px; background: #dcfce7; border-radius: 14px; display: flex; align-items: center; justify-content: center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.7 10-10 10Z"/><path d="M19 21c-2.43-1.84-2.8-5.59-3.41-8.31"/></svg></div>
                <div>
                  <p style="font-weight: 700; color: var(--text-main);">Vitamin D</p>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">2:00 PM • 1 Tab</p>
                </div>
              </div>
              <div style="width: 24px; height: 24px; border: 2px solid #e2e8f0; border-radius: 6px;"></div>
            </div>
          </div>
          
          <h3 style="margin: 2rem 0 1rem 0; font-weight: 700;">Quick Actions</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="background: white; padding: 1.5rem; border-radius: 24px; text-align: left; cursor: pointer; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
              <div style="width: 44px; height: 44px; background: #eff6ff; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg></div>
              <p style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">Upload Report</p>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">PDF or Image</p>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 24px; text-align: left; cursor: pointer; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
              <div style="width: 44px; height: 44px; background: #fdf2f8; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></div>
              <p style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">Talk to AI</p>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Health Assistant</p>
            </div>
          </div>
        </div>
        
        <div style="height: 100px;"></div> <!-- Spacer -->
        
        <!-- Bottom Nav -->
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; background: white; display: flex; justify-content: space-around; padding: 1rem 1.5rem 2rem 1.5rem; border-top: 1px solid #f1f5f9; box-shadow: 0 -10px 30px rgba(0,0,0,0.03); z-index: 10;">
          <div style="display: flex; flex-direction: column; align-items: center; color: var(--primary);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted);">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; color: var(--text-muted);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
      </div>
    `;
    };

    render();
};
