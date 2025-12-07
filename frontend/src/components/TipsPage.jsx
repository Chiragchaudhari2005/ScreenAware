import React, { useState } from 'react';
import './TipsPage.css';

// Sample tips data (no changes)
const tipsData = [
  {
    id: 1,
    title: "The 20-20-20 Rule for Eye Health",
    category: "Eye Health",
    description: "Every 20 minutes, take a 20-second break and look at something 20 feet away. This helps reduce eye strain and protects your vision during long screen sessions.",
    quickTip: "Set a timer to remind you every 20 minutes"
  },
  {
    id: 2,
    title: "Perfect Your Posture",
    category: "Posture",
    description: "Keep your screen at arm's length and eye level. Your feet should be flat on the floor, and your back should be straight against your chair.",
    quickTip: "Align your screen with your eye level using books or a stand"
  },
  {
    id: 3,
    title: "Digital Sunset Protocol",
    category: "Sleep",
    description: "Activate blue light filters on your devices 2-3 hours before bedtime. This helps maintain your natural circadian rhythm and improves sleep quality.",
    quickTip: "Enable Night Shift or similar features automatically at sunset"
  },
  {
    id: 4,
    title: "Mindful Screen Breaks",
    category: "Mental Wellness",
    description: "Practice the 5-minute mindfulness break. Step away from your screen, close your eyes, and focus on your breathing to reset your mind.",
    quickTip: "Use the Pomodoro technique: 25 minutes work, 5 minutes break"
  },
  {
    id: 5,
    title: "Smart Notification Management",
    category: "Focus",
    description: "Group your notifications and set specific times to check them. This reduces constant interruptions and helps maintain deep focus.",
    quickTip: "Turn off non-essential notifications during focus hours"
  },
  {
    id: 6,
    title: "Ergonomic Workspace Setup",
    category: "Posture",
    description: "Ensure your workspace promotes good posture. Your keyboard should be at elbow level, and your mouse should be easily reachable.",
    quickTip: "Use wrist rests for keyboard and mouse support"
  },
  {
    id: 7,
    title: "Digital Detox Weekends",
    category: "Mental Wellness",
    description: "Dedicate one weekend a month to minimal screen time. Focus on outdoor activities, reading physical books, or spending time with family.",
    quickTip: "Plan screen-free activities in advance for your detox days"
  },
  {
    id: 8,
    title: "Optimal Screen Brightness",
    category: "Eye Health",
    description: "Adjust your screen brightness to match your surroundings. Your screen shouldn't look like a light source in the room.",
    quickTip: "Use auto-brightness features when available"
  },
  {
    id: 9,
    title: "Active Break Routine",
    category: "Physical Health",
    description: "Take active breaks every hour. Stand up, stretch, or do quick exercises to maintain blood circulation and energy levels.",
    quickTip: "Try desk exercises or walking meetings for movement"
  },
  {
    id: 10,
    title: "Screen Distance Management",
    category: "Eye Health",
    description: "Keep your screen about arm's length away (20-28 inches) from your eyes. This reduces eye strain and helps maintain good posture.",
    quickTip: "Use the built-in distance guide in ScreenAware"
  },
  {
    id: 11,
    title: "Digital Content Scheduling",
    category: "Focus",
    description: "Plan your screen activities. Designate specific times for email, social media, and focused work to prevent constant task-switching.",
    quickTip: "Use time-blocking techniques for better focus"
  },
  {
    id: 12,
    title: "Hydration Reminder",
    category: "Physical Health",
    description: "Stay hydrated during screen time. Dehydration can contribute to fatigue and reduced cognitive performance.",
    quickTip: "Keep a water bottle at your desk and track intake"
  },
  {
    id: 13,
    title: "Evening Wind-Down Routine",
    category: "Sleep",
    description: "Create a relaxing pre-bed routine without screens. This helps your mind and body prepare for quality sleep.",
    quickTip: "Read a physical book instead of scrolling before bed"
  },
  {
    id: 14,
    title: "Conscious Social Media Use",
    category: "Mental Wellness",
    description: "Set boundaries for social media usage. Be mindful of how different platforms affect your mood and energy levels.",
    quickTip: "Use app timers to limit social media access"
  },
  {
    id: 15,
    title: "Regular Eye Exercises",
    category: "Eye Health",
    description: "Practice eye exercises throughout the day. Roll your eyes, focus on distant objects, and blink frequently to reduce strain.",
    quickTip: "Follow the figure-8 exercise with your eyes every hour"
  }
];

const categories = [...new Set(tipsData.map(tip => tip.category))];

const getCategoryClassName = (category) => {
  return category.toLowerCase().replace(/\s+/g, '-');
};

const TipsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredTips = tipsData.filter(tip => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = tip.title.toLowerCase().includes(searchLower) ||
                          tip.description.toLowerCase().includes(searchLower) ||
                          tip.category.toLowerCase().includes(searchLower);
    const matchesCategory = !selectedCategory || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="tips-page-root">
      <div className="tips-container">
        <header className="tips-header">
          <h1>Digital Wellness Journal</h1>
          <p>A curated collection of tips for a balanced digital life.</p>
        </header>

        <div className="tips-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="category-filters">
            <button
              className={`category-filter ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All Entries
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="tips-grid">
          {filteredTips.length > 0 ? (
            filteredTips.map((tip, index) => (
              <div key={tip.id} className="tip-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`entry-bookmark ${getCategoryClassName(tip.category)}`}></div>
                <div className="entry-main">
                  <h3 className="entry-title">{tip.title}</h3>
                  <p className="entry-description">{tip.description}</p>
                </div>
                <aside className="entry-sidebar">
                  <div className="entry-category-tag">
                    <span className={`category-dot ${getCategoryClassName(tip.category)}`}></span>
                    {tip.category}
                  </div>
                  <div className="quick-tip">
                    <strong>📌 Note:</strong> {tip.quickTip}
                  </div>
                </aside>
              </div>
            ))
          ) : (
            <div className="no-results">
                <h3>No entries found</h3>
                <p>Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipsPage;