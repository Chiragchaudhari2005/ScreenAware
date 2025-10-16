import React, { useEffect, useState } from 'react';
import './Report.css';

const Report = ({ onNavigate }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Try to get report from history state (pushed by DataForm)
    const s = window.history.state;
    if (s && s.report) {
      setReport(s.report);
      localStorage.setItem('screenaware_report', JSON.stringify(s.report));
      return;
    }
    // Try localStorage fallback
    const stored = localStorage.getItem('screenaware_report');
    if (stored) {
      try {
        setReport(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  if (!report) {
    return (
      <div className="report-root">
        <div className="report-card">
          <h2>Report</h2>
          <p className="muted">No report data found. Please generate a report first.</p>
          <div className="actions">
            <button className="btn-primary" onClick={()=> onNavigate && onNavigate('dataform')}>Open Form</button>
            <button className="btn-secondary" onClick={()=> onNavigate && onNavigate('dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const { risk_level, mood_rating, dominant_category, cluster_label } = report;

  // Get risk color based on risk level string
  const getRiskColor = (riskLevel) => {
    switch(riskLevel?.toLowerCase()) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#888';
    }
  };

  const riskColor = getRiskColor(risk_level);

  return (
    <div className="report-root">
      <div className="report-card">
        <div className="report-header">
          <h2>Your Digital Wellness Report</h2>
          <p className="muted">Results below are powered by the backend ML models.</p>
        </div>

        <div className="report-grid">
          <div className="report-item">
            <h4>Risk Level</h4>
            <div 
              className="report-value" 
              style={{ color: riskColor, fontWeight: 'bold' }}
            >
              {risk_level || 'Unknown'}
            </div>
            <p className="risk-description">
              {risk_level === 'High' && 'Consider reducing screen time and improving sleep habits'}
              {risk_level === 'Medium' && 'Maintain balance in your digital activities'}
              {risk_level === 'Low' && 'Great job maintaining healthy digital habits!'}
            </p>
          </div>
          
          <div className="report-item">
            <h4>Mood Rating</h4>
            <div className="report-value">
              {mood_rating} / 5
              <div className="mood-bar">
                <div 
                  className="mood-fill"
                  style={{ width: `${(mood_rating / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="mood-description">
              {mood_rating >= 4 && 'Excellent mood balance!'}
              {mood_rating === 3 && 'Good overall mood'}
              {mood_rating <= 2 && 'Consider activities to improve mood'}
            </p>
          </div>
          
          <div className="report-item">
            <h4>Dominant Category</h4>
            <div className="report-value">{dominant_category || 'Unknown'}</div>
            <p className="category-description">
              Your primary screen time category
            </p>
          </div>
          
          {/* <div className="report-item">
            <h4>Usage Pattern</h4>
            <div className="report-value">{cluster_label || 'Unknown'}</div>
            <p className="cluster-description">
              Your digital usage behavior pattern
            </p>
          </div> */}
        </div>

        <div className="recommendations">
          <h4>Recommendations</h4>
          <ul>
            {risk_level === 'High' && (
              <>
                <li>Reduce daily screen time by 2-3 hours</li>
                <li>Aim for 7-8 hours of sleep per night</li>
                <li>Incorporate physical activity into your routine</li>
                <li>Take regular breaks from screens every hour</li>
              </>
            )}
            {risk_level === 'Medium' && (
              <>
                <li>Maintain your current screen time balance</li>
                <li>Continue with good sleep habits</li>
                <li>Monitor stress levels regularly</li>
                <li>Consider digital detox periods</li>
              </>
            )}
            {risk_level === 'Low' && (
              <>
                <li>Continue your healthy digital habits</li>
                <li>Share your strategies with others</li>
                <li>Regularly reassess your digital wellness</li>
                <li>Maintain work-life-digital balance</li>
              </>
            )}
          </ul>
        </div>

        <div className="actions" style={{marginTop: '1.25rem'}}>
          <button className="btn-primary" onClick={()=> onNavigate && onNavigate('dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn-secondary" onClick={()=> onNavigate && onNavigate('dataform')}>
            Edit & Regenerate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;