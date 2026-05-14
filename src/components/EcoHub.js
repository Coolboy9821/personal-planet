import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import './EcoHub.css';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

// NEW: Our rich content for the insights carousel
const insightsData = [
  {
    type: 'win',
    icon: '🎉',
    title: 'Biggest Win',
    text: 'Your <strong>Electricity</strong> usage is 15% lower than your average. Fantastic work!',
  },
  {
    type: 'challenge',
    icon: '🎯',
    title: 'Next Challenge',
    text: 'Your <strong>Travel</strong> footprint is your highest impact area. Try swapping one car trip for public transit this week.',
  },
  {
    type: 'info',
    icon: '📊',
    title: 'Community Benchmark',
    text: 'You are in the top <strong>30%</strong> of users for lowest water consumption. Keep leading the way!',
  },
  {
    type: 'fact',
    icon: '💡',
    title: 'Did You Know?',
    text: 'Your weekly carbon footprint is equivalent to charging your smartphone over <strong>2,000</strong> times.',
  }
];

// A simple component for the achievement badges
const Achievement = ({ icon, title, unlocked }) => (
  <div className={`achievement ${unlocked ? 'unlocked' : ''}`}>
    <div className="achievement-icon">{icon}</div>
    <p>{title}</p>
  </div>
);

const EcoHub = ({ historicalData, onClose, onLearnMoreClick }) => {
  const [insightIndex, setInsightIndex] = useState(0); // State for the carousel slide

  const chartData = {
    labels: historicalData.map(d => d.label),
    datasets: [{
      label: 'Tonnes CO₂e / year',
      data: historicalData.map(d => d.value),
      fill: true,
      backgroundColor: 'rgba(88, 166, 255, 0.2)',
      borderColor: 'rgba(88, 166, 255, 1)',
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { color: '#30363d' }, ticks: { color: '#c9d1d9' } },
      x: { grid: { color: '#30363d' }, ticks: { color: '#c9d1d9' } },
    },
    plugins: { legend: { display: false } }
  };

  const latestScore = historicalData[historicalData.length - 1].value;

  const navigateInsight = (direction) => {
    // We use a custom direction state for framer-motion variants
    const newIndex = (insightIndex + direction + insightsData.length) % insightsData.length;
    setInsightIndex(newIndex);
  };

  const currentInsight = insightsData[insightIndex];

  return (
    <motion.div
      className="hub-overlay"
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <button className="hub-close" onClick={onClose}>&times;</button>
      <div className="hub-content">
        <div className="hub-header">
          <h1>Your Eco-Hub</h1>
          <p>Track your progress and celebrate your positive impact on the planet.</p>
        </div>
        
        <div className="hub-grid">
          <div className="grid-item chart-container">
            <h3>Your Impact Trend</h3>
            <div className="chart-wrapper">
              <Line options={chartOptions} data={chartData} />
            </div>
          </div>
          
          <div className="grid-item insights-container">
             <h3>Smart Insights</h3>
             <div className="insight-carousel">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={insightIndex}
                        className={`insight-card ${currentInsight.type}`}
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -200 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <h4>{currentInsight.icon} {currentInsight.title}</h4>
                        <p dangerouslySetInnerHTML={{ __html: currentInsight.text }}></p>
                    </motion.div>
                </AnimatePresence>

                <button className="nav-arrow left" onClick={() => navigateInsight(-1)}>‹</button>
                <button className="nav-arrow right" onClick={() => navigateInsight(1)}>›</button>
             </div>
             <div className="pagination-dots">
                {insightsData.map((_, index) => (
                    <div key={index} className={`dot ${index === insightIndex ? 'active' : ''}`} onClick={() => setInsightIndex(index)}></div>
                ))}
             </div>
             <button className="learn-more-button" onClick={onLearnMoreClick}>
                Wiki
             </button>
          </div>

          <div className="grid-item achievements-container">
             <h3>Achievements</h3>
             <div className="achievements-grid">
                <Achievement icon="🌱" title="First Step" unlocked={true} />
                <Achievement icon="🚗" title="Eco-Commuter" unlocked={latestScore < 5} />
                <Achievement icon="💡" title="Energy Guardian" unlocked={true} />
                <Achievement icon="💧" title="Water Warrior" unlocked={false} />
                <Achievement icon="🌍" title="Planet Protector" unlocked={latestScore < 3} />
                <Achievement icon="⭐" title="Consistency King" unlocked={false} />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EcoHub;