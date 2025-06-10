import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-hero">
        <h1>Create Powerful Startups With Data-Driven Validation</h1>
        <p>Validate your crazy startup ideas in real-time to improve growth, deliverability, reduce competition, and take over markets.</p>
        <div className="homepage-hero-buttons">
          <button className="primary" onClick={() => navigate('/validate')}>Get started →</button>
          <button className="secondary">Learn more →</button>
        </div>
      </div>
      <div className="homepage-features-section">
        <h2>Everything you need to validate your startup</h2>
        <p>Comprehensive validation tools powered by data and market intelligence</p>
        <div className="homepage-features-grid">
          <div className="feature-card">
            <div className="feature-icon">↗️</div>
            <h3>Market Analysis</h3>
            <p>Get comprehensive market research and trend analysis for your startup idea in seconds.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Competitor Intelligence</h3>
            <p>Discover your competition, their strengths, weaknesses, and market positioning.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Target Audience Insights</h3>
            <p>Identify and understand your ideal customers with detailed demographic analysis.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>MVP Roadmap</h3>
            <p>Get a prioritized feature list and development roadmap for your minimum viable product.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Risk Assessment</h3>
            <p>Understand potential challenges and risks before you invest time and money.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✔️</div>
            <h3>Validation Score</h3>
            <p>Receive a comprehensive score based on market demand, competition, and feasibility.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 