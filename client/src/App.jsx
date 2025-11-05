import { useState, useEffect } from 'react';
import FeatureCard from './components/FeatureCard';
import Loader from './components/Loader';
import { Book } from 'lucide-react';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error('Page initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializePage();
  }, []);

  const handleSignupClick = () => {
    // Navigate to auth page or implement your routing
    window.location.href = '/auth';
  };

  const primaryColor = "rgba(255, 140, 90, 1)";
  const backgroundColor = "rgba(18, 87, 116, 1)";

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main
      className="landing-main"
      style={{ background: backgroundColor }}
    >
      {/* Background image with overlay */}
      <div className="background-overlay">
        <img
          src="/assets/bgimg.jpg"
          alt="Background"
          className="background-image"
        />
        <div className="background-blend" />
      </div>

      {/* Navigation */}
      <nav className="navigation">
        <div
          className="nav-left"
          style={{ background: primaryColor }}
        >
          <div className="logo-container">
            <Book className="logo-icon" />
            <div className="logo-text">
              <span className="logo-study">Study</span>
              <span className="logo-gpt" style={{ color: backgroundColor }}>GPT</span>
            </div>
          </div>
        </div>
        <div className="nav-right">
          <button
            onClick={handleSignupClick}
            className="signup-button"
            style={{ backgroundColor: primaryColor }}
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Your AI Study Assistant
        </h1>
        <p className="hero-description">
          Transform your study routine with personalized learning schedules, smart analysis, and integrated calendar management
        </p>
        
        {/* Feature Cards Component */}
        <div className="features-container">
          <FeatureCard />
        </div>
      </div>

      {/* Robot Image */}
      <div className="robot-container">
        <img
          src="/assets/robot.png"
          alt="AI Robot"
          className="robot-image"
        />
      </div>
    </main>
  );
}

export default App;