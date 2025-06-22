import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClipboard, FiChevronDown } from 'react-icons/fi';
import { supabase } from '../supabaseClient';

const modelList = [
  'Compound',
  'Deepseek',
  'Gemma',
  'Llama 3',
  'Llama 4',
  'Mistral',
  'Qwen',
  'GPT-4',
];

const ValidatePage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [personalized, setPersonalized] = useState(false);
  const [selectedModel, setSelectedModel] = useState(modelList[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const maxWords = 100;
  const maxChars = 750;
  let parsed;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name, country, state, city, education_level')
            .eq('id', user.id)
            .single();
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setWordCount(countWords(newMessage));
    setCharCount(newMessage.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wordCount > maxWords) return;
    setLoading(true);
    setError(null);
    try {
      const requestBody = {
        message,
        model: selectedModel,
        personalized
      };

      // Include user profile data if personalized analysis is enabled
      if (personalized && userProfile) {
        requestBody.userProfile = {
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          location: {
            country: userProfile.country,
            state: userProfile.state,
            city: userProfile.city
          },
          educationLevel: userProfile.education_level
        };
      }

      const response = await axios.post('http://localhost:5000/api/chat', requestBody);
      parsed = JSON.parse(response.data.reply);
      setLoading(false);
      navigate('/results', { state: { analysis: parsed, input: message } });
    } catch (err) {
      setLoading(false);
      if (parsed = 'INAPPROPRIATECONTENT') {
        setError('Your content has been flagged for inappropriate content.')
      }
      else {
        setError('Model is in high use or the content was flagged. Please try again.');
      }
    }
  };

  const getWordCountColor = () => {
    if (wordCount > maxWords) return '#dc2626'; // red
    if (wordCount > maxWords * 0.8) return '#f59e0b'; // amber
    return '#6b7280'; // gray
  };

  const getCharCountColor = () => {
    if (charCount > maxChars) return '#dc2626'; // red
    if (charCount > maxChars * 0.8) return '#f59e0b'; // amber
    return '#6b7280'; // gray
  };

  return (
    <div className="validate-container">
      <a className="back-link" href="/">← Back to Home</a>
      <div className="validate-card">
        <div className="validate-header">
          <div className="validate-icon">
            <FiClipboard className="validate-icon-bg" />
          </div>
          <h2>Describe Your Startup Idea</h2>
          <p>Share your vision and let Validly provide comprehensive validation insights!</p>
          <div className="validate-controls-row">
            <div className="limit-indicators">
              <span className="word-count-indicator" style={{ color: getWordCountColor() }}>
                {wordCount} / {maxWords} Words
              </span>
              <span className="char-count-indicator" style={{ color: getCharCountColor() }}>
                {charCount} / {maxChars} Chars
              </span>
            </div>
            <div className="controls-right">
              <div className="toggle-group">
                <span className="toggle-label">Personalized Analysis</span>
                <label className="switch">
                  <input type="checkbox" checked={personalized} onChange={() => setPersonalized(v => !v)} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="model-dropdown-group" ref={dropdownRef}>
                <button
                  type="button"
                  className={`model-dropdown-btn ${selectedModel === 'GPT-4' ? 'gpt-4-selected' : ''}`}
                  onClick={() => setShowDropdown(v => !v)}
                >
                  {selectedModel}
                  <FiChevronDown style={{ marginLeft: 8, fontSize: '1.1em' }} />
                </button>
                {showDropdown && (
                  <ul className="model-dropdown-list">
                    {modelList.map((model) => (
                      <li
                        key={model}
                        className={`${model === selectedModel ? 'selected' : ''} ${model === 'GPT-4' ? 'gpt-4' : ''}`}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowDropdown(false);
                        }}
                      >
                        {model}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          {personalized && (
            <div className="personalized-explanation">
              <small>💡 Personalized analysis considers your location, education, and background to provide more relevant startup insights tailored to your specific context.</small>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="validate-form">
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="e.g., Airbnb for remote workers - a platform that connects digital nomads with co-living spaces designed for productivity. Features include high-speed internet, dedicated workspaces, and community events."
            rows={5}
            required
          />
          <div className="validate-tip">💡 Tip: Be as specific as possible. Include your target audience, key features, and what problem you're solving.</div>
          <button className="validate-btn" type="submit" disabled={loading || wordCount > maxWords || charCount > maxChars}>
            {loading ? 'Validating...' : 'Validate Idea'}
          </button>
          {error && <div className="validate-error">{error}</div>}
        </form>
        <div className="validate-whatyouget">
          <h3>What you'll get:</h3>
          <ul>
            <li>Market Demand Analysis</li>
            <li>Top Competitor Breakdown</li>
            <li>Target Audience Insights</li>
            <li>Revenue Model Suggestions</li>
            <li>MVP Feature Prioritization</li>
            <li>Downloadable PDF Report</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidatePage; 