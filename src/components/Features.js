import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiTrendingUp, FiUsers, FiUserCheck, FiZap, FiShield, FiBarChart2, FiUser } from 'react-icons/fi';
import logo from '../Clean_Validly_Logo.png';


const Features = () => {
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
      </>

);
}

export default Features;
