import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiX, FiCheck, FiDownload, FiTrendingUp, FiTarget, FiUsers, FiCheckCircle, FiDollarSign, FiExternalLink, FiAlertCircle, FiLink, FiMessageSquare, FiCopy, FiClock, FiSave, FiUserCheck, FiChevronsUp, FiChevronsDown } from 'react-icons/fi';
import '../components/ValidatePage.css';

const FounderResults = (props) => {
    const analysis = props.analysis;
    const getScoreColor = props.getScoreColor;
    const ensureArray = props.ensureArray;
    return (  
        <div className = "results-section founderproduct">
                <div className="founderproduct-header">
                  <span className="founderproduct-icon-bg"><FiUserCheck className="founderproduct-icon" /></span>
                  <h3>Founder Fit</h3>
                  <span className={`score-badge ${getScoreColor(analysis.founderfitscore)}`}>{analysis.founderfitscore}/10</span>
                </div>
                <p className="founderproduct-summary">{analysis.founderfit || 'No summary available'}</p>
                <div className = "subsection-divider" />
                  <div className="good-fit-header">
                    <FiChevronsUp className="good-fit-icon" />
                    <span>Your Strengths</span>
                  </div> 
                    <div className="good-fit-content">
                    {ensureArray(analysis.positivefounderfit).map((fit, index) => (
                      <div key={index}>
                        <div className="good-fit-card">
                          <strong>{fit.skill}:</strong> {fit.description || 'Not specified'}
                        </div>
                      </div>
                    ))}
                    </div>
                <div className = "subsection-divider" />
                  <div className="bad-fit-header">
                    <FiChevronsDown className="bad-fit-icon" />
                    <span>Your Weaknesses</span>
                  </div> 
                    <div className="bad-fit-content">
                    {ensureArray(analysis.negativefounderfit).map((fit, index) => (
                      <div key={index}>
                        <div className="bad-fit-card">
                          <strong>{fit.skill}:</strong> {fit.description || 'Not specified'}
                        </div>
                      </div>
                    ))}
                    </div>
              </div>  
    );
}
 
export default FounderResults;