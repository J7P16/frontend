import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ProfileDashboard.css';

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

  const firstName = profile?.first_name;
  const email = user?.email;
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-';
  const userId = user?.id;

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
            <span className="profile-plan-badge">Free</span>
            <div className="profile-plan-desc">Enjoy basic access to all essential features.</div>
            <button className="profile-manage-btn" onClick={() => navigate('/pricing')}>Manage Plan</button>
          </div>
          <div className="profile-card">
            <h2>Account Details</h2>
            <div><b>User ID:</b> {userId}</div>
            <div><b>Member Since:</b> {memberSince}</div>
            <div><b>Stored Ideas:</b> 0</div>
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
      </div>
    </div>
  );
} 