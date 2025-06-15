import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ProfileDashboard.css';

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
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
            <button className="profile-delete-btn">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
} 