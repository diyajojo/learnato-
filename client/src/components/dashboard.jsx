import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!storedUser || !accessToken) {
      navigate('/auth');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Redirect to home
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(18, 87, 116, 1)'
      }}>
        <p style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'rgba(18, 87, 116, 1)',
      color: 'white'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 3rem',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Book style={{ height: '2rem', width: '2rem' }} />
          <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>
            <span>Learnato</span>
            <span style={{ color: '#FF8C5A' }}>AI</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 2rem',
            background: '#FF8C5A',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 160, 110, 1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#FF8C5A';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, white 0%, #FF8C5A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Hello, World!
          </h1>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'rgba(255, 255, 255, 0.95)'
          }}>
            Welcome, {user.fullName}! 🎉
          </h2>

          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            You've successfully logged into your LearnatoAI dashboard. 
            Your email: <strong>{user.email}</strong>
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Study Materials</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Access your learning resources
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Assistant</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Get personalized help
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Schedule</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Manage your study time
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;