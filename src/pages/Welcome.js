export const Welcome = (parent, onComplete) => {
  let step = 1;

  const render = () => {
    parent.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'fade-in';
    container.style.height = '100%';

    // Common Back Button for steps > 1
    if (step > 1) {
      const backBtn = document.createElement('div');
      backBtn.className = 'btn-back';
      backBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
      backBtn.addEventListener('click', () => {
        step--;
        render();
      });
      container.appendChild(backBtn);
    }

    if (step === 1) {
      renderSplash(container);
    } else if (step === 2) {
      renderHub(container);
    } else if (step === 3) {
      renderReminders(container);
    } else if (step === 4) {
      onComplete(); // Move to Signup/Login
    }

    parent.appendChild(container);

    // Common Dot Navigation Logic
    const dots = container.querySelectorAll('.onboarding-dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        step = idx + 1;
        render();
      });
    });
  };

  const renderSplash = (container) => {
    const content = document.createElement('div');
    content.className = 'splash-container fade-in';
    content.innerHTML = `
      <div class="medical-symbol symbol-top">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6V2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3v4l4-4h4a2 2 0 0 0 2-2V6Z"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M9 13h6"/></svg>
      </div>
      <div class="medical-symbol symbol-bottom">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6V2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3v4l4-4h4a2 2 0 0 0 2-2V6Z"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M9 13h6"/></svg>
      </div>

      <div class="splash-content" style="margin-top: 2rem;">
        <div class="video-mascot-container">
          <video src="/mascot.mp4" autoplay muted playsinline></video>
          <div class="floating-badge badge-heart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#0052cc" stroke="#0052cc" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div class="floating-badge badge-chart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0052cc" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
        </div>

        <h1 class="splash-title" style="margin-top: 1.5rem;">AI Health Assistant</h1>
        <p class="splash-subtitle">Your personal medical companion for report analysis and health tracking.</p>
      </div>
      
      <div style="width: 100%; margin-top: auto; padding-bottom: 2.5rem;">
        <button class="btn-get-started" id="next-btn">
          Get Started 
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    `;
    content.querySelector('#next-btn').addEventListener('click', () => {
      step++;
      render();
    });
    container.appendChild(content);
  };

  const renderHub = (container) => {
    const content = document.createElement('div');
    content.className = 'feature-container fade-in';
    content.innerHTML = `
      <div>
        <div class="feature-header">
          <span class="feature-tag">Here's Your</span>
          <h1 class="feature-title">Smart Health Hub</h1>
        </div>

        <div class="hub-illustration">
          <div class="hub-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div class="hub-node node-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>
          <div class="hub-node node-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
          <div class="hub-node node-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></div>
          <div class="hub-node node-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></div>
        </div>

        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon-box" style="background: #ffedd5;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
            <div class="feature-text">Health Goals</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-box" style="background: #e0f2fe;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></div>
            <div class="feature-text">AI Suggestions</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-box" style="background: #f3e8ff;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></div>
            <div class="feature-text">Appointments / Reminders</div>
          </div>
        </div>
      </div>

      <div class="onboarding-footer">
        <div class="onboarding-dots">
          <div class="onboarding-dot"></div>
          <div class="onboarding-dot active"></div>
          <div class="onboarding-dot"></div>
        </div>
        <button class="btn-continue" id="next-btn">Continue</button>
      </div>
    `;
    content.querySelector('#next-btn').addEventListener('click', () => {
      step++;
      render();
    });
    container.appendChild(content);
  };

  const renderReminders = (container) => {
    const content = document.createElement('div');
    content.className = 'feature-container fade-in';
    content.innerHTML = `
      <div>
        <div class="feature-header">
          <span class="feature-tag">Stay On Track with</span>
          <h1 class="feature-title">Smart Reminders</h1>
        </div>

        <div style="height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
          <div style="width: 100px; height: 100px; background: #3b82f6; border-radius: 24px; display: flex; align-items: center; justify-content: center; transform: rotate(-5deg); box-shadow: 0 15px 30px rgba(59,130,246,0.3);">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="white"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
        </div>

        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon-box" style="background: #dcfce7;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div class="feature-text">Enable daily health check reminder</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-box" style="background: #fce7f3;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg></div>
            <div class="feature-text">Remind me to take medications</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon-box" style="background: #f1f5f9;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></div>
            <div class="feature-text">Sleep or hydration tracking</div>
          </div>
        </div>
      </div>

      <div class="onboarding-footer">
        <div class="onboarding-dots">
          <div class="onboarding-dot"></div>
          <div class="onboarding-dot"></div>
          <div class="onboarding-dot active"></div>
        </div>
        <button class="btn-continue" id="next-btn">Continue</button>
        <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem; cursor: pointer;">Skip</p>
      </div>
    `;
    content.querySelector('#next-btn').addEventListener('click', () => {
      step++;
      render();
    });
    container.appendChild(content);
  };

  render();
};
