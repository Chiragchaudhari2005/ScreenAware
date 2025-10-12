import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import glogo from '../assests/glogo.webp';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { handleGoogleSignIn } from './authHandlers'; // Import the shared function

const LoginForm = ({ onPasswordFocus, onPasswordBlur, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onNavigate) onNavigate('dashboard');
    } catch (err) {
      console.error("Error logging in:", err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setError('');
    setLoading(true);
    const success = await handleGoogleSignIn();
    if (success && onNavigate) {
      onNavigate('dashboard');
    } else if (!success) {
      setError('Google Sign-In failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <h2>Welcome to ScreenAware!</h2>
      </div>

      <form onSubmit={handleManualLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={onPasswordFocus}
              onBlur={onPasswordBlur}
              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <div className="form-options">
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="btn btn-login" disabled={loading}>
          {loading ? 'Logging In...' : 'Log in'}
        </button>
        <button type="button" className="btn btn-google" onClick={googleSignIn} disabled={loading}>
          <img src={glogo} alt="Google Logo" className='google-logo'/> Log in with Google
        </button>
      </form>

      <div className="signup-link">
        <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('signup'); }}>Sign up</a></p>
      </div>
    </div>
  );
};

export default LoginForm;