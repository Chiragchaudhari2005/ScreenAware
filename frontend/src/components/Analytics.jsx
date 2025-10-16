import React, { useState, useEffect } from 'react';
import './Analytics.css';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { IoTrendingUpOutline, IoTrendingDownOutline } from 'react-icons/io5';
import axios from 'axios';

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
  const [timeRange, setTimeRange] = useState('7days');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real implementation, fetch data from backend based on timeRange
    const fetchData = async () => {
      try {
        // Replace with actual API endpoint
        // const response = await axios.get(`http://localhost:8000/analytics?range=${timeRange}`);
        // setData(response.data);
        setData(sampleData); // Using sample data for now
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div className="analytics-page-root">
      <div className="analytics-container">
        <header className="analytics-header">
          <h1>Your Wellness Analytics</h1>
          <p>Track your digital wellbeing progress and insights</p>
        </header>

        <div className="time-range-controls">
          <button
            className={`range-button ${timeRange === '7days' ? 'active' : ''}`}
            onClick={() => setTimeRange('7days')}
          >
            Last 7 Days
          </button>
          <button
            className={`range-button ${timeRange === '30days' ? 'active' : ''}`}
            onClick={() => setTimeRange('30days')}
          >
            Last 30 Days
          </button>
          <button
            className={`range-button ${timeRange === '90days' ? 'active' : ''}`}
            onClick={() => setTimeRange('90days')}
          >
            Last 90 Days
          </button>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <h3>Average Daily Screen Time</h3>
            <div className="summary-value">4.8h</div>
            <div className="summary-trend">
              <IoTrendingDownOutline className="trend-down" />
              <span>12% less than last week</span>
            </div>
          </div>
          <div className="summary-card">
            <h3>Average Sleep Duration</h3>
            <div className="summary-value">7.2h</div>
            <div className="summary-trend">
              <IoTrendingUpOutline className="trend-up" />
              <span>5% improvement</span>
            </div>
          </div>
          <div className="summary-card">
            <h3>Current Risk Level</h3>
            <div className="summary-value">Low</div>
            <div className="summary-trend">
              <IoTrendingDownOutline className="trend-down" />
              <span>Reduced from Medium</span>
            </div>
          </div>
          <div className="summary-card">
            <h3>Average Mood Rating</h3>
            <div className="summary-value">7.8</div>
            <div className="summary-trend">
              <IoTrendingUpOutline className="trend-up" />
              <span>Steady improvement</span>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Screen Time Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.weeklyScreenTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Mood Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.moodTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Mood Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card activity-chart">
            <h3>Activity Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.activityBalance}
                  dataKey="hours"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.activityBalance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;