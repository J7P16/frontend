import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp, supabase } from '../supabaseClient';
import './SignUpPage.css';

const SignUpPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { email, password, firstName, lastName } = form;
    const { data, error } = await signUp({ email, password, firstName, lastName });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Insert into profiles table
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: data.user?.id, email, first_name: firstName, last_name: lastName }
    ]);
    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
    setSuccess('Sign up successful! Please check your email to confirm your account.');
    setLoading(false);
    setTimeout(() => navigate('/signin'), 2500);
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Sign Up</h2>
        <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <div className="auth-link-row">
          <span>Already have an account? </span>
          <Link to="/signin">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage; 