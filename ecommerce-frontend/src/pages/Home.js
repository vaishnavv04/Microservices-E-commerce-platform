import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home Page Component
 * 
 * TODO: Customize this page to match your brand:
 * - Update hero text and call-to-action
 * - Add promotional banners
 * - Add featured products section
 * - Add newsletter signup
 * - Add testimonials/reviews section
 */
const Home = () => (
  <div className="home-page">
    {/* =======================================================================
        HERO SECTION
        TODO: Customize the hero content, add background image, or video
        ======================================================================= */}
    <section className="animate-fade-in flex flex-col lg:flex-row items-center justify-between py-16 px-8 max-w-6xl mx-auto gap-8">
      <div className="flex-1 max-w-xl text-center lg:text-left">
        {/* TODO: Replace this heading with your brand's tagline */}
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-slate-800 dark:text-slate-100">
          The Future of <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Microservices</span> Shopping
        </h1>
        {/* TODO: Update this description to match your store's value proposition */}
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10">
          Experience a scalable, secure, and lightning-fast e-commerce platform built on modern architecture.
        </p>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <Link 
            to="/products" 
            className="px-8 py-4 text-lg rounded-lg font-semibold text-white bg-gradient-to-br from-primary to-purple-500 hover:from-primary-hover hover:to-purple-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Browse Products
          </Link>
          {!localStorage.getItem('token') && (
            <Link 
              to="/register" 
              className="px-8 py-4 text-lg rounded-lg font-semibold bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary/5"
            >
              Join Now
            </Link>
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center relative">
        {/* 
          TODO: Replace this abstract shape with:
          - Your product hero image
          - An illustration (e.g., from unDraw)
          - A video or animated component
          
          Example:
          <img src="/hero-image.png" alt="Featured Products" />
        */}
        <div className="w-96 h-96 bg-gradient-to-br from-primary to-accent opacity-15 animate-blob blur-3xl" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
      </div>
    </section>

    {/* =======================================================================
        FEATURES SECTION
        TODO: Update these feature cards to highlight your store's benefits
        ======================================================================= */}
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto my-16 px-8">
      {/* TODO: Customize each feature card with your unique selling points */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 text-center hover:-translate-y-1.5 hover:border-primary hover:shadow-lg">
        <div className="text-4xl mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary-light/15 dark:to-accent-light/15">
          🚀
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Lightning Fast</h3>
        <p className="text-slate-500 dark:text-slate-400">Optimized performance ensuring a smooth shopping experience.</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 text-center hover:-translate-y-1.5 hover:border-primary hover:shadow-lg">
        <div className="text-4xl mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary-light/15 dark:to-accent-light/15">
          🛡️
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Secure Payments</h3>
        <p className="text-slate-500 dark:text-slate-400">Integrated with secure payment gateways for your peace of mind.</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 text-center hover:-translate-y-1.5 hover:border-primary hover:shadow-lg">
        <div className="text-4xl mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary-light/15 dark:to-accent-light/15">
          📦
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Smart Tracking</h3>
        <p className="text-slate-500 dark:text-slate-400">Real-time order tracking and management dashboard.</p>
      </div>
    </section>

    {/* =======================================================================
        TODO: Add additional sections below:
        
        1. FEATURED PRODUCTS SECTION
           <section className="featured-products">
             <h2>Featured Products</h2>
             {/* Fetch and display top products here *\/}
           </section>
        
        2. PROMOTIONAL BANNER
           <section className="promo-banner">
             <h2>Summer Sale - Up to 50% Off!</h2>
             <Link to="/products?sale=true">Shop Now</Link>
           </section>
        
        3. NEWSLETTER SIGNUP
           <section className="newsletter">
             <h2>Stay Updated</h2>
             <form onSubmit={handleNewsletterSignup}>
               <input type="email" placeholder="Enter your email" />
               <button type="submit">Subscribe</button>
             </form>
           </section>
        
        4. TESTIMONIALS
           <section className="testimonials">
             <h2>What Our Customers Say</h2>
             {/* Add customer review cards *\/}
           </section>
        ======================================================================= */}

    {/* =======================================================================
        TODO: Add Footer Component
        Create a Footer.js component with:
        - Store info and address
        - Quick links (About, Contact, FAQ)
        - Social media links
        - Copyright notice
        ======================================================================= */}
  </div>
);

export default Home;