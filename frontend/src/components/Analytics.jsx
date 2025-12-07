import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { IoTrendingUpOutline, IoTrendingDownOutline, IoRefreshOutline } from 'react-icons/io5';
import { auth } from '../firebase';
import axios from 'axios';
import './Analytics.css';

// Sample data (replace with actual API calls)
const sampleData = {
  weeklyScreenTime: [
    { day: 'Mon', hours: 5.2 },
    { day: 'Tue', hours: 4.8 },
    { day: 'Wed', hours: 6.1 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 5.5 },
    { day: 'Sat', hours: 3.2 },
    { day: 'Sun', hours: 2.8 }
  ],
  activityBalance: [
    { name: 'Work', hours: 25 },
    { name: 'Social Media', hours: 10 },
    { name: 'Entertainment', hours: 8 },
    { name: 'Learning', hours: 5 },
    { name: 'Other', hours: 7 }
  ],
  moodTrend: [
    { day: 'Mon', rating: 7.5 },
    { day: 'Tue', rating: 6.8 },
    { day: 'Wed', rating: 8.0 },
    { day: 'Thu', rating: 7.2 },
    { day: 'Fri', rating: 7.8 },
    { day: 'Sat', rating: 8.5 },
    { day: 'Sun', rating: 8.2 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [detailed, setDetailed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const [overviewRes, detailedRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/analytics/overview/${user.uid}`),
        axios.get(`http://localhost:8000/api/analytics/detailed/${user.uid}`)
      ]);

      setOverview(overviewRes.data);
      setDetailed(detailedRes.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!overview || !detailed) {
    return <div className="no-data">No data available</div>;
  }

  // Format category distribution data for pie chart
  const categoryData = Object.entries(overview.category_distribution).map(([name, value]) => ({
    name: name.split('_')[0], // Remove _hours suffix
    value: value
  }));

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>Your Digital Wellness Analytics</h1>
        <button onClick={fetchAnalytics} className="refresh-button">
          <IoRefreshOutline /> Refresh
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Daily Screen Time</h3>
          <div className="summary-value">{overview.average_screen_time.toFixed(1)}h</div>
          <div className="summary-trend">
            <IoTrendingUpOutline className="trend-up" />
            <span>vs Last Week</span>
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Average Mood</h3>
          <div className="summary-value">{overview.average_mood.toFixed(1)}/5</div>
          <div className="summary-trend">
            <IoTrendingUpOutline className="trend-up" />
            <span>Positive trend</span>
          </div>
        </div>

        <div className="summary-card">
          <h3>Sleep Duration</h3>
          <div className="summary-value">{overview.average_sleep.toFixed(1)}h</div>
          <div className="summary-trend">
            <IoTrendingUpOutline className="trend-up" />
            <span>Improving</span>
          </div>
        </div>

        <div className="summary-card">
          <h3>Current Profile</h3>
          <div className="summary-value">{overview.most_common_cluster}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Screen Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overview.screen_time_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="daily_screen_time_hours" 
                stroke="#8884d8" 
                name="Screen Time (hours)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Weekly Averages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={detailed.weekly_averages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="daily_screen_time_hours" name="Screen Time" fill="#8884d8" />
              <Bar dataKey="mood_rating" name="Mood" fill="#82ca9d" />
              <Bar dataKey="sleep_duration_hours" name="Sleep" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card risk-distribution">
          <h3>Risk Level Distribution</h3>
          <div className="risk-levels">
            {Object.entries(overview.risk_level_distribution).map(([level, count]) => (
              <div key={level} className="risk-level-item">
                <span className="risk-label">{level}</span>
                <div className="risk-bar-container">
                  <div 
                    className={`risk-bar risk-${level.toLowerCase()}`} 
                    style={{width: `${(count / Object.values(overview.risk_level_distribution).reduce((a, b) => a + b, 0)) * 100}%`}}
                  ></div>
                </div>
                <span className="risk-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;