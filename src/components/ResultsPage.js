import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiDownload, FiTrendingUp, FiTarget, FiUsers, FiCheckCircle, FiDollarSign, FiExternalLink, FiAlertCircle, FiLink, FiMessageSquare, FiCopy, FiClock } from 'react-icons/fi';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, input } = location.state || {};

  const handleCopyPitch = () => {
    if (analysis?.pitch) {
      navigator.clipboard.writeText(analysis.pitch);
      // You could add a toast notification here to show the copy was successful
    }
  };

  if (!analysis) {
    return <div className="results-container"><p>No results to display. Please validate an idea first.</p></div>;
  }

  return (
    <div className="results-container">
      <a className="back-link" href="/validate">← Validate Another Idea</a>
      <div className="results-header">
        <div className="results-header-left">
          <h2>Validation Results</h2>
          <div className="results-input">"{input}"</div>
        </div>
      </div>
      <div className="results-section market-demand">
        <div className="market-demand-header">
          <span className="market-demand-icon-bg"><FiTrendingUp className="market-demand-icon" /></span>
          <h3>Market Demand</h3>
          <span className="score-badge">{analysis.marketDemand.score}/10</span>
        </div>
        <p className="market-demand-summary">{analysis.marketDemand.summary}</p>
        <p className="market-demand-details">{analysis.marketDemand.details}</p>

        {/* Customer Pain Points Subsection */}
        <div className="subsection-divider" />
        <div className="pain-points-section">
          <div className="pain-points-header">
            <FiAlertCircle className="pain-points-icon" />
            <span>Customer Pain Points</span>
          </div>
          <div className="pain-points-content">
            <div className="pain-point-card">
              <strong>Primary Pain Point:</strong> {analysis.marketDemand.painPoints.primaryPainPoint}
            </div>
            <div className="pain-point-card">
              <strong>Problem Urgency:</strong> {analysis.marketDemand.painPoints.urgency}
            </div>
            <div className="pain-point-card">
              <strong>Evidence of Demand:</strong> {analysis.marketDemand.painPoints.evidence}
            </div>
          </div>
        </div>

        {/* Market Timing & Trends Subsection */}
        <div className="subsection-divider" />
        <div className="timing-trends-section">
          <div className="timing-trends-header">
            <FiClock className="timing-trends-icon" />
            <span>Market Timing & Trends</span>
          </div>
          <div className="timing-trends-content">
            <div className="timing-trend-card">
              <strong>Market Readiness:</strong> {analysis.marketDemand.timingTrends.marketReadiness}
            </div>
            <div className="timing-trend-card">
              <strong>Emerging Trends:</strong> {analysis.marketDemand.timingTrends.emergingTrends}
            </div>
            <div className="timing-trend-card">
              <strong>Timing Assessment:</strong> {analysis.marketDemand.timingTrends.timingAssessment}
            </div>
          </div>
        </div>
      </div>
      <div className="results-section competitors">
        <div className="competitors-header">
          <span className="competitors-icon-bg"><FiTarget className="competitors-icon" /></span>
          <h3>Top Potential Competitors</h3>
        </div>
        {analysis.competitors.map((comp, idx) => (
          <div className="competitor-card" key={idx}>
            <div className="competitor-header">
              <span className="competitor-name">{comp.name}</span>
              <span className={`popularity-badge ${comp.popularity.toLowerCase()}`}>{comp.popularity} Popularity</span>
            </div>
            <div className="competitor-desc">{comp.description}</div>
            <div className="competitor-meta">{comp.locations} • {comp.pricing}</div>
            <div className="competitor-analysis">
              <div className="analysis-section">
                <h4>Strengths</h4>
                <ul className="analysis-list">
                  {comp.pros.map((pro, proIdx) => (
                    <li key={proIdx} className="pro-item">
                      <FiCheckCircle className="pro-icon" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="analysis-section">
                <h4>Weaknesses</h4>
                <ul className="analysis-list">
                  {comp.weaknesses.map((weakness, weakIdx) => (
                    <li key={weakIdx} className="weakness-item">
                      <FiAlertCircle className="weakness-icon" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="results-section target-audience">
        <div className="target-audience-header">
          <span className="target-audience-icon-bg"><FiUsers className="target-audience-icon" /></span>
          <h3>Target Audience</h3>
        </div>
        <div className="target-audience-list">
          {analysis.targetAudience.map((aud, idx) => (
            <div className="target-audience-item" key={idx}>
              <div className="target-audience-group">
                <FiCheckCircle className="target-audience-check" />
                <span className="target-group-name">{aud.group}</span>
              </div>
              <div className="online-destinations">
                <h4>Find this audience online:</h4>
                <div className="destination-buttons">
                  {aud.onlineDestinations.map((dest, destIdx) => (
                    <a
                      key={destIdx}
                      href={dest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`destination-button ${dest.type.toLowerCase().replace(' ', '-')}`}
                    >
                      <span className="destination-icon">
                        {dest.type === 'Reddit' && <FiLink />}
                        {dest.type === 'Discord' && <FiLink />}
                        {dest.type === 'Forum' && <FiLink />}
                        {dest.type === 'Facebook Group' && <FiLink />}
                        {dest.type === 'LinkedIn Group' && <FiLink />}
                        {dest.type === 'Other' && <FiLink />}
                      </span>
                      <div className="destination-info">
                        <span className="destination-name">{dest.name}</span>
                        <span className="destination-type">{dest.type}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pitch-section">
          <div className="pitch-header">
            <span className="pitch-icon-bg"><FiMessageSquare className="pitch-icon" /></span>
            <h3>Professional Pitch - Share to the Online Community!</h3>
            <button className="copy-pitch-btn" onClick={handleCopyPitch} title="Copy Pitch to Clipboard">
              <FiCopy className="copy-icon" />
            </button>
          </div>
          <div className="pitch-content">
            <p className="pitch-paragraph">{analysis.pitch}</p>
          </div>
        </div>
      </div>
      <div className="results-section revenue-models">
        <div className="revenue-models-header">
          <span className="revenue-models-icon-bg"><FiDollarSign className="revenue-models-icon" /></span>
          <h3>Revenue Model Suggestions</h3>
        </div>
        <ul className="revenue-models-list">
          {analysis.revenueModels.map((model, idx) => (
            <li className="revenue-models-item" key={idx}>
              <FiCheckCircle className="revenue-models-check" />
              <span>{model}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="results-section mvp-features">
        <div className="mvp-features-header">
          <span className="mvp-features-icon-bg"><FiExternalLink className="mvp-features-icon" /></span>
          <h3>MVP Feature Set</h3>
        </div>
        <div className="mvp-design-section">
          <div className="mvp-design-title">Suggested MVP Design</div>
          <div className="mvp-design-card">{analysis.mvpDesign}</div>
        </div>
        <ul className="mvp-features-list">
          {analysis.mvpFeatures.map((feat, idx) => (
            <li className="mvp-feature-row" key={idx}>
              <div className="mvp-feature-left">
                <FiCheckCircle className="mvp-feature-check" />
                <span className="feature-name">{feat.feature}</span>
              </div>
              <div className="mvp-feature-badges">
                <span className={`priority-badge ${feat.priority.toLowerCase().replace(' ', '-')}`}>{feat.priority} Priority</span>
                <span className={`effort-badge ${feat.effort.toLowerCase().replace(' ', '-')}`}>{feat.effort} Effort</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="results-actions">
        <button className="validate-another-btn" onClick={() => navigate('/validate')}>Validate Another Idea</button>
        <button className="download-btn"><FiDownload style={{marginRight: 8, fontSize: '1.2em'}} />Download PDF Report</button>
      </div>
    </div>
  );
};

export default ResultsPage; 