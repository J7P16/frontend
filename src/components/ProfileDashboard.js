import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ProfileDashboard.css';

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, country, state, city, education_level')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
    };
    fetchProfile();
  }, [user]);

  const firstName = profile?.first_name;
  const lastName = profile?.last_name;
  const email = user?.email;
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-';
  const userId = user?.id;
  const country = profile?.country;
  const state = profile?.state;
  const city = profile?.city;
  const educationLevel = profile?.education_level;

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
            <h2>Personal Information</h2>
            <div><b>Email:</b> {email}</div>
            <div><b>Name:</b> {firstName}{lastName ? ` ${lastName}` : ''}</div>
            <div><b>Location:</b> {city}{state ? `, ${state}` : ''}{country ? `, ${country}` : ''}</div>
            <div><b>Education Level:</b> {educationLevel ? educationLevel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'}</div>
          </div>
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
                    {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 