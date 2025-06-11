import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClipboard, FiZap } from 'react-icons/fi';

const ValidatePage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message });
      const parsed = JSON.parse(response.data.reply);
      setLoading(false);
      navigate('/results', { state: { analysis: parsed, input: message } });
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
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
          <p>Share your vision and let our AI provide comprehensive validation insights</p>
        </div>
        <form onSubmit={handleSubmit} className="validate-form">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="e.g., Airbnb for remote workers - a platform that connects digital nomads with co-living spaces designed for productivity. Features include high-speed internet, dedicated workspaces, and community events."
            rows={5}
            required
          />
          <div className="validate-tip">💡 Tip: Include your target audience, key features, and what problem you're solving</div>
          <button className="validate-btn" type="submit" disabled={loading}>{loading ? 'Validating...' : 'Validate Idea'}</button>
          {error && <div className="validate-error">{error}</div>}
        </form>
        <div className="validate-whatyouget">
          <h3>What you'll get:</h3>
          <ul>
            <li>Market demand analysis</li>
            <li>Top 3 competitor breakdown</li>
            <li>Target audience insights</li>
            <li>Revenue model suggestions</li>
            <li>MVP feature prioritization</li>
            <li>Downloadable PDF report</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidatePage; 