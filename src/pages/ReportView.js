const API = 'http://localhost:3001/api';

export const ReportView = (parent, { report, fileName, onBack }) => {
  function statusColor(s = '') {
    const m = s.toLowerCase();
    if (m === 'normal') return { bg: '#dcfce7', color: '#16a34a' };
    if (m === 'critical') return { bg: '#fee2e2', color: '#dc2626' };
    return { bg: '#fef3c7', color: '#d97706' }; // Abnormal / Needs Attention
  }

  function overallBadge(status) {
    const c = statusColor(status);
    return `<span style="background:${c.bg}; color:${c.color}; font-size:0.7rem; font-weight:700; padding:3px 10px; border-radius:50px; white-space:nowrap;">${status}</span>`;
  }

  const findings = Array.isArray(report.findings) ? report.findings : [];
  const recs = Array.isArray(report.recommendations) ? report.recommendations : [];
  const risks = Array.isArray(report.health_risks) ? report.health_risks : (Array.isArray(report.risk_factors) ? report.risk_factors : []);

  parent.innerHTML = `
    <div style="height:100%; display:flex; flex-direction:column; background:#f8fafc;">

      <!-- Header -->
      <div style="background:white; padding:1.1rem 1.2rem; display:flex; align-items:center; gap:0.6rem; border-bottom:1px solid #f1f5f9; flex-shrink:0;">
        <button id="report-view-back" style="background:none; border:none; cursor:pointer; display:flex; padding:0.2rem; color:var(--text-main);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div style="flex:1; min-width:0;">
          <p style="font-size:0.95rem; font-weight:800; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${report.lab_name || 'Lab Report'}</p>
          <p style="font-size:0.68rem; color:var(--text-muted);">${report.report_date || fileName}</p>
        </div>
        ${overallBadge(report.overall_status || 'Analysed')}
      </div>

      <!-- Scrollable body -->
      <div style="flex:1; overflow-y:auto; padding:1rem 1.1rem 2rem; display:flex; flex-direction:column; gap:1rem; scrollbar-width:none;">

        <!-- Summary card -->
        <div style="background:white; border-radius:16px; padding:1rem 1.1rem; border:1px solid #f1f5f9; box-shadow:0 2px 10px rgba(0,0,0,0.04);">
          <p style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">📋 Summary</p>
          <p style="font-size:0.83rem; color:#374151; line-height:1.6;">${report.summary || '—'}</p>
        </div>

        <!-- Findings -->
        ${findings.length ? `
        <div>
          <p style="font-size:0.78rem; font-weight:800; color:var(--text-main); margin-bottom:0.55rem;">🔬 Lab Findings</p>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            ${findings.map(f => {
    const c = statusColor(f.status);
    return `
              <div style="background:white; border-radius:14px; padding:0.85rem 1rem; border:1px solid #f1f5f9; box-shadow:0 1px 6px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                  <p style="font-weight:700; font-size:0.82rem; color:var(--text-main);">${f.name}</p>
                  <span style="background:${c.bg}; color:${c.color}; font-size:0.6rem; font-weight:700; padding:2px 8px; border-radius:50px; flex-shrink:0;">${f.status || '—'}</span>
                </div>
                <p style="font-size:0.78rem; color:${c.color}; font-weight:600;">${f.value} <span style="color:var(--text-muted); font-weight:400;">· Ref: ${f.reference_range || '—'}</span></p>
                ${f.insight ? `<p style="font-size:0.72rem; color:#64748b; margin-top:0.3rem; line-height:1.4;">${f.insight}</p>` : ''}
              </div>`;
  }).join('')}
          </div>
        </div>` : ''}

        <!-- Recommendations -->
        ${recs.length ? `
        <div style="background:#eff6ff; border-radius:16px; padding:1rem 1.1rem; border:1px solid #dbeafe;">
          <p style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.5rem;">💡 Recommendations</p>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:0.4rem;">
            ${recs.map(r => `<li style="font-size:0.78rem; color:#1e40af; display:flex; gap:0.4rem; line-height:1.4;"><span style="flex-shrink:0;">•</span>${r}</li>`).join('')}
          </ul>
        </div>` : ''}

        <!-- Risk factors -->
        ${risks.length ? `
        <div style="background:#fff7ed; border-radius:16px; padding:1rem 1.1rem; border:1px solid #fed7aa;">
          <p style="font-size:0.75rem; font-weight:700; color:#c2410c; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.5rem;">⚠️ Risk Factors</p>
          <ul style="list-style:none; display:flex; flex-direction:column; gap:0.4rem;">
            ${risks.map(r => `<li style="font-size:0.78rem; color:#9a3412; display:flex; gap:0.4rem; line-height:1.4;"><span style="flex-shrink:0;">•</span>${r}</li>`).join('')}
          </ul>
        </div>` : ''}

        <!-- Doctor Advice -->
        ${report.doctor_advice ? `
        <div style="background:#f0fdf4; border-radius:16px; padding:1rem 1.1rem; border:1px solid #bbf7d0;">
          <p style="font-size:0.75rem; font-weight:700; color:#15803d; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem;">�‍⚕️ Doctor's Advice</p>
          <p style="font-size:0.78rem; color:#166534; line-height:1.5;">${report.doctor_advice}</p>
        </div>` : ''}

        <!-- Disclaimer -->
        ${report.disclaimer ? `
        <div style="margin-top: 0.5rem; text-align: center;">
          <p style="font-size:0.65rem; color:#94a3b8; line-height:1.4;">${report.disclaimer}</p>
        </div>` : ''}

      </div>
    </div>
  `;

  parent.querySelector('#report-view-back').addEventListener('click', onBack);
};
