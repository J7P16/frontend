import React, { useState, useEffect } from 'react';
import './PricingPage.css';
import { supabase } from '../supabaseClient';
import { FiUser, FiZap, FiCalendar, FiStar, FiCircle } from 'react-icons/fi';

const planData = (billing, userEmail = '') => ([
  {
    name: 'Free',
    price: '$0',
    period: '',
    features: [
      'Basic Idea Analysis',
      '50 Quick Searches Per Month',
      'Competitor Overview',
      'MVP Feature Suggestions',
      { text: 'Idea/Product Storage', unavailable: true },
      { text: 'Downloadable PDF Exports', unavailable: true },
      { text: 'Priority AI Processing', unavailable: true },
      { text: 'Advanced Insights', unavailable: true },
    ],
    button: 'Start for Free',
    highlight: false,
    icon: <span className="plan-icon-bg free large"><FiUser className="plan-icon-svg large" /></span>,
    paymentLink: null,
  },
  {
    name: 'Pro',
    price: billing === 'monthly' ? '$9.99' : '$89.99',
    period: billing === 'monthly' ? '/month' : '/year',
    features: [
      'Everything in Free Plan',
      '200 Quick Searches Per Month',
      'Personalized Search Results',
      'Downloadable PDF Exports',
      'Priority AI Processing',
      'Idea/Product Storage (100)',
      'Advanced Profile Dashboard',
      { text: 'Deep Research Engine', unavailable: true },
    ],
    button: 'Upgrade to Pro',
    highlight: true,
    badge: 'Most Popular',
    icon: <span className="plan-icon-bg pro large"><FiZap className="plan-icon-svg large" /></span>,
    productId: 'prod_SYknpEzXHNaC6J',
    paymentLink: billing === 'monthly' 
      ? 'https://buy.stripe.com/test_6oU3cxa8R1EefecdWA38400' + (userEmail ? '?prefilled_email=' + userEmail : '')
      : 'https://buy.stripe.com/test_3cI14p1Cl0Aaea89Gk38401' + (userEmail ? '?prefilled_email=' + userEmail : ''),
  },
  {
    name: 'Founder',
    price: billing === 'monthly' ? '$24.99' : '$224.99',
    period: billing === 'monthly' ? '/month' : '/year',
    features: [
      'Everything in Pro Plan',
      'Access to Deep Research Engine',
      '500 Quick Searches Per Month',
      '50 Deep Searches Per Month',
      'Highest Priority AI Processing',
      'Idea/Product Storage (500)',
      'Specifc API Selections',
      'Early Access to New Features',
    ],
    button: 'Become a Founder',
    highlight: false,
    icon: <span className="plan-icon-bg founder large"><FiCalendar className="plan-icon-svg large" /></span>,
    productId: 'prod_SYkobvntWhJWQ8',
    paymentLink: billing === 'monthly'
      ? 'https://buy.stripe.com/test_7sYaEZ80J2Ii4zyaKo38402' + (userEmail ? '?prefilled_email=' + userEmail : '')      
      : 'https://buy.stripe.com/test_aFa5kFftb0Aa6HGdWA38403' + (userEmail ? '?prefilled_email=' + userEmail : ''),
  },
]);

const infoPoints = [
  {
    icon: <span className="info-emoji">🔒</span>, text: 'Secured Payments via Stripe • Cancel Subscription Anytime'
  },
  {
    icon: <span className="info-emoji">💳</span>, text: 'All Major Cards Accepted'
  },
  {
    icon: <span className="info-emoji">🌐</span>, text: 'Available Worldwide'
  },
  {
    icon: <span className="info-emoji">📧</span>, text: 'Email Support Included'
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly');
  const [userEmail, setUserEmail] = useState('');
  const plans = planData(billing, userEmail);

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setUserEmail(user.email);
        }
      } catch (error) {
        console.error('Error getting user email:', error);
      }
    };

    getUserEmail();
  }, []);

  const handlePlanClick = (plan) => {
    if (plan.name === 'Free') {
      // Handle free plan - could redirect to sign up or dashboard
      window.location.href = '/validate';
      return;
    }
    
    if (plan.paymentLink) {
      // Redirect to Stripe checkout
      window.open(plan.paymentLink, '_blank');
    }
  };

  return (
    <div className="pricing-bg">
      <div className="pricing-container">
        <a href="/" className="pricing-back">&larr; Back to Home</a>
        <h1 className="pricing-title">
          Choose Your <span className="pricing-gradient">Validation Journey</span>
        </h1>
        <p className="pricing-subtitle">
          Start free and upgrade as you validate more ideas. All plans include<br />
          our core AI validation engine.
        </p>
        {/* Billing Toggle */}
        <div className="pricing-toggle-wrap" style={{ marginBottom: 40 }}>
          <div className="pricing-toggle">
            <button
              className={billing === 'monthly' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button
              className={billing === 'yearly' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setBilling('yearly')}
            >
              Yearly <span className="toggle-save">Save 25%</span>
            </button>
          </div>
        </div>
        {/* Pricing Cards */}
        <div className="pricing-cards" style={{ marginTop: 32 }}>
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={
                'pricing-card' +
                (plan.highlight ? ' popular' : '')
              }
            >
              {plan.badge && (
                <span className="pricing-badge">
                  <FiStar className="badge-star" /> {plan.badge}
                </span>
              )}
              <span className="pricing-icon">{plan.icon}</span>
              <h2 className="pricing-plan-name">{plan.name}</h2>
              <div className="pricing-plan-desc">
                {plan.name === 'Free' && 'Perfect for drafting your first startup idea'}
                {plan.name === 'Pro' && 'For serious entrepreneurs searching for product-market fit'}
                {plan.name === 'Founder' && 'Complete product validation suite for existing companies'}
              </div>
              <div className="pricing-price-row">
                <span className="pricing-price">{plan.price}</span>
                {plan.period && <span className="pricing-period">{plan.period}</span>}
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, i) =>
                  typeof feature === 'string' ? (
                    <li key={i} className="feature-available">
                      <span className="feature-check">✔</span>
                      {feature}
                    </li>
                  ) : (
                    <li key={i} className="feature-unavailable">
                      <span className="feature-unavailable-icon"><FiCircle /></span>
                      {feature.text}
                    </li>
                  )
                )}
              </ul>
              <button
                className={
                  plan.highlight || plan.name === 'Founder'
                    ? 'pricing-btn gradient-btn'
                    : 'pricing-btn'
                }
                onClick={() => handlePlanClick(plan)}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
        {/* Info Points */}
        <div className="pricing-info-points">
          <div className="info-row info-row-top">
            <span className="info-point">{infoPoints[0].icon} {infoPoints[0].text}</span>
          </div>
          <div className="info-row info-row-bottom">
            {infoPoints.slice(1).map((point, idx) => (
              <span className="info-point" key={idx}>
                {point.icon} {point.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
