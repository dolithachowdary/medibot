const API = 'http://localhost:3001/api';

export const Auth = (parent, onAuthSuccess, onBack) => {
  let mode = 'signin';
  let loading = false;
  let errorMsg = '';

  const setError = (msg) => {
    errorMsg = msg;
    const el = document.getElementById('auth-error');
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
  };

  const signinHTML = () => `
    <div style="margin-bottom: 1.2rem; padding-top: 2.5rem;">
      <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.3rem;">Welcome Back</h1>
    </div>

    <div class="auth-toggle-wrapper">
      <div class="auth-toggle-slider"></div>
      <button class="auth-toggle-btn active" id="toggle-signin">Sign In</button>
      <button class="auth-toggle-btn" id="toggle-signup">Sign Up</button>
    </div>

    <div id="auth-error" style="display:none; background:#fee2e2; color:#dc2626; border-radius:10px; padding:0.6rem 0.8rem; font-size:0.85rem; margin-bottom:0.5rem;"></div>

    <div class="input-group">
      <label>Email</label>
      <input type="email" id="identifier" placeholder="you@example.com">
    </div>

    <div class="input-group" style="margin-top: 0.5rem;">
      <label>Password</label>
      <input type="password" id="password" placeholder="••••••••">
    </div>

    <button class="btn-continue" id="auth-btn" style="margin-top: 1.2rem; border-radius: 50px;">Sign In</button>
    <p class="auth-note">New user? <span id="switch-signup">Sign up</span></p>
  `;

  const signupHTML = () => `
    <div style="margin-bottom: 0.8rem; padding-top: 2.5rem;">
      <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.3rem;">Create Account</h1>
    </div>

    <div class="auth-toggle-wrapper">
      <div class="auth-toggle-slider signup"></div>
      <button class="auth-toggle-btn" id="toggle-signin">Sign In</button>
      <button class="auth-toggle-btn active" id="toggle-signup">Sign Up</button>
    </div>

    <div class="signup-scroll">
      <div id="auth-error" style="display:none; background:#fee2e2; color:#dc2626; border-radius:10px; padding:0.6rem 0.8rem; font-size:0.85rem; margin-bottom:0.5rem;"></div>

      <div class="signup-section">
        <div class="input-group">
          <label>Full Name</label>
          <input type="text" id="name" placeholder="John Doe">
        </div>
        <div class="input-group">
          <label>Email</label>
          <input type="email" id="identifier" placeholder="you@example.com">
        </div>
        <div class="input-group">
          <label>Password</label>
          <input type="password" id="password" placeholder="••••••••">
        </div>
      </div>

      <p class="signup-divider-text">Help us analyse your reports more accurately</p>

      <div class="signup-section">
        <div class="signup-row">
          <div class="input-group" style="flex:1;">
            <label>Age</label>
            <input type="number" id="age" placeholder="25" min="1" max="120">
          </div>
          <div class="input-group" style="flex:1;">
            <label>Gender</label>
            <select id="gender">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div class="signup-row">
          <div class="input-group" style="flex:1;">
            <label>Weight (kg)</label>
            <input type="number" id="weight" placeholder="70">
          </div>
          <div class="input-group" style="flex:1;">
            <label>Height (cm)</label>
            <input type="number" id="height" placeholder="175">
          </div>
        </div>
        <div class="input-group">
          <label>Previous Medical Conditions</label>
          <input type="text" id="conditions" placeholder="e.g. Diabetes, Hypertension">
        </div>
      </div>

      <button class="btn-continue" id="auth-btn" style="margin-top: 1rem; border-radius: 50px; margin-bottom: 0.5rem;">Create Account</button>
      <p class="auth-note">Already have an account? <span id="switch-signin">Sign in</span></p>
    </div>
  `;

  const render = () => {
    parent.innerHTML = '';
    const container = document.createElement('div');
    container.className = `auth-container fade-in`;

    const backBtn = document.createElement('div');
    backBtn.className = 'btn-back';
    backBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
    backBtn.addEventListener('click', () => { if (onBack) onBack(); });
    container.appendChild(backBtn);

    const inner = document.createElement('div');
    inner.innerHTML = mode === 'signin' ? signinHTML() : signupHTML();

    inner.querySelector('#toggle-signin').addEventListener('click', () => {
      if (mode !== 'signin') { mode = 'signin'; errorMsg = ''; render(); }
    });
    inner.querySelector('#toggle-signup').addEventListener('click', () => {
      if (mode !== 'signup') { mode = 'signup'; errorMsg = ''; render(); }
    });

    const switchSignup = inner.querySelector('#switch-signup');
    if (switchSignup) switchSignup.addEventListener('click', () => { mode = 'signup'; errorMsg = ''; render(); });
    const switchSignin = inner.querySelector('#switch-signin');
    if (switchSignin) switchSignin.addEventListener('click', () => { mode = 'signin'; errorMsg = ''; render(); });

    inner.querySelector('#auth-btn').addEventListener('click', async () => {
      if (loading) return;
      setError('');
      const btn = inner.querySelector('#auth-btn');
      const email = inner.querySelector('#identifier')?.value?.trim();
      const password = inner.querySelector('#password')?.value;

      if (!email || !password) return setError('Please fill in all required fields.');

      loading = true;
      btn.textContent = '...';
      btn.disabled = true;

      try {
        if (mode === 'signup') {
          const name = inner.querySelector('#name')?.value?.trim();
          if (!name) { loading = false; btn.textContent = 'Create Account'; btn.disabled = false; return setError('Please enter your name.'); }

          const body = {
            name, email, password,
            age: inner.querySelector('#age')?.value || null,
            gender: inner.querySelector('#gender')?.value || null,
            weight: inner.querySelector('#weight')?.value || null,
            height: inner.querySelector('#height')?.value || null,
            conditions: inner.querySelector('#conditions')?.value || '',
          };

          const res = await fetch(`${API}/auth/signup`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
          });
          const data = await res.json();
          if (!res.ok) return setError(data.error || 'Signup failed.');
          localStorage.setItem('user', JSON.stringify(data.user));
          onAuthSuccess(data.user);

        } else {
          const res = await fetch(`${API}/auth/signin`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) return setError(data.error || 'Sign in failed.');
          localStorage.setItem('user', JSON.stringify(data.user));
          onAuthSuccess(data.user);
        }
      } catch (err) {
        setError('Cannot reach server. Is the API running?');
      } finally {
        loading = false;
        if (btn) { btn.textContent = mode === 'signin' ? 'Sign In' : 'Create Account'; btn.disabled = false; }
      }
    });

    container.appendChild(inner);
    parent.appendChild(container);
  };

  render();
};
