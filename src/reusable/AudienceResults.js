import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiX, FiCheck, FiDownload, FiTrendingUp, FiTarget, FiUsers, FiCheckCircle, FiDollarSign, FiExternalLink, FiAlertCircle, FiLink, FiMessageSquare, FiCopy, FiClock, FiSave, FiUserCheck, FiChevronsUp, FiChevronsDown } from 'react-icons/fi';
import '../components/ValidatePage.css';

const AudienceResults = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleCopyPitch = props.handleCopyPitch;
    const analysis = props.analysis;
    return (  
              <div className="results-section target-audience">
                <div className="target-audience-header">
                  <span className="target-audience-icon-bg"><FiUsers className="target-audience-icon" /></span>
                  <h3>Target Audience</h3>
                </div>
                <div className="target-audience-list">
                  {analysis.targetAudience.length > 0 ? (
                    analysis.targetAudience.map((aud, idx) => (
                      <div className="target-audience-item" key={idx}>
                        <div className="target-audience-group">
                          <FiCheckCircle className="target-audience-check" />
                          <span className="target-group-name">{aud.group || 'Unknown Group'}</span>
                        </div>
                        <div className="online-destinations">
                          <h4>Find this audience online:</h4>
                          <div className="destination-buttons">
                            {(aud.onlineDestinations || []).map((dest, destIdx) => (
                              <a
                                key={destIdx}
                                href={dest.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`destination-button ${(dest.type || 'Other').toLowerCase().replace(' ', '-')}`}
                              >
                                <span className="destination-icon">
                                  <FiLink />
                                </span>
                                <div className="destination-info">
                                  <span className="destination-name">{dest.name || 'Unknown'}</span>
                                  <span className="destination-type">{dest.type || 'Other'}</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No target audience information available.</p>
                  )}
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
                    <p className="pitch-paragraph">{analysis.pitch || 'No pitch available'}</p>
                  </div>
                </div>
              </div>
        
    );
}
 
export default AudienceResults;