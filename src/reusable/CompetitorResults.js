import React, { useState } from 'react';
import { FiTarget, FiCheckCircle, FiAlertCircle, FiChevronsUp, FiChevronsDown } from 'react-icons/fi';
import '../components/ValidatePage.css';

const CompetitorResults = (props) => {
  const { analysis, competitors, getScoreColor2, ensureArray } = props;
  const [showMoreMap, setShowMoreMap] = useState({});

  const toggleShowMore = (idx) => {
    setShowMoreMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="results-section competitors">
      <div className="competitors-header">
        <span className="competitors-icon-bg"><FiTarget className="competitors-icon" /></span>
        <h3>Market Competitiveness</h3>
        <span className={`score-badge ${getScoreColor2(analysis.feasibilityscore)}`}>{analysis.feasibilityscore}/10</span>
      </div>
      {competitors.length > 0 ? (
        competitors.map((comp, idx) => {
          const showMore = !!showMoreMap[idx];
          return (
            <div className="competitor-card" key={idx}>
              <div className="competitor-header">
                <span className="competitor-name">{comp.name || 'Unknown'}</span>
                <span className={`popularity-badge ${(comp.popularity || 'Low').toLowerCase()}`}>{comp.popularity || 'Low'} Popularity</span>
              </div>
              <div className="competitor-desc">{comp.description || 'No description available'}</div>
              <div className="competitor-meta">{comp.locations || 'Unknown'} • {comp.pricing || 'Unknown'}</div>

              <div className="button-wrapper">
                <button className="dropdown-button" onClick={() => toggleShowMore(idx)}>
                  <b>Read {showMore ? 'Less' : 'More'}</b>
                  {showMore ? <FiChevronsUp className="chevron-icon" /> : <FiChevronsDown className="chevron-icon" />}
                </button>
              </div>

              <div className={`expandable-wrapper ${showMore ? 'show' : ''}`}>
                <div className="competitor-analysis">
                  <div className="analysis-section">
                    <h4>Strengths</h4>
                    <ul className="analysis-list">
                      {ensureArray(comp.pros).map((pro, proIdx) => (
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
                      {ensureArray(comp.weaknesses).map((weakness, weakIdx) => (
                        <li key={weakIdx} className="weakness-item">
                          <FiAlertCircle className="weakness-icon" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No competitor information available.</p>
      )}
    </div>
  );
};

export default CompetitorResults;
