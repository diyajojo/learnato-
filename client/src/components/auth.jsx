import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in localStorage
      if (data.session && data.session.access_token) {
        localStorage.setItem('accessToken', data.session.access_token);
        localStorage.setItem('refreshToken', data.session.refresh_token);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setSuccess('Login successful! Redirecting...');
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Signup data:', signupData);
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(signupData)
      });
    
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess('Signup successful! Please check your email and then login.');
      
      // Clear form
      setSignupData({
        fullName: '',
        email: '',
        password: ''
      });

      // Switch to login tab after 2 seconds
      setTimeout(() => {
        setIsLogin(true);
        setSuccess('');
      }, 2000);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : 'inactive'}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : 'inactive'}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
          >
            Sign Up
          </button>
          <div
            className="tab-indicator"
            style={{ left: isLogin ? '0%' : '50%' }}
          />
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.5)',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.875rem'
          }}>
            {success}
          </div>
        )}

        {/* Form Container */}
        <div className="auth-form-container">
          <div className={`form-slide ${isLogin ? 'login' : 'login-hidden'}`}>
            {/* Login Form */}
            <form className="auth-form" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="auth-input"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="auth-input"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          <div className={`form-slide ${!isLogin ? 'signup' : 'signup-hidden'}`}>
            {/* Sign Up Form */}
            <form className="auth-form" onSubmit={handleSignup}>
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="auth-input"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="auth-input"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 6 characters)"
                  className="auth-input"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;