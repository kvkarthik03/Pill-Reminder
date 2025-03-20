import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to Pill Reminder</h1>
        <p className="hero-subtitle">Your personal medication management assistant</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3 className="feature-title">Smart Reminders</h3>
            <p className="feature-description">
              Never miss a dose with our intelligent reminder system
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Assistant</h3>
            <p className="feature-description">
              Get instant answers about your medications from our AI
            </p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to take control of your medication routine?</h2>
          <div className="auth-buttons">
            <Link to="/login">
              <button className="auth-button login-btn">Login</button>
            </Link>
            <Link to="/signup">
              <button className="auth-button signup-btn">Sign Up</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
