import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/featurecard';
import { Book } from 'lucide-react';

// Constants
const primaryColor = "rgba(255, 140, 90, 1)";
const backgroundColor = "rgba(18, 87, 116, 1)";

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <main className="landing-main" style={{ background: backgroundColor }}>
      <div className="background-overlay">
        <img
          src="/assets/bgimg.jpg"
          alt="Background"
          className="background-image"
        />
        <div className="background-blend" />
      </div>

      <nav className="navigation">
        <div className="nav-left" style={{ background: primaryColor }}>
          <div className="logo-container">
            <Book className="logo-icon" />
            <div className="logo-text">
              <span className="logo-study">Learnato</span>
              <span className="logo-gpt" style={{ color: backgroundColor }}>AI</span>
            </div>
          </div>
        </div>
        <div className="nav-right">
          <button
            onClick={() => navigate('/auth')}
            className="signup-button"
            style={{ backgroundColor: primaryColor }}
          >
            Sign up
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <h1 className="hero-title">
          Empower Learning Through Conversation
        </h1>
        <p className="hero-description">
          Join a community of learners and instructors. Post questions, share insights,
          and get answers in real time on the Learnato platform.
        </p>
        
        <div className="features-container">
          <FeatureCard />
        </div>
      </div>
    </main>
  );
};

export default LandingPage;