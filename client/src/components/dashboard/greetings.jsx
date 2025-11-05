import React from 'react';

const WelcomeBanner = ({ user }) => {
  return (
    <div className="welcome-banner">
      <img 
        src="/assets/pfp.png"
        alt="Profile" 
        className="welcome-pfp"
      />
      <div className="welcome-text">
        <h2>Hi {user?.full_name || 'User'}👋 </h2>
        <p>Welcome back. What would you like to do today?</p>
      </div>
    </div>
  );
};

export default WelcomeBanner;