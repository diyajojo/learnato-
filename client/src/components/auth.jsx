import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : 'inactive'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : 'inactive'}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          {/* Sliding indicator */}
          <div
            className="tab-indicator"
            style={{ left: isLogin ? '0%' : '50%' }}
          />
        </div>

        {/* Form Container with sliding animation */}
        <div className="auth-form-container">
          <div className={`form-slide ${isLogin ? 'login' : 'login-hidden'}`}>
            {/* Login Form */}
            <form className="auth-form">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="auth-input"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="auth-input"
                />
              </div>
              <button className="auth-button">
                Login
              </button>
            </form>
          </div>

          <div className={`form-slide ${!isLogin ? 'signup' : 'signup-hidden'}`}>
            {/* Sign Up Form */}
            <form className="auth-form">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="auth-input"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="auth-input"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="auth-input"
                />
              </div>
              <button className="auth-button">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;