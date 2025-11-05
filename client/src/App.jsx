import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import FeatureCard from './components/FeatureCard';
import Loader from './components/Loader';
import Auth from './components/auth';
import Dashboard from './components/Dashboard';
import { Book } from 'lucide-react';
import './App.css';

// Constants
const primaryColor = "rgba(255, 140, 90, 1)";
const backgroundColor = "rgba(18, 87, 116, 1)";

// MainContent component with navigation
const MainContent = () => {
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
          Your AI Study Assistant
        </h1>
        <p className="hero-description">
          Transform your study routine with personalized learning schedules, smart analysis, and integrated calendar management
        </p>
        
        <div className="features-container">
          <FeatureCard />
        </div>
      </div>
    </main>
  );
};

// Main App component with routing
const App = () => {
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;