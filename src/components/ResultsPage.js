import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, input } = location.state || {};

  if (!analysis) {
    return <div className="results-container"><p>No results to display. Please validate an idea first.</p></div>;
  }

  return (
    <div className="results-container">
      <a className="back-link" href="/validate">← Validate Another Idea</a>
      <div className="results-header">
        <h2>Validation Results</h2>
        <div className="results-input">"{input}"</div>
        <button className="download-btn">Download PDF Report</button>
      </div>
      <div className="results-section market-demand">
        <h3>Market Demand <span className="score-badge">{analysis.marketDemand.score}/10</span></h3>
        <p>{analysis.marketDemand.summary}</p>
        <p>{analysis.marketDemand.details}</p>
      </div>
      <div className="results-section competitors">
        <h3>Top 3 Competitors</h3>
        {analysis.competitors.map((comp, idx) => (
          <div className="competitor-card" key={idx}>
            <div className="competitor-header">
              <span className="competitor-name">{comp.name}</span>
              <span className={`popularity-badge ${comp.popularity.toLowerCase().replace(' ', '-')}`}>{comp.popularity} Popularity</span>
            </div>
            <div className="competitor-desc">{comp.description}</div>
            <div className="competitor-meta">{comp.locations} • {comp.pricing}</div>
          </div>
        ))}
      </div>
      <div className="results-section target-audience">
        <h3>Target Audience</h3>
        <ul>
          {analysis.targetAudience.map((aud, idx) => (
            <li key={idx}>{aud}</li>
          ))}
        </ul>
      </div>
      <div className="results-section revenue-models">
        <h3>Revenue Model Suggestions</h3>
        <ul>
          {analysis.revenueModels.map((model, idx) => (
            <li key={idx}>{model}</li>
          ))}
        </ul>
      </div>
      <div className="results-section mvp-features">
        <h3>MVP Feature Set</h3>
        {analysis.mvpFeatures.map((feat, idx) => (
          <div className="mvp-feature-row" key={idx}>
            <span className="feature-name">{feat.feature}</span>
            <span className={`priority-badge ${feat.priority.toLowerCase().replace(' ', '-')}`}>{feat.priority} Priority</span>
            <span className={`effort-badge ${feat.effort.toLowerCase().replace(' ', '-')}`}>{feat.effort} Effort</span>
          </div>
        ))}
      </div>
      <div className="results-actions">
        <button className="validate-another-btn" onClick={() => navigate('/validate')}>Validate Another Idea</button>
        <button className="download-btn">Download Full Report</button>
      </div>
    </div>
  );
};

export default ResultsPage; 