import React, { useState, useEffect } from 'react';
import AnimatedCharacters from './components/AnimatedCharacters';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  // derive initial route from the current pathname so deep links work
  const pathToRoute = (path) => {
    if (!path) return 'landing';
    const p = path.replace(/^\//, '');
    if (p === 'login') return 'login';
    if (p === 'signup') return 'signup';
    if (p === 'dashboard') return 'dashboard';
    return 'landing';
  };

  const routeToPath = (r) => {
    if (r === 'login') return '/login';
    if (r === 'signup') return '/signup';
    if (r === 'dashboard') return '/dashboard';
    return '/';
  };

  const [route, setRoute] = useState(() => pathToRoute(window.location.pathname)); // 'landing' | 'login' | 'signup'

  // navigate updates app state and browser history so back/forward works
  const navigate = (to, { replace = false } = {}) => {
    const url = routeToPath(to);
    try {
      if (replace) window.history.replaceState({ route: to }, '', url);
      else window.history.pushState({ route: to }, '', url);
    } catch (e) {
      // ignore (e.g., when running in unusual environments)
    }
    setRoute(to);
  };

  useEffect(() => {
    const onPop = (event) => {
      // try event.state first, fall back to URL
      const stateRoute = event.state && event.state.route;
      if (stateRoute) setRoute(stateRoute);
      else setRoute(pathToRoute(window.location.pathname));
    };

    window.addEventListener('popstate', onPop);
    // ensure the current state is in history so back works from here
    window.history.replaceState({ route }, '', routeToPath(route));

    return () => window.removeEventListener('popstate', onPop);
  }, [route]);

  return (
    <div>
      {route === 'landing' ? (
        <LandingPage onNavigate={navigate} />
      ) : route === 'dashboard' ? (
        <Dashboard onNavigate={navigate} />
      ) : (
        <div className="login-container">
          <div className="animation-container">
            <AnimatedCharacters isPasswordFocused={isPasswordFocused} />
          </div>
          <div className="form-container">
            {route === 'login' ? (
              <LoginForm
                onPasswordFocus={() => setIsPasswordFocused(true)}
                onPasswordBlur={() => setIsPasswordFocused(false)}
                onNavigate={navigate}
              />
            ) : (
              <SignupForm onNavigate={navigate} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;