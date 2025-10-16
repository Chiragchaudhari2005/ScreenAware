import React, { useState } from 'react';
import { IoMenu, IoClose } from 'react-icons/io5';
import './Navigation.css';
import screenLogo from '../assests/sa-logo-1.png';

const Navigation = ({ currentRoute, onNavigate, onLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNavigate = (route) => {
    onNavigate(route);
    setShowMobileMenu(false);
  };

  return (
    <nav className="nav-bar">
      <div 
        className="nav-logo" 
        onClick={() => handleNavigate('home')}
        style={{ cursor: 'pointer' }}
      >
        <img src={screenLogo} alt="ScreenAware Logo" />
        <span>ScreenAware</span>
      </div>

      <button 
        className="mobile-menu-button"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <IoClose /> : <IoMenu />}
      </button>

      <div className={`nav-links ${showMobileMenu ? 'show' : ''}`}>
        {/* <a 
          className={`nav-link ${currentRoute === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigate('home')}
        >
          Home
        </a> */}
        <a 
          className={`nav-link ${currentRoute === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigate('dashboard')}
        >
          Home
        </a>
        <a 
          className={`nav-link ${currentRoute === 'tips' ? 'active' : ''}`}
          onClick={() => handleNavigate('tips')}
        >
          Tips
        </a>
        <a 
          className={`nav-link ${currentRoute === 'analytics' ? 'active' : ''}`}
          onClick={() => handleNavigate('analytics')}
        >
          Analytics
        </a>
        <a 
          className={`nav-link ${currentRoute === 'games' ? 'active' : ''}`}
          onClick={() => handleNavigate('games')}
        >
          Games
        </a> 
      </div>

      <div className="nav-actions">
        <button className="btn-v2 btn-logout" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navigation;