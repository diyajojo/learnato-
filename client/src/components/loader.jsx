import React from 'react';
import { Book } from 'lucide-react';

const Loader = () => {
  return (
    <div 
      className="loader-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: "rgba(18, 87, 116, 1)",
        background: `radial-gradient(circle at center, 
          rgba(18, 87, 116, 1) 0%, 
          rgba(18, 87, 116, 0.95) 50%, 
          rgba(18, 87, 116, 0.9) 100%)`,
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Animated Logo */}
      <div 
        className="loader-logo"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'pulse 2s infinite'
        }}
      >
        <Book 
          style={{
            height: '48px',
            width: '48px',
            color: 'white'
          }}
          strokeWidth={1.5}
        />
        <div style={{
          fontSize: '2.25rem',
          fontWeight: 700
        }}>
          <span style={{ color: 'white' }}>Study</span>
          <span style={{ color: '#FF8C5A' }}>GPT</span>
        </div>
      </div>

      {/* Loader Spinner */}
      <div style={{ position: 'relative' }}>
        <div 
          className="loader-spinner"
          style={{
            width: '80px',
            height: '80px',
            border: '8px solid rgba(255, 140, 90, 0.3)',
            borderTopColor: '#FF8C5A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <div 
          className="loader-ping"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 140, 90, 0.3) 0%, transparent 70%)',
            zIndex: -1,
            animation: 'ping 2s infinite'
          }}
        />
      </div>

      {/* Loading Text */}
      <p 
        style={{
          marginTop: '2rem',
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.7)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          animation: 'fadeInOut 2s infinite'
        }}
      >
        Preparing Your Learning Journey
      </p>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Loader;