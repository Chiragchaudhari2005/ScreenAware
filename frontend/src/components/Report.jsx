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

  const { riskLevel, moodRating, dominantCategory, clusterLabel } = report;
  const riskText = riskLevel > 70 ? 'High' : riskLevel > 40 ? 'Moderate' : 'Low';

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
            <div className="report-value">{riskText} <span className="small">({riskLevel})</span></div>
          </div>
          <div className="report-item">
            <h4>Mood Rating</h4>
            <div className="report-value">{moodRating} / 5</div>
          </div>
          <div className="report-item">
            <h4>Dominant Category</h4>
            <div className="report-value">{dominantCategory}</div>
          </div>
          <div className="report-item">
            <h4>Cluster Label</h4>
            <div className="report-value">{clusterLabel}</div>
          </div>
        </div>

        <div className="actions" style={{marginTop: '1.25rem'}}>
          <button className="btn-primary" onClick={()=> onNavigate && onNavigate('dashboard')}>Back to Dashboard</button>
          <button className="btn-secondary" onClick={()=> onNavigate && onNavigate('dataform')}>Edit & Regenerate</button>
        </div>
      </div>
    </div>
  );
};

export default Report;
