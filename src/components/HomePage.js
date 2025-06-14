import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiUsers, FiUserCheck, FiZap, FiShield, FiBarChart2, FiUser } from 'react-icons/fi';
import logo from '../Clean_Validly_Logo.png';
import { FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import { supabase } from '../supabaseClient';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // Stay on homepage after sign out
    // No navigation needed
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Validly Logo" className="navbar-logo" />
          <span className="navbar-title">Validly</span>
        </div>
        <div className="navbar-right">
          {user && (
            <button
              className="navbar-profile-btn"
              title="Profile"
              onClick={() => navigate('/profile')}
            >
              <FiUser className="navbar-profile-icon" />
            </button>
          )}
          {user ? (
            <button className="navbar-signout" onClick={handleSignOut}>Sign Out</button>
          ) : (
            <button className="navbar-signout" onClick={() => navigate('/signin')}>Login</button>
          )}
        </div>
      </nav>

      {/* Homepage Content */}
      <div className="homepage-container">

        {/* Homepage Content */}
        <div className="homepage-hero">
          <h1>
            Launch Your Startup Idea <br /> With <span className="gradient-text">AI-Powered Validation</span>
          </h1>
          <p>Validate your crazy startup ideas in real-time to improve growth, deliverability, reduce competition, and take over markets.</p>
          <div className="homepage-hero-buttons">
            <button className="primary" onClick={() => user ? navigate('/validate') : navigate('/signup')}>Get started →</button>
            <button className="secondary">Learn more →</button>
          </div>
        </div>

        {/* Features Section */}
        <div className="homepage-features-section">
          <h2>Everything You Need To Validate Your Startup</h2>
          <p>Comprehensive validation tools powered by data and market intelligence</p>
          <div className="homepage-features-grid">
            <div className="feature-card">
              <div className="feature-icon"><FiTrendingUp color="#2563eb" /></div>
              <h3>Market Analysis</h3>
              <p>Get comprehensive market research and trend analysis for your startup idea in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiUsers color="#16a34a" /></div>
              <h3>Competitor Intelligence</h3>
              <p>Discover your competition, their strengths, weaknesses, and market positioning.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiUserCheck color="#9333ea" /></div>
              <h3>Target Audience Insights</h3>
              <p>Identify and understand your ideal customers with detailed demographic analysis.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiZap color="#eab308" /></div>
              <h3>MVP Roadmap</h3>
              <p>Get a prioritized feature list and development roadmap for your minimum viable product.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiShield color="#dc2626" /></div>
              <h3>Risk Assessment</h3>
              <p>Understand potential challenges and risks before you invest time and money.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiBarChart2 color="#6366f1" /></div>
              <h3>Validation Score</h3>
              <p>Receive a comprehensive score based on market demand, competition, and feasibility.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col footer-brand">
            <div className="footer-logo-row">
              <img src={logo} alt="Validly Logo" className="footer-logo" />
              <span className="footer-title">Validly</span>
            </div>
            <p className="footer-desc">Validate your startup idea in seconds with AI-powered insights, competitor analysis, and MVP recommendations.</p>
            <div className="footer-socials">
              <a href="/" className="footer-social"><FiTwitter /></a>
              <a href="/" className="footer-social"><FiLinkedin /></a>
              <a href="/" className="footer-social"><FiGithub /></a>
            </div>
          </div>
          <div className="footer-col footer-links">
            <div className="footer-links-title">Product</div>
            <a href="/" className="footer-link">Features</a>
            <a href="/pricing" className="footer-link" onClick={e => { e.preventDefault(); navigate('/pricing'); }}>Pricing</a>
            <a href="/" className="footer-link">Examples</a>
          </div>
          <div className="footer-col footer-links">
            <div className="footer-links-title">Company</div>
            <a href="/" className="footer-link">About</a>
            <a href="/" className="footer-link">Privacy Policy</a>
            <a href="/" className="footer-link">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Validly. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
};

export default HomePage; 