import './style.css'
import { Welcome } from './pages/Welcome.js';
import { Auth } from './pages/Auth.js';
import { Dashboard } from './pages/Dashboard.js';

const app = document.querySelector('#app')

let state = {
  screen: 'onboarding',
  user: null
}

// Restore session on load
const savedUser = localStorage.getItem('user');
if (savedUser) {
  try {
    state.user = JSON.parse(savedUser);
    state.screen = 'dashboard';
  } catch (_) {
    localStorage.removeItem('user');
  }
}

const render = () => {
  app.innerHTML = '<div class="app-content" id="scroll-container"></div>'
  const container = document.getElementById('scroll-container')

  if (state.screen === 'onboarding') {
    Welcome(container, () => {
      state.screen = 'auth';
      render();
    });
  } else if (state.screen === 'auth') {
    Auth(container, (userData) => {
      state.user = userData;
      state.screen = 'dashboard';
      render();
    }, () => {
      state.screen = 'onboarding';
      render();
    });
  } else if (state.screen === 'dashboard') {
    Dashboard(container, state.user)
  }
}

render()
