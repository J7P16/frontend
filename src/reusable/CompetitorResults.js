import React, { useState } from 'react';
import { FiTarget, FiCheckCircle, FiAlertCircle, FiChevronsUp, FiChevronsDown } from 'react-icons/fi';
import '../components/ValidatePage.css';
import axios from 'axios';
const PATENTS_API_KEY = "wvT5Gztw.mIIzBuLO0WLGzXoorkg6nwXmPiHuQJoo";

const CompetitorResults = (props) => {
  const { analysis, competitors, getScoreColor2, ensureArray } = props;
  const [showMoreMap, setShowMoreMap] = useState({});
  const [patentDataMap, setPatentDataMap] = useState({}); // New state for fetched data
  const [loadingMap, setLoadingMap] = useState({}); // Optional: loading indicator

const toggleShowMore = async (idx, compName) => {
    const alreadyVisible = showMoreMap[idx];

    // If not already fetched and expanding, fetch data
if (!alreadyVisible && !patentDataMap[idx]) {
  try {
    setLoadingMap(prev => ({ ...prev, [idx]: true }));
    const response = await axios.get(
      "https://search.patentsview.org/api/v1/patent/",
      {
        headers: {
          "X-Api-Key": PATENTS_API_KEY
        },
        params: {
          // use a full-text phrase match on the organization name
          q: JSON.stringify({
            "_text_phrase": {
              "assignees.assignee_organization": compName
            }
          }),
          // fields to return
          f: JSON.stringify([
            "patent_id",
            "patent_title",
            "patent_abstract",
            "patent_type"
          ]),
          // pagination: first 20 results
          o: JSON.stringify({
            page: 1,
            per_page: 20
          })
        }
      }
    );
    setPatentDataMap(prev => ({ ...prev, [idx]: response.data.patents }));
  } catch (error) {
    console.error("Error fetching patent data:", error);
    setPatentDataMap(prev => ({
      ...prev,
      [idx]: { error: "Unable to load patent data." }
    }));
  } finally {
    setLoadingMap(prev => ({ ...prev, [idx]: false }));
  }
}

    // Toggle show more
    setShowMoreMap(prev => ({ ...prev, [idx]: !alreadyVisible }));
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
          const loading = loadingMap[idx];
          const patentData = patentDataMap[idx];

          return (
            <div className="competitor-card" key={idx}>
              <div className="competitor-header">
                <span className="competitor-name">{comp.name || 'Unknown'}</span>
                <span className={`popularity-badge ${(comp.popularity || 'Low').toLowerCase()}`}>{comp.popularity || 'Low'} Popularity</span>
              </div>
              <div className="competitor-desc">{comp.description || 'No description available'}</div>
              <div className="competitor-meta">{comp.locations || 'Unknown'} • {comp.pricing || 'Unknown'}</div>

              <div className="button-wrapper">
                <button className="dropdown-button" onClick={() => toggleShowMore(idx, comp.name)}>
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

                <div className="subsection-divider"></div>
                <div className="patent-information">
                  {loading && <p>Loading patent data...</p>}
                  {!loading && patentData && (
                    <div>
                      {/* Render your patent data however you want */}
                      <pre>{JSON.stringify(patentData, null, 2)}</pre>
                    </div>
                  )}
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
