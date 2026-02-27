export const Auth = (parent, onAuthSuccess) => {
    let mode = 'signin'; // 'signin' or 'signup'

    const render = () => {
        parent.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'auth-container fade-in';

        container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
          ${mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          ${mode === 'signin' ? 'Sign in to stay healthy' : 'Join 10k+ users staying fit'}
        </p>
      </div>

      <div class="auth-toggle-wrapper">
        <div class="auth-toggle-slider ${mode === 'signup' ? 'signup' : ''}"></div>
        <button class="auth-toggle-btn ${mode === 'signin' ? 'active' : ''}" id="toggle-signin">Sign In</button>
        <button class="auth-toggle-btn ${mode === 'signup' ? 'active' : ''}" id="toggle-signup">Sign Up</button>
      </div>

      <div class="input-group">
        <label>Email or Phone</label>
        <input type="text" id="identifier" placeholder="Enter your email or phone">
      </div>

      <div class="input-group" style="margin-top: 1.5rem;">
        <label>Password</label>
        <input type="password" id="password" placeholder="••••••••">
      </div>

      <button class="btn-continue" id="auth-btn" style="margin-top: 2rem; border-radius: 50px;">
        ${mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>

      <p class="auth-note">
        ${mode === 'signin' ? "New user? <span id='switch-signup'>Sign up</span>" : "Already have an account? <span id='switch-signin'>Sign in</span>"}
      </p>
    `;

        // Event Listeners
        container.querySelector('#toggle-signin').addEventListener('click', () => {
            if (mode !== 'signin') {
                mode = 'signin';
                render();
            }
        });

        container.querySelector('#toggle-signup').addEventListener('click', () => {
            if (mode !== 'signup') {
                mode = 'signup';
                render();
            }
        });

        const switchSignup = container.querySelector('#switch-signup');
        if (switchSignup) switchSignup.addEventListener('click', () => { mode = 'signup'; render(); });

        const switchSignin = container.querySelector('#switch-signin');
        if (switchSignin) switchSignin.addEventListener('click', () => { mode = 'signin'; render(); });

        container.querySelector('#auth-btn').addEventListener('click', () => {
            // Mock auth for now
            onAuthSuccess({ email: container.querySelector('#identifier').value });
        });

        parent.appendChild(container);
    };

    render();
};
