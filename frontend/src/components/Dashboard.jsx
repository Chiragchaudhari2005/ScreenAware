import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // We will use the new, theme-consistent CSS file below

// --- YOUR ESSENTIAL IMPORTS ---
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import screenLogo from '../assests/sa-logo-1.png'; // Make sure this path is correct

// --- IMPORTS FOR THE NEW UI ---
import { IoSunnyOutline, IoMoonOutline, IoTrendingUpOutline, IoBulbOutline } from 'react-icons/io5';
import { FiTarget } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the chart. Later, you'll fetch this from your backend.
const weeklyData = [
  { name: 'Mon', screenTime: 4.5, sleep: 7 },
  { name: 'Tue', screenTime: 5.2, sleep: 6.5 },
  { name: 'Wed', screenTime: 3.8, sleep: 8 },
  { name: 'Thu', screenTime: 6.1, sleep: 6 },
  { name: 'Fri', screenTime: 4.2, sleep: 7.5 },
  { name: 'Sat', screenTime: 7.0, sleep: 8 },
  { name: 'Sun', screenTime: 3.5, sleep: 9 },
];

const Dashboard = ({ onNavigate }) => {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- YOUR LOGOUT FUNCTION (UNCHANGED) ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
    if (onNavigate) onNavigate('landing');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserName(null);
        setLoading(false);
        return;
      }

      try {
        const uref = doc(db, 'users', user.uid);
        const snap = await getDoc(uref);
        if (snap.exists()) {
          const data = snap.data();
          setUserName(data.firstName || user.displayName || user.email || 'User');
        } else {
          setUserName(user.displayName || user.email || 'User');
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setUserName(user.displayName || user.email || 'User');
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="dashboard-page-root">
      {/* ---------- A PROPER NAVIGATION BAR ---------- */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-logo">
          <img src={screenLogo} alt="ScreenAware Logo" />
          <span>ScreenAware</span>
        </div>
        <button className="btn-v2 btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </nav>

      {/* ---------- MAIN DASHBOARD CONTENT ---------- */}
      <main className="dashboard-container">
        <header className="dashboard-welcome-header">
          <h1>
            {getGreeting()}
            {userName ? `, ${userName}!` : '!'}
          </h1>
          <p>Here's your digital wellness summary for today.</p>
        </header>

        {/* ---------- KEY STATS GRID ---------- */}
        <section className="stats-grid">
          <div className="dashboard-card stat-card">
            <div className="icon-wrapper" style={{ backgroundColor: 'var(--lemon)' }}>
              <IoSunnyOutline className="icon" />
            </div>
            <div className="stat-info">
              <h4>Today's Screen Time</h4>
              <span>3h 45m</span>
            </div>
          </div>
          <div className="dashboard-card stat-card">
            <div className="icon-wrapper" style={{ backgroundColor: 'var(--light-blue)' }}>
              <IoMoonOutline className="icon" />
            </div>
            <div className="stat-info">
              <h4>Last Night's Sleep</h4>
              <span>7h 30m</span>
            </div>
          </div>
          <div className="dashboard-card stat-card">
            <div className="icon-wrapper" style={{ backgroundColor: 'var(--mint-green)' }}>
              <FiTarget className="icon" />
            </div>
            <div className="stat-info">
              <h4>Daily Goal</h4>
              <span>Under 4h</span>
            </div>
          </div>
        </section>

        {/* ---------- CHART & DATA INPUT SECTION ---------- */}
        <section className="main-content-grid">
          <div className="dashboard-card chart-card">
            <h3>Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 58, 89, 0.1)" />
                <XAxis dataKey="name" stroke="var(--light-gray)" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'var(--light-gray)' }} stroke="var(--light-gray)" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="screenTime" name="Screen Time" stroke="var(--coral)" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="sleep" name="Sleep" stroke="var(--diff-green)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="dashboard-card input-card">
            <h3>Log Today's Data</h3>
            <p>Consistency is key to understanding your habits.</p>
            <div className="input-group">
              <label htmlFor="sleep-hours">How many hours did you sleep?</label>
              <input id="sleep-hours" type="number" step="0.5" placeholder="e.g., 7.5" />
            </div>
            <button className="btn-v2 btn-log-data">Log Data</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;