import './style.css'
import { Welcome } from './pages/Welcome.js';
import { Auth } from './pages/Auth.js';
import { UserDetails } from './pages/UserDetails.js';
import { Dashboard } from './pages/Dashboard.js';

const app = document.querySelector('#app')

// State Management
let state = {
  screen: 'onboarding', // onboarding, auth, user-details, dashboard
  user: null
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
      // After auth, check if they need to setup profile or go to dashboard
      // For now, if it's signup, go to user-details, if login, go to dashboard
      localStorage.setItem('user', JSON.stringify(userData));
      state.screen = 'user-details';
      render();
    });
  } else if (state.screen === 'user-details') {
    UserDetails(container, (userData) => {
      state.user = userData
      state.screen = 'dashboard'
      render()
    })
  } else if (state.screen === 'dashboard') {
    Dashboard(container, state.user)
  }
}

// Initial render
render()
