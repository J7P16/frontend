import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import './ProfileDashboard.css';
import { FiChevronDown, FiChevronUp, FiTrash2, FiBriefcase, FiDollarSign, FiTrendingUp, FiTarget, FiUsers, FiMessageSquare, FiExternalLink } from 'react-icons/fi';

const industryOptions = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Entertainment', 'Other'
];
const customerTypeOptions = [
  'B2B', 'B2C', 'B2B2C', 'Other'
];
const stageOptions = [
  'Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Bootstrapped', 'Other'
];
const teamSizeOptions = [
  '1 (Solo founder)', '2-5', '6-10', '11-50', '50+'
];
const experienceOptions = [
  'None', '1-2 years', '3-5 years', '5+ years', 'First-time founder', 'Previous exit'
];

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    background: '',
    technicalSkills: '',
    previousExperience: '',
    startupName: '',
    startupDescription: '',
    industry: '',
    customerType: '',
    stage: '',
    teamSize: '',
    techStack: '',
    funding: '',
    country: '',
    state: '',
    city: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [expandedIdea, setExpandedIdea] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showUpgradeNotification, setShowUpgradeNotification] = useState(false);
  const [upgradeType, setUpgradeType] = useState('');

  // Feature access for idea storage limits and API usage
  const { 
    getIdeaStorageLimit, 
    usage, 
    getQuickSearchLimit, 
    getDeepSearchLimit,
    hasExceededLimit,
    getUpgradeSuggestion
  } = useFeatureAccess();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
        if (profileData) {
          setEditForm({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            background: profileData.background || '',
            technicalSkills: profileData.technical_skills || '',
            previousExperience: profileData.previous_experience || '',
            startupName: profileData.startup_name || '',
            startupDescription: profileData.startup_description || '',
            industry: profileData.industry || '',
            customerType: profileData.customer_type || '',
            stage: profileData.stage || '',
            teamSize: profileData.team_size || '',
            techStack: profileData.tech_stack || '',
            funding: profileData.funding || '',
            country: profileData.country || '',
            state: profileData.state || '',
            city: profileData.city || '',
          });
        }
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchIdeas = async () => {
      if (user?.id) {
        setIdeasLoading(true);
        const { data, error } = await supabase
          .from('startup_ideas')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching ideas:', error);
        } else {
          setIdeas(data);
        }
        setIdeasLoading(false);
      }
    };

    if (user) {
      fetchIdeas();
    }
  }, [user]);

  const firstName = profile?.first_name;
  const email = user?.email;
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-';
  const userId = user?.id;
  const plan = profile?.plan || 'free';
  const customerId = profile?.stripe_customer_id || 'No Subscription Yet';
  const subscriptionId = profile?.subscription_id || 'No Subscription Yet';

  // Idea storage limits
  const ideaStorageLimit = getIdeaStorageLimit();
  const currentIdeasCount = ideas.length;
  const canSaveMoreIdeas = currentIdeasCount < ideaStorageLimit;

  // API usage limits
  const quickSearchLimit = getQuickSearchLimit();
  const deepSearchLimit = getDeepSearchLimit();
  const currentQuickSearches = usage.quickSearches || 0;
  const currentDeepSearches = usage.deepSearches || 0;
  const hasExceededQuickSearch = hasExceededLimit('quickSearchesPerMonth', currentQuickSearches);
  const hasExceededDeepSearch = hasExceededLimit('deepSearchesPerMonth', currentDeepSearches);

  // Plan display mapping
  const planDisplay = {
    free: {
      label: 'Free',
      desc: 'Enjoy basic access to all essential features.'
    },
    pro: {
      label: 'Pro',
      desc: 'Unlock advanced features, more searches, and personalized analysis.'
    },
    founder: {
      label: 'Founder',
      desc: 'Access all premium features, highest limits, and early access to new tools.'
    }
  };
  const currentPlan = planDisplay[plan] || planDisplay.free;

  const handleEdit = () => {
    setIsEditing(true);
    setEditError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        background: profile.background || '',
        technicalSkills: profile.technical_skills || '',
        previousExperience: profile.previous_experience || '',
        startupName: profile.startup_name || '',
        startupDescription: profile.startup_description || '',
        industry: profile.industry || '',
        customerType: profile.customer_type || '',
        stage: profile.stage || '',
        teamSize: profile.team_size || '',
        techStack: profile.tech_stack || '',
        funding: profile.funding || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
      });
    }
    setEditError('');
  };

  const handleSave = async () => {
    setEditLoading(true);
    setEditError('');
    
    try {
      const updates = {
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        background: editForm.background,
        technical_skills: editForm.technicalSkills,
        previous_experience: editForm.previousExperience,
        startup_name: editForm.startupName,
        startup_description: editForm.startupDescription,
        industry: editForm.industry,
        customer_type: editForm.customerType,
        stage: editForm.stage,
        team_size: editForm.teamSize,
        tech_stack: editForm.techStack,
        funding: editForm.funding,
        country: editForm.country,
        state: editForm.state,
        city: editForm.city,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prevProfile => ({...prevProfile, ...updates}));
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      // 1. Delete from your profiles table (optional, or do this in backend)
      await supabase.from('profiles').delete().eq('id', user.id);

      // 2. Call your backend to delete the user from Auth
      const response = await fetch('http://localhost:5000/api/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to delete user');

      // 3. Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    const confirmation = window.confirm('Are you sure you want to delete this idea?');
    if (!confirmation) return;

    const { error } = await supabase
      .from('startup_ideas')
      .delete()
      .eq('id', ideaId);

    if (error) {
      console.error('Error deleting idea:', error);
      alert('Failed to delete idea.');
    } else {
      setIdeas(ideas.filter(idea => idea.id !== ideaId));
    }
  };

  const toggleIdea = (ideaId) => {
    setExpandedIdea(expandedIdea === ideaId ? null : ideaId);
    setExpandedSections({}); // Reset subsections when toggling main card
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // This function is used for the manage plan button so that it either directs the user to the billing page (if they currently have a subscription) or the pricing page
  const handleManagePlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', user.id)
          .single();
        
        if (profile?.stripe_customer_id) {
          // Redirect to Stripe customer portal
          window.open(`https://billing.stripe.com/session/${profile.stripe_customer_id}`, '_blank');
        } else {
          // Redirect to pricing page if no subscription
          navigate('/pricing');
        }
      }
    } catch (error) {
      console.error('Error managing plan:', error);
      navigate('/pricing');
    }
  };

  const showUpgradeNotificationForFeature = (feature) => {
    if (feature === 'quick-search') {
      setUpgradeType('quick-search');
    } else if (feature === 'deep-search') {
      setUpgradeType('deep-search');
    } else {
      setUpgradeType('general');
    }
    setShowUpgradeNotification(true);
  };

  // Helper function to get usage bar color class
  const getUsageBarClass = (current, limit) => {
    if (current >= limit) return 'exceeded';
    if (current >= limit * 0.75) return 'warning'; // 75% threshold
    return ''; // Default green
  };

  return (
    <div className="profile-bg">
      <div className="profile-container">
        <button className="back-link" onClick={() => navigate('/')}>← Back to Home</button>
        <h1 className="profile-title">
          Hello <span className="profile-gradient">{firstName}</span>, <br />
          <span className="profile-title-black">Welcome to Your Profile Dashboard!</span>
        </h1>
        <div className="profile-cards">
          <div className="profile-card">
            <h2>Pricing Plan</h2>
            <span className={`profile-plan-badge ${plan}`}>{currentPlan.label}</span>
            <div className="profile-plan-desc">{currentPlan.desc}</div>
            
            {/* API Usage Section */}
            <div className="api-usage-section">
              <h3>API Usage This Month</h3>
              
              {/* Quick Searches */}
              <div className="usage-item">
                <div className="usage-label">
                  <span>Quick Searches</span>
                  <span className={`usage-count ${hasExceededQuickSearch ? 'exceeded' : ''}`}>
                    {currentQuickSearches} / {quickSearchLimit}
                  </span>
                </div>
                <div className="usage-bar">
                  <div 
                    className={`usage-bar-fill ${getUsageBarClass(currentQuickSearches, quickSearchLimit)}`}
                    style={{ width: `${Math.min((currentQuickSearches / quickSearchLimit) * 100, 100)}%` }}
                  ></div>
                </div>
                {hasExceededQuickSearch && (
                  <div className="usage-warning">
                    <small 
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => showUpgradeNotificationForFeature('quick-search')}
                    >
                      ⚠️ You've reached your quick search limit. Click to upgrade.
                    </small>
                  </div>
                )}
              </div>
              
              {/* Deep Searches */}
              <div className="usage-item">
                <div className="usage-label">
                  <span>Deep Searches</span>
                  <span className={`usage-count ${hasExceededDeepSearch ? 'exceeded' : ''}`}>
                    {currentDeepSearches} / {deepSearchLimit}
                  </span>
                </div>
                <div className="usage-bar">
                  <div 
                    className={`usage-bar-fill ${getUsageBarClass(currentDeepSearches, deepSearchLimit)}`}
                    style={{ width: `${Math.min((currentDeepSearches / deepSearchLimit) * 100, 100)}%` }}
                  ></div>
                </div>
                {hasExceededDeepSearch && (
                  <div className="usage-warning">
                    <small 
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => showUpgradeNotificationForFeature('deep-search')}
                    >
                      ⚠️ You've reached your deep search limit. Click to upgrade.
                    </small>
                  </div>
                )}
              </div>
            </div>
            
            <button className="profile-manage-btn" onClick={handleManagePlan}>Manage Plan</button>
          </div>
          <div className="profile-card">
            <h2>Account Details</h2>
            <div><b>User ID:</b> {userId}</div>
            <div><b>Customer ID:</b> {customerId}</div>
            <div><b>Subscription ID:</b> {subscriptionId}</div>
            <div><b>Member Since:</b> {memberSince}</div>
            <div><b>Stored Ideas:</b> {currentIdeasCount} / {ideaStorageLimit}</div>
            {!canSaveMoreIdeas && (
              <div className="storage-limit-warning">
                <small>⚠️ You've reached your idea storage limit. Upgrade your plan to save more ideas.</small>
              </div>
            )}
            <button
              className="profile-delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteLoading}
            >
              Delete Account
            </button>
            {showDeleteConfirm && (
              <div className="delete-confirm-modal">
                <div className="delete-confirm-content">
                  <h3>Are you sure?</h3>
                  <p>This will permanently delete your account and all associated data. This action cannot be undone.</p>
                  {deleteError && <div className="auth-error">{deleteError}</div>}
                  <button
                    className="danger"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Yes, delete it'}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} disabled={deleteLoading}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="profile-card personal-info-card">
            <div className="profile-card-header">
              <h2>Personal Information</h2>
              {!isEditing ? (
                <button className="profile-edit-btn" onClick={handleEdit}>
                  Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="profile-cancel-btn" onClick={handleCancel} disabled={editLoading}>
                    Cancel
                  </button>
                  <button className="profile-save-btn" onClick={handleSave} disabled={editLoading}>
                    {editLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className={`personal-info-grid ${isEditing ? 'editing' : ''}`}>
              {/* --- Column 1 --- */}
              <div className="info-column">
                <div className="info-item">
                  <label>Email</label>
                  <input type="text" value={email || ''} disabled />
                </div>
                <div className="info-item">
                  <label>First Name</label>
                  {isEditing ? (
                    <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} placeholder="Your first name" />
                  ) : (
                    <input type="text" value={profile?.first_name || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} placeholder="Your last name" />
                  ) : (
                    <input type="text" value={profile?.last_name || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Country</label>
                  {isEditing ? (
                    <input type="text" value={editForm.country} onChange={(e) => setEditForm({...editForm, country: e.target.value})} placeholder="Your country" />
                  ) : (
                    <input type="text" value={profile?.country || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>State</label>
                  {isEditing ? (
                    <input type="text" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value})} placeholder="Your state" />
                  ) : (
                    <input type="text" value={profile?.state || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>City</label>
                  {isEditing ? (
                    <input type="text" value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})} placeholder="Your city" />
                  ) : (
                    <input type="text" value={profile?.city || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Background/Field of Study or Work</label>
                  {isEditing ? (
                    <input type="text" value={editForm.background} onChange={(e) => setEditForm({...editForm, background: e.target.value})} placeholder="e.g., Computer Science, Marketing, Medicine" />
                  ) : (
                    <input type="text" value={profile?.background || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Technical Skills</label>
                  {isEditing ? (
                    <input type="text" value={editForm.technicalSkills} onChange={(e) => setEditForm({...editForm, technicalSkills: e.target.value})} placeholder="e.g., Python, React, UI/UX Design, Business Strategy" />
                  ) : (
                    <input type="text" value={profile?.technical_skills || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Previous Startup Experience</label>
                  {isEditing ? (
                    <select value={editForm.previousExperience} onChange={(e) => setEditForm({...editForm, previousExperience: e.target.value})}>
                      <option value="">Select experience level</option>
                      {experienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={profile?.previous_experience || ''} placeholder="-" disabled />
                  )}
                </div>
              </div>

              {/* --- Column 2 --- */}
              <div className="info-column">
                <div className="info-item startup-description">
                  <label>Brief Startup Description</label>
                  {isEditing ? (
                    <textarea value={editForm.startupDescription} onChange={(e) => setEditForm({...editForm, startupDescription: e.target.value})} placeholder="One-line description of your startup" rows={3}/>
                  ) : (
                    <textarea value={profile?.startup_description || ''} placeholder="-" disabled rows={3}/>
                  )}
                </div>
                <div className="info-item">
                  <label>Startup Name</label>
                  {isEditing ? (
                    <input type="text" value={editForm.startupName} onChange={(e) => setEditForm({...editForm, startupName: e.target.value})} placeholder="Current or previous startup name" />
                  ) : (
                    <input type="text" value={profile?.startup_name || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Target Industry</label>
                  {isEditing ? (
                    <select value={editForm.industry} onChange={(e) => setEditForm({...editForm, industry: e.target.value})}>
                      <option value="">Select industry</option>
                      {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={profile?.industry || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Target Customer Type</label>
                  {isEditing ? (
                    <select value={editForm.customerType} onChange={(e) => setEditForm({...editForm, customerType: e.target.value})}>
                      <option value="">Select customer type</option>
                      {customerTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={profile?.customer_type || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Current Stage</label>
                  {isEditing ? (
                    <select value={editForm.stage} onChange={(e) => setEditForm({...editForm, stage: e.target.value})}>
                      <option value="">Select current stage</option>
                      {stageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={profile?.stage || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Team Size</label>
                  {isEditing ? (
                    <select value={editForm.teamSize} onChange={(e) => setEditForm({...editForm, teamSize: e.target.value})}>
                      <option value="">Select team size</option>
                      {teamSizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={profile?.team_size || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Tech Stack/AI Models Used</label>
                  {isEditing ? (
                    <input type="text" value={editForm.techStack} onChange={(e) => setEditForm({...editForm, techStack: e.target.value})} placeholder="e.g., React, Node.js, OpenAI GPT-4" />
                  ) : (
                    <input type="text" value={profile?.tech_stack || ''} placeholder="-" disabled />
                  )}
                </div>
                <div className="info-item">
                  <label>Funding Raised</label>
                  {isEditing ? (
                    <input type="text" value={editForm.funding} onChange={(e) => setEditForm({...editForm, funding: e.target.value})} placeholder="e.g., $50K, Pre-seed, Series A" />
                  ) : (
                    <input type="text" value={profile?.funding || ''} placeholder="-" disabled />
                  )}
                </div>
              </div>
            </div>
            {editError && <div className="auth-error">{editError}</div>}
        </div>

        <div className="startup-ideas-section">
          <h2 className="startup-ideas-title">Your Startup Ideas&nbsp;&nbsp;&nbsp;({currentIdeasCount} / {ideaStorageLimit})</h2>
          {!canSaveMoreIdeas && (
                <div className="storage-limit-notice">
                  <p>You've reached your idea storage limit ({ideaStorageLimit} ideas).</p>
                  <button 
                    className="upgrade-storage-btn"
                    onClick={() => navigate('/pricing')}
                  >
                    Upgrade Plan to Save More Ideas
                  </button>
                </div>
              )}
          <br></br>
          {ideasLoading ? (
            <p>Loading ideas...</p>
          ) : ideas.length === 0 ? (
            <div className="no-ideas-card">
              <p>You haven't saved any startup ideas yet.</p>
              <button onClick={() => navigate('/validate')}>Validate Your First Idea</button>
            </div>
          ) : (
            <div className="ideas-list">
              {ideas.map((idea) => (
                <div key={idea.id} className="idea-card">
                  <div className="idea-card-header" onClick={() => toggleIdea(idea.id)}>
                    <div className="idea-card-title-group">
                      <h3>{idea.title}</h3>
                      <span>{new Date(idea.created_at).toLocaleString()}</span>
                    </div>
                    <div className="idea-card-actions">
                      <button className="idea-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteIdea(idea.id); }}>
                        <FiTrash2 />
                      </button>
                      {expandedIdea === idea.id ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                  {expandedIdea === idea.id && (
                    <div className="idea-card-content">
                      <div className="idea-question-box">
                        <h4>Your Question</h4>
                        <p>"{idea.question}"</p>
                      </div>

                      <h4>AI Analysis</h4>

                      {/* Overview Section */}
                      <div className="analysis-section">
                        <div className="analysis-section-header" onClick={() => toggleSection('overview')}>
                          <div className="analysis-section-title">
                            <FiBriefcase className="section-icon" />
                            <span>Overview</span>
                          </div>
                          {expandedSections.overview ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {expandedSections.overview && (
                          <div className="analysis-section-content">
                            <p>{idea.analysis.overview}</p>
                          </div>
                        )}
                      </div>

                      {/* Market Demand Section */}
                      <div className="analysis-section">
                        <div className="analysis-section-header" onClick={() => toggleSection('marketDemand')}>
                          <div className="analysis-section-title">
                            <FiTrendingUp className="section-icon" />
                            <span>Market Demand</span>
                            <span className="score-badge-sm">{idea.analysis?.score || 'N/A'}/10</span>
                          </div>
                          {expandedSections.marketDemand ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {expandedSections.marketDemand && (
                          <div className="analysis-section-content">
                            <p><strong>Summary:</strong> {idea.analysis?.summary || 'No summary available'}</p>
                            <p><strong>Details:</strong> {idea.analysis?.details || 'No details available'}</p>
                             <div className="subsection">
                                <h5>Customer Pain Points</h5>
                                <p><strong>Primary:</strong> {idea.analysis.marketDemand?.painPoints?.primaryPainPoint || 'Not specified'}</p>
                                <p><strong>Urgency:</strong> {idea.analysis.marketDemand?.painPoints?.urgency || 'Not specified'}</p>
                                <p><strong>Evidence:</strong> {idea.analysis.marketDemand?.painPoints?.evidence || 'Not specified'}</p>
                            </div>
                             <div className="subsection">
                                <h5>Market Timing & Trends</h5>
                                <p><strong>Readiness:</strong> {idea.analysis.marketDemand?.timingTrends?.marketReadiness || 'Not specified'}</p>
                                <p><strong>Trends:</strong> {idea.analysis.marketDemand?.timingTrends?.emergingTrends || 'Not specified'}</p>
                                <p><strong>Assessment:</strong> {idea.analysis.marketDemand?.timingTrends?.timingAssessment || 'Not specified'}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Competitors Section */}
                      <div className="analysis-section">
                        <div className="analysis-section-header" onClick={() => toggleSection('competitors')}>
                          <div className="analysis-section-title">
                            <FiTarget className="section-icon" />
                            <span>Market Competitiveness</span>
                            <span className="score-badge-sm">{idea.analysis?.feasibilityscore || 'N/A'}/10</span>

                          </div>
                          {expandedSections.competitors ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {expandedSections.competitors && (
                          <div className="analysis-section-content">
                            {idea.analysis.competitors.map((comp, i) => (
                                <div key={i} className="subsection competitor-item">
                                    <div className="competitor-title">
                                        <strong>{comp.name}</strong>
                                        <span className={`popularity-badge-sm ${comp.popularity?.toLowerCase()}`}>{comp.popularity} Pop.</span>
                                    </div>
                                    <p>{comp.description}</p>
                                    <p><strong>Pricing:</strong> {comp.pricing}</p>
                                    <h5>Strengths</h5>
                                    <ul>{comp.pros.map((pro, j) => <li key={j}>{pro}</li>)}</ul>
                                    <h5>Weaknesses</h5>
                                    <ul>{comp.weaknesses.map((weak, j) => <li key={j}>{weak}</li>)}</ul>
                                </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Target Audience Section */}
                      <div className="analysis-section">
                        <div className="analysis-section-header" onClick={() => toggleSection('targetAudience')}>
                          <div className="analysis-section-title">
                            <FiUsers className="section-icon" />
                            <span>Target Audience</span>
                          </div>
                          {expandedSections.targetAudience ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {expandedSections.targetAudience && (
                          <div className="analysis-section-content">
                            {idea.analysis.targetAudience.map((aud, i) => (
                                <div key={i} className="subsection">
                                    <h5>{aud.group}</h5>
                                    <h6>Potential Online Hangouts:</h6>
                                    <ul>
                                        {aud.onlineDestinations.map((dest, j) => (
                                            <li key={j}>{dest.name} ({dest.type}) - {dest.description}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pitch Section */}
                      <div className="analysis-section">
                        <div className="analysis-section-header" onClick={() => toggleSection('pitch')}>
                          <div className="analysis-section-title">
                            <FiMessageSquare className="section-icon" />
                            <span>Professional Pitch</span>
                          </div>
                          {expandedSections.pitch ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {expandedSections.pitch && (
                          <div className="analysis-section-content">
                            <p>{idea.analysis.pitch}</p>
                          </div>
                        )}
                      </div>

                      {/* Revenue Model Section */}
                      <div className="analysis-section">
                        <div className="analysis-section-header" onClick={() => toggleSection('revenueModels')}>
                          <div className="analysis-section-title">
                            <FiDollarSign className="section-icon" />
                            <span>Revenue Model Suggestions</span>
                          </div>
                          {expandedSections.revenueModels ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {expandedSections.revenueModels && (
                          <div className="analysis-section-content">
                            <ul>
                              {idea.analysis.revenueModels.map((model, i) => <li key={i}>{model}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* MVP Section */}
                      <div className="analysis-section">
                        <div className="analysis-section-header" onClick={() => toggleSection('mvp')}>
                          <div className="analysis-section-title">
                            <FiExternalLink className="section-icon" />
                            <span>MVP Feature Set</span>
                          </div>
                          {expandedSections.mvp ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                        {expandedSections.mvp && (
                          <div className="analysis-section-content">
                            <div className="subsection">
                                <h5>Suggested MVP Design</h5>
                                <p>{idea.analysis.mvpDesign}</p>
                            </div>
                            <div className="subsection">
                                <h5>Feature Prioritization</h5>
                                <ul className="mvp-feature-list">
                                    {idea.analysis.mvpFeatures.map((feat, i) => (
                                        <li key={i}>
                                            <span>{feat.feature}</span>
                                            <div className="mvp-badges">
                                                <span className={`mvp-badge priority-${feat.priority?.toLowerCase()}`}>{feat.priority} Priority</span>
                                                <span className={`mvp-badge effort-${feat.effort?.toLowerCase()}`}>{feat.effort} Effort</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Upgrade Notification Modal */}
        {showUpgradeNotification && (
          <>
            <div className="upgrade-notification-backdrop"></div>
            <div className="upgrade-notification">
              <div className="upgrade-notification-content">
                <div className="upgrade-notification-icon">🔒</div>
                <div className="upgrade-notification-text">
                  <h4>Upgrade Required</h4>
                  {upgradeType === 'quick-search' ? (
                    <p>You've reached your quick search limit for this month. Upgrade your plan to continue validating ideas.</p>
                  ) : upgradeType === 'deep-search' ? (
                    <p>You've reached your deep search limit for this month. Upgrade your plan to continue using deep research.</p>
                  ) : (
                    <p>You've reached your usage limit. Upgrade your plan to continue using this feature.</p>
                  )}
                </div>
                <button 
                  className="upgrade-notification-btn"
                  onClick={() => navigate('/pricing')}
                >
                  Upgrade Now
                </button>
                <button 
                  className="upgrade-notification-close"
                  onClick={() => setShowUpgradeNotification(false)}
                >
                  ×
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 