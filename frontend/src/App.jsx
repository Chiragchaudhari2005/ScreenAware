import React, { useState, useEffect } from 'react';
import AnimatedCharacters from './components/AnimatedCharacters';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import DataForm from './components/DataForm';
import Report from './components/Report';
import TipsPage from './components/TipsPage';
import AnalyticsDashboard from './components/Analytics';
import Navigation from './components/Navigation';
import './App.css';
import axios from "axios";
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/")
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const sendData = async () => {
    const data = { name: "Chirag", role: "Frontend-Backend Connector" };
    const response = await axios.post("http://localhost:8000/send-data", data);
    console.log(response.data);
  };

  // derive initial route from the current pathname so deep links work
  const pathToRoute = (path) => {
    if (!path) return 'landing';
    const p = path.replace(/^\//, '');
    if (p === 'login') return 'login';
    if (p === 'signup') return 'signup';
    if (p === 'home') return 'home';
    if (p === 'dashboard') return 'dashboard';
    if (p === 'tips') return 'tips';
    if (p === 'analytics') return 'analytics';
    return 'landing';
  };

  const routeToPath = (r) => {
    if (r === 'login') return '/login';
    if (r === 'signup') return '/signup';
    if (r === 'home') return '/home';
    if (r === 'dashboard') return '/dashboard';
    if (r === 'tips') return '/tips';
    if (r === 'analytics') return '/analytics';
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
      {route !== 'landing' && route !== 'login' && route !== 'signup' && (
        <Navigation 
          onNavigate={navigate} 
          currentRoute={route} 
          onLogout={() => {
            signOut(auth).then(() => {
              navigate('landing', { replace: true });
            }).catch((error) => {
              console.error("Error signing out:", error);
            });
          }}
        />
      )}
      <div>
        {/*<h1>React + FastAPI Connection</h1>
        <p>Message from backend: {message}</p>
        <button onClick={sendData}>Send Data to FastAPI</button> */}
      </div>
      {route === 'landing' ? (
        <LandingPage onNavigate={navigate} />
      ) : route === 'dashboard' ? (
        <Home onNavigate={navigate} />
      ) : route === 'dataform' ? (
        <DataForm onNavigate={navigate} />
      ) : route === 'report' ? (
        <Report onNavigate={navigate} />
      ) : route === 'tips' ? (
        <TipsPage onNavigate={navigate} />
      ) : route === 'analytics' ? (
        <AnalyticsDashboard onNavigate={navigate} />
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