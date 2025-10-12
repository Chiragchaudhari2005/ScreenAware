import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import './signup.css';
import glogo from '../assests/glogo.webp';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { handleGoogleSignIn } from './authHandlers'; // Import the shared function

const SignupForm = ({ onNavigate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        uid: user.uid,
      });

      if (onNavigate) onNavigate('dashboard');
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Failed to create account. Email may already be in use.');
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
      setError('Google Sign-Up failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="signup-form">
      <div className="signup-header">
        <h2>Create your account!</h2>
      </div>

      <form onSubmit={handleManualSignUp}>
        <div className="signup-group">
          <label htmlFor="first">First name</label>
          <input type="text" id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="signup-group">
          <label htmlFor="last">Last name</label>
          <input type="text" id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="signup-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="signup-group">
          <label htmlFor="password">Password</label>
          <div className="signup-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="signup-password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign up'}
        </button>
        <button type="button" className="btn btn-google" onClick={googleSignIn} disabled={loading}>
          <img src={glogo} alt="Google Logo" className='google-logo'/> Sign up with Google
        </button>
      </form>

      <div className="signup-link-mod">
        <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Log in</a></p>
      </div>
    </div>
  );
};

export default SignupForm;