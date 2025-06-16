import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './SignUpPage.css';
import countries from './countries.json';
import citiesData from './cities.json';

const SignUpPage = () => {
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    country: '',
    state: '',
    city: '',
    educationLevel: '',
    email: '', 
    password: '', 
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const countryInputRef = useRef(null);
  const stateInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const navigate = useNavigate();

  // Filter countries as user types
  const handleCountryChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, country: value, state: '', city: '' });
    if (value.length === 0) {
      setCountryOptions([]);
      setShowCountryDropdown(false);
      setStateOptions([]);
      setCityOptions([]);
      return;
    }
    const filtered = countries.filter(c => c.toLowerCase().startsWith(value.toLowerCase()));
    setCountryOptions(filtered);
    setShowCountryDropdown(true);
    // Reset state and city if country changes
    setStateOptions([]);
    setCityOptions([]);
  };

  // When a country is selected
  const handleCountrySelect = (country) => {
    setForm({ ...form, country, state: '', city: '' });
    setCountryOptions([]);
    setShowCountryDropdown(false);
    // Set state options if US is selected
    if (country === 'United States') {
      setStateOptions(Object.keys(citiesData['United States']));
    }
    // Reset city options
    setCityOptions([]);
  };

  // Filter states as user types
  const handleStateChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, state: value, city: '' });
    if (!form.country || form.country !== 'United States') {
      setStateOptions([]);
      setShowStateDropdown(false);
      return;
    }
    if (value.length === 0) {
      setStateOptions(Object.keys(citiesData['United States']));
      setShowStateDropdown(true);
      return;
    }
    const filtered = Object.keys(citiesData['United States']).filter(state => 
      state.toLowerCase().startsWith(value.toLowerCase())
    );
    setStateOptions(filtered);
    setShowStateDropdown(true);
  };

  // When a state is selected
  const handleStateSelect = (state) => {
    setForm({ ...form, state, city: '' });
    setShowStateDropdown(false);
    // Set city options for this state
    const cities = citiesData['United States'][state] || [];
    setCityOptions(cities);
  };

  // Filter cities as user types
  const handleCityChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, city: value });
    if (!form.country || !citiesData[form.country]) {
      setCityOptions([]);
      setShowCityDropdown(false);
      return;
    }
    if (value.length === 0) {
      if (form.country === 'United States' && form.state) {
        setCityOptions(citiesData['United States'][form.state] || []);
      } else {
        setCityOptions(citiesData[form.country]);
      }
      setShowCityDropdown(true);
      return;
    }
    let filtered;
    if (form.country === 'United States' && form.state) {
      filtered = (citiesData['United States'][form.state] || []).filter(city => 
        city.toLowerCase().startsWith(value.toLowerCase())
      );
    } else {
      filtered = citiesData[form.country].filter(city => 
        city.toLowerCase().startsWith(value.toLowerCase())
      );
    }
    setCityOptions(filtered);
    setShowCityDropdown(true);
  };

  // When a city is selected
  const handleCitySelect = (city) => {
    setForm({ ...form, city });
    setShowCityDropdown(false);
  };

  // Hide dropdowns on blur
  const handleCountryBlur = () => setTimeout(() => setShowCountryDropdown(false), 100);
  const handleStateBlur = () => setTimeout(() => setShowStateDropdown(false), 100);
  const handleCityBlur = () => setTimeout(() => setShowCityDropdown(false), 100);

  const handleChange = (e) => {
    if (e.target.name === 'country') return handleCountryChange(e);
    if (e.target.name === 'state') return handleStateChange(e);
    if (e.target.name === 'city') return handleCityChange(e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { email, password, confirmPassword, firstName, lastName, country, state, city, educationLevel } = form;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    // Only allow submit if country/city are valid
    if (!countries.includes(country)) {
      setError('Please select a valid country from the list.');
      setLoading(false);
      return;
    }
    if (country === 'United States' && !state) {
      setError('Please select a state.');
      setLoading(false);
      return;
    }
    if (country === 'United States' && !citiesData['United States'][state]?.includes(city)) {
      setError('Please select a valid city from the list.');
      setLoading(false);
      return;
    } else if (country !== 'United States' && !citiesData[country]?.includes(city)) {
      setError('Please select a valid city from the list.');
      setLoading(false);
      return;
    }
    // Pass metadata to Supabase Auth signUp
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/signin`,
        data: {
          firstName,
          lastName,
          country,
          state,
          city,
          educationLevel
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess('Sign up successful! Please check your email to confirm your account.');
    setLoading(false);
    setTimeout(() => navigate('/signin'), 2500);
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="auth-title">Sign Up</h2>
        <input name="firstName" type="text" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input name="lastName" type="text" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <div className="form-row">
          <div className="autocomplete-wrapper">
            <input
              name="country"
              type="text"
              placeholder="Country"
              value={form.country}
              onChange={handleCountryChange}
              onFocus={handleCountryChange}
              onBlur={handleCountryBlur}
              autoComplete="off"
              ref={countryInputRef}
              required
            />
            {showCountryDropdown && countryOptions.length > 0 && (
              <ul className="autocomplete-dropdown">
                {countryOptions.map((country) => (
                  <li key={country} onMouseDown={() => handleCountrySelect(country)}>{country}</li>
                ))}
              </ul>
            )}
          </div>
          
          {form.country === 'United States' && (
            <div className="autocomplete-wrapper">
              <input
                name="state"
                type="text"
                placeholder="State"
                value={form.state}
                onChange={handleStateChange}
                onFocus={handleStateChange}
                onBlur={handleStateBlur}
                autoComplete="off"
                ref={stateInputRef}
                required
              />
              {showStateDropdown && stateOptions.length > 0 && (
                <ul className="autocomplete-dropdown">
                  {stateOptions.map((state) => (
                    <li key={state} onMouseDown={() => handleStateSelect(state)}>{state}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        <div className="autocomplete-wrapper">
          <input
            name="city"
            type="text"
            placeholder="City"
            value={form.city}
            onChange={handleCityChange}
            onFocus={handleCityChange}
            onBlur={handleCityBlur}
            autoComplete="off"
            ref={cityInputRef}
            required
            disabled={!form.country || (form.country === 'United States' && !form.state)}
          />
          {showCityDropdown && cityOptions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {cityOptions.map((city) => (
                <li key={city} onMouseDown={() => handleCitySelect(city)}>{city}</li>
              ))}
            </ul>
          )}
        </div>
        
        <select name="educationLevel" value={form.educationLevel} onChange={handleChange} required className="education-select">
          <option value="">Select Education Level</option>
          <option value="High School">High School</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate">Graduate</option>
          <option value="Professional">Professional</option>
        </select>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        
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