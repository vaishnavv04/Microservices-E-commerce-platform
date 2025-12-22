import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="home-page">
    {/* Hero Section */}
    <section className="hero-section animate-fade-in">
      <div className="hero-content">
        <h1>
          The Future of <span className="gradient-text">Microservices</span> Shopping
        </h1>
        <p>
          Experience a scalable, secure, and lightning-fast e-commerce platform built on modern architecture.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
          {!localStorage.getItem('token') && (
            <Link to="/register" className="btn btn-outline btn-lg">
              Join Now
            </Link>
          )}
        </div>
      </div>
      <div className="hero-image">
        {/* Placeholder for a hero illustration */}
        <div className="hero-shape"></div>
      </div>
    </section>

    {/* Features Section */}
    <section className="features-section">
      <div className="feature-card">
        <div className="icon">🚀</div>
        <h3>Lightning Fast</h3>
        <p>Optimized performance ensuring a smooth shopping experience.</p>
      </div>
      <div className="feature-card">
        <div className="icon">🛡️</div>
        <h3>Secure Payments</h3>
        <p>Integrated with secure payment gateways for your peace of mind.</p>
      </div>
      <div className="feature-card">
        <div className="icon">📦</div>
        <h3>Smart Tracking</h3>
        <p>Real-time order tracking and management dashboard.</p>
      </div>
    </section>
  </div>
);

export default Home;