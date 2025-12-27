import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="hacking-bg"></div>
      <div className="matrix-bg"></div>
      
      {/* Main Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-8">
              <div className="hero-content">
                <h1 className="cyber-title">
                  <span className="glitch" data-text="CyberShield">CyberShield</span>
                  <span className="subtitle">Intrusion Detection System</span>
                </h1>
                
                <p className="hero-description">
                  Advanced AI-powered network security platform that detects, analyzes, 
                  and neutralizes cyber threats in real-time. Protect your network with 
                  cutting-edge machine learning algorithms.
                </p>
                
                <div className="hero-buttons mt-4">
                  <Link to="/dashboard" className="btn btn-cyber btn-lg me-3">
                    <i className="bi bi-shield-lock"></i> Launch Dashboard
                  </Link>
                  <Link to="/about" className="btn btn-outline-cyber btn-lg">
                    <i className="bi bi-info-circle"></i> Learn More
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="hero-stats">
                <div className="stat-card cyber-pulse">
                  <h3>99.9%</h3>
                  <p>Detection Accuracy</p>
                </div>
                <div className="stat-card cyber-pulse">
                  <h3>24/7</h3>
                  <p>Real-time Monitoring</p>
                </div>
                <div className="stat-card cyber-pulse">
                  <h3>0.2s</h3>
                  <p>Response Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">
            <span className="highlight">Advanced Features</span>
          </h2>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-cpu"></i>
                </div>
                <h4>AI Threat Detection</h4>
                <p>Machine learning algorithms analyze network patterns to identify anomalies and potential threats.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <h4>Real-time Monitoring</h4>
                <p>Live traffic analysis with instant alerts for suspicious activities and potential attacks.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-graph-up"></i>
                </div>
                <h4>Detailed Analytics</h4>
                <p>Comprehensive reports and visualizations to understand your network security posture.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Secure Your Network?</h2>
          <p className="mb-4">Join thousands of organizations protecting their digital assets with CyberShield IDS.</p>
          <Link to="/dashboard" className="btn btn-cyber btn-lg">
            <i className="bi bi-shield-check"></i> Start Monitoring Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>CyberShield IDS</h5>
              <p>Advanced Network Intrusion Detection System</p>
            </div>
            <div className="col-md-6 text-end">
              <div className="footer-links">
                <Link to="/about">About</Link>
                <Link to="/docs">Documentation</Link>
                <Link to="/dashboard">Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;