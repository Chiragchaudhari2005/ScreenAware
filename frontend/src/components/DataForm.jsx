import React, { useState } from 'react';
import './DataForm.css';
import axios from 'axios';

const emojiScale = ['😢','😕','😐','🙂','😄'];

const categories = [
  { key: 'social_media_hours', label: 'Social Media' },
  { key: 'gaming_hours', label: 'Gaming' },
  { key: 'entertainment_hours', label: 'Entertainment' },
  { key: 'work_related_hours', label: 'Work Related' }
];

const DataForm = ({ onNavigate }) => {
  const [form, setForm] = useState({
    daily_screen_time_hours: '',
    sleep_duration_hours: '',
    stress_level: 3,
    sleep_quality: 3,
    physical_activity_hours_per_week: '',
    social_media_hours: '',
    gaming_hours: '',
    entertainment_hours: '',
    work_related_hours: ''
  });

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleGenerate = async () => {
    try {
      // Send to backend
      // Ensure all fields are numbers and present
      const payload = {
        daily_screen_time_hours: parseFloat(form.daily_screen_time_hours) || 0,
        sleep_duration_hours: parseFloat(form.sleep_duration_hours) || 0,
        stress_level: parseFloat(form.stress_level) || 0,
        sleep_quality: parseFloat(form.sleep_quality) || 0,
        physical_activity_hours_per_week: parseFloat(form.physical_activity_hours_per_week) || 0,
        social_media_hours: parseFloat(form.social_media_hours) || 0,
        gaming_hours: parseFloat(form.gaming_hours) || 0,
        entertainment_hours: parseFloat(form.entertainment_hours) || 0,
        work_related_hours: parseFloat(form.work_related_hours) || 0
      };
      const res = await axios.post('http://localhost:8000/predict_report', payload);
      const backend = res.data;
      // Find dominant category client-side
      const num = (s) => parseFloat(s) || 0;
      let dominant = 'Other';
      let maxV = -1;
      categories.forEach(c => {
        const v = num(form[c.key]);
        if (v > maxV) { maxV = v; dominant = c.label; }
      });
      const report = {
        riskLevel: backend.risk_level,
        moodRating: backend.mood_rating,
        dominantCategory: dominant,
        clusterLabel: backend.cluster_label,
        raw: form
      };
  window.history.pushState({ route: 'report', report }, '', '/report');
  localStorage.setItem('screenaware_report', JSON.stringify(report));
  if (onNavigate) onNavigate('report');
    } catch (err) {
      alert('Error generating report. Please try again.');
    }
  };

  return (
    <div className="dataform-root">
      <div className="dataform-card">
        <h2>Log Daily Digital Habits</h2>
        <p className="muted">Fill this quick form to generate your personalized report.</p>

        <div className="field-row">
          <label>Daily screen time (hours)</label>
          <input type="number" step="0.1" value={form.daily_screen_time_hours} onChange={e=>setField('daily_screen_time_hours', e.target.value)} placeholder="e.g., 4.5" />
        </div>

        <div className="field-row">
          <label>Sleep duration (hours)</label>
          <input type="number" step="0.5" value={form.sleep_duration_hours} onChange={e=>setField('sleep_duration_hours', e.target.value)} placeholder="e.g., 7.5" />
        </div>

        <div className="field-row scale-row">
          <label>Stress level</label>
          <div className="emoji-scale">
            {emojiScale.map((em, idx)=> (
              <button key={idx} className={`emoji-btn ${form.stress_level===idx+1? 'active':''}`} onClick={() => setField('stress_level', idx+1)}>{em}</button>
            ))}
          </div>
        </div>

        <div className="field-row scale-row">
          <label>Sleep quality</label>
          <div className="emoji-scale">
            {emojiScale.map((em, idx)=> (
              <button key={idx} className={`emoji-btn ${form.sleep_quality===idx+1? 'active':''}`} onClick={() => setField('sleep_quality', idx+1)}>{em}</button>
            ))}
          </div>
        </div>

        <div className="field-row">
          <label>Physical activity (hours/week)</label>
          <input type="number" step="0.1" value={form.physical_activity_hours_per_week} onChange={e=>setField('physical_activity_hours_per_week', e.target.value)} placeholder="e.g., 3" />
        </div>

        <h4 className="section-title">Screen time breakdown (hours)</h4>
        {categories.map(c=> (
          <div className="field-row" key={c.key}>
            <label>{c.label}</label>
            <input type="number" step="0.1" value={form[c.key]} onChange={e=>setField(c.key, e.target.value)} placeholder="0" />
          </div>
        ))}

        <div className="actions">
          <button className="btn-generate" onClick={handleGenerate}>Generate Report</button>
          <button className="btn-cancel" onClick={()=> onNavigate && onNavigate('dashboard')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DataForm;
