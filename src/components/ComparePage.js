import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrendingUp, FiTarget, FiUsers, FiDollarSign, FiExternalLink, FiMessageSquare } from 'react-icons/fi';
import './ComparePage.css';

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ideas } = location.state || {};
  
  const [idea1, idea2] = ideas || [];

  useEffect(() => {
    if (!ideas || ideas.length !== 2) {
      navigate('/profile');
    }
  }, [ideas, navigate]);

  if (!ideas || ideas.length !== 2) {
    return (
      <div className="compare-container">
        <div className="compare-error">
          <h2>Invalid Comparison</h2>
          <p>Please select exactly 2 ideas to compare.</p>
          <button onClick={() => navigate('/profile')}>Back to Profile</button>
        </div>
      </div>
    );
  }

  const renderScoreComparison = (score1, score2, label) => {
    const getScoreColor = (score) => {
      if (score >= 8) return '#059669';
      if (score >= 6) return '#d97706';
      return '#dc2626';
    };

    return (
      <div className="score-comparison">
        <div className="score-item">
          <span className="score-label">{label}</span>
          <span 
            className="score-value" 
            style={{ color: getScoreColor(score1) }}
          >
            {score1}/10
          </span>
        </div>
        <div className="score-item">
          <span className="score-label">{label}</span>
          <span 
            className="score-value" 
            style={{ color: getScoreColor(score2) }}
          >
            {score2}/10
          </span>
        </div>
      </div>
    );
  };

  const renderTextComparison = (text1, text2, label) => (
    <div className="text-comparison">
      <div className="comparison-item">
        <h4>{label}</h4>
        <p>{text1 || 'Not available'}</p>
      </div>
      <div className="comparison-item">
        <h4>{label}</h4>
        <p>{text2 || 'Not available'}</p>
      </div>
    </div>
  );

  return (
    <div className="compare-container">
      <div className="compare-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <FiArrowLeft /> Back to Profile
        </button>
        <h1>Idea Comparison</h1>
      </div>

      <div className="compare-grid">
        <div className="idea-column">
          <div className="idea-header">
            <h2>{idea1.title}</h2>
            <p className="idea-date">{new Date(idea1.created_at).toLocaleDateString()}</p>
          </div>
          <div className="idea-question">
            <h4>Question</h4>
            <p>"{idea1.question}"</p>
          </div>
        </div>

        <div className="idea-column">
          <div className="idea-header">
            <h2>{idea2.title}</h2>
            <p className="idea-date">{new Date(idea2.created_at).toLocaleDateString()}</p>
          </div>
          <div className="idea-question">
            <h4>Question</h4>
            <p>"{idea2.question}"</p>
          </div>
        </div>
      </div>

      <div className="comparison-sections">
        {/* Market Demand Scores */}
        <div className="comparison-section">
          <div className="section-header">
            <FiTrendingUp className="section-icon" />
            <h3>Market Demand Score</h3>
          </div>
          {renderScoreComparison(
            idea1.analysis?.score || 0,
            idea2.analysis?.score || 0,
            'Market Demand'
          )}
        </div>

        {/* Feasibility Scores */}
        <div className="comparison-section">
          <div className="section-header">
            <FiTarget className="section-icon" />
            <h3>Market Competitiveness Score</h3>
          </div>
          {renderScoreComparison(
            idea1.analysis?.feasibilityscore || 0,
            idea2.analysis?.feasibilityscore || 0,
            'Competitiveness'
          )}
        </div>

        {/* Overview Comparison */}
        <div className="comparison-section">
          <div className="section-header">
            <FiMessageSquare className="section-icon" />
            <h3>Overview</h3>
          </div>
          {renderTextComparison(
            idea1.analysis?.overview,
            idea2.analysis?.overview,
            'Overview'
          )}
        </div>

        {/* Market Demand Summary */}
        <div className="comparison-section">
          <div className="section-header">
            <FiTrendingUp className="section-icon" />
            <h3>Market Demand Summary</h3>
          </div>
          {renderTextComparison(
            idea1.analysis?.summary,
            idea2.analysis?.summary,
            'Summary'
          )}
        </div>

        {/* Pitch Comparison */}
        <div className="comparison-section">
          <div className="section-header">
            <FiMessageSquare className="section-icon" />
            <h3>Professional Pitch</h3>
          </div>
          {renderTextComparison(
            idea1.analysis?.pitch,
            idea2.analysis?.pitch,
            'Pitch'
          )}
        </div>

        {/* Revenue Models */}
        <div className="comparison-section">
          <div className="section-header">
            <FiDollarSign className="section-icon" />
            <h3>Revenue Models</h3>
          </div>
          <div className="text-comparison">
            <div className="comparison-item">
              <h4>Revenue Models</h4>
              <ul>
                {idea1.analysis?.revenueModels?.map((model, i) => (
                  <li key={i}>{model}</li>
                )) || ['Not available']}
              </ul>
            </div>
            <div className="comparison-item">
              <h4>Revenue Models</h4>
              <ul>
                {idea2.analysis?.revenueModels?.map((model, i) => (
                  <li key={i}>{model}</li>
                )) || ['Not available']}
              </ul>
            </div>
          </div>
        </div>

        {/* MVP Design */}
        <div className="comparison-section">
          <div className="section-header">
            <FiExternalLink className="section-icon" />
            <h3>MVP Design</h3>
          </div>
          {renderTextComparison(
            idea1.analysis?.mvpDesign,
            idea2.analysis?.mvpDesign,
            'MVP Design'
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparePage; 