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

        {/* Main description */}
    <section className="animate-fade-in flex flex-col lg:flex-row items-center justify-between py-16 px-8 max-w-6xl mx-auto gap-8">
      <div className="flex-1 max-w-xl text-center lg:text-left">
        {/* TODO: Replace this heading with your brand's tagline */}
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-slate-800 dark:text-slate-100">
          The Future of <span className="gradient-text">Microservices</span> Shopping
        </h1>
        {/* TODO: Update this description to match your store's value proposition */}
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-10">
          Experience a scalable, secure, and lightning-fast e-commerce platform built on modern architecture.
        </p>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <Link 
            to="/products" 
            className="btn-primary btn-lg"
          >
            Browse Products
          </Link>
          {!localStorage.getItem('token') && (
            <Link 
              to="/register" 
              className="btn-outline btn-lg"
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
        
        <div className="w-96 h-96 bg-gradient-to-br from-primary to-accent opacity-15 animate-blob blur-3xl" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}>
        </div>
      </div>
    </section>

    {/* =======================================================================
        FEATURES SECTION
        TODO: Update these feature cards to highlight your store's benefits
        ======================================================================= */}
        {/* Features Section */}
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto my-16 px-8">
      {/* TODO: Customize each feature card with your unique selling points */}
      <div className="card text-center p-8">
        <div className="text-4xl mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary-light/15 dark:to-accent-light/15">
          🚀
        </div>
        <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
        <p className="text-slate-500 dark:text-slate-400">Optimized performance ensuring a smooth shopping experience.</p>
      </div>
      <div className="card text-center p-8">
        <div className="text-4xl mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary-light/15 dark:to-accent-light/15">
          🛡️
        </div>
        <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
        <p className="text-slate-500 dark:text-slate-400">Integrated with secure payment gateways for your peace of mind.</p>
      </div>
      <div className="card text-center p-8">
        <div className="text-4xl mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary-light/15 dark:to-accent-light/15">
          📦
        </div>
        <h3 className="text-xl font-bold mb-2">Smart Tracking</h3>
        <p className="text-slate-500 dark:text-slate-400">Real-time order tracking and management dashboard.</p>
      </div>
    </section>

    {/* Stats / Metrics Section */}
<section className="py-10 bg-background-light dark:bg-slate-900 animate-fade-in">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Card 1: Services */}
      <div className="card group">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            6+
          </span>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Microservices
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Independently Scalable
          </p>
        </div>
      </div>

      {/* Card 2: Docker */}
      <div className="card group">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            100%
          </span>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Dockerized
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Container Orchestration
          </p>
        </div>
      </div>

      {/* Card 3: API Architecture */}
      <div className="card group">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            REST
          </span>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            API Standard
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Secure Data Flow
          </p>
        </div>
      </div>

      {/* Card 4: Real-time */}
      <div className="card group">
        <div className="flex flex-col items-center text-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Live
          </span>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Real-time Tracking
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Instant Updates
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

{/* Microservices Architecture Section */}
<section className="py-20 bg-background-light dark:bg-slate-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        Microservices Architecture
      </h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Distributed system design with independent, scalable services communicating through a central API Gateway
      </p>
    </div>
    
    {/* Diagram Container - we'll build this next */}
    <div className="relative">
      {/* Diagram Container */}
<div className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center">
  {/* Diagram Container */}
<div className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center">
  
  {/* SVG for connecting lines */}
  <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
    {/* Line from center to User Service (top) */}
    <line 
      x1="50%" 
      y1="50%" 
      x2="50%" 
      y2="14%" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="10"
      
      className="text-slate-300 dark:text-slate-700 animate-dash"
    />
    
    {/* Line from center to Product Catalog (top-right) */}
    <line 
      x1="50%" 
      y1="50%" 
      x2="82%" 
      y2="22%" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="10"
      className="text-slate-300 dark:text-slate-700 animate-dash"
    />
    
    {/* Line from center to Shopping Cart (bottom-right) */}
    <line 
      x1="50%" 
      y1="50%" 
      x2="82%" 
      y2="78%" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="10"
      className="text-slate-300 dark:text-slate-700 animate-dash"
    />
    
    {/* Line from center to Order Service (bottom) */}
    <line 
      x1="50%" 
      y1="50%" 
      x2="50%" 
      y2="86%" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="10"
      className="text-slate-300 animate-dash dark:text-slate-700"
    />
    
    {/* Line from center to Payment Service (bottom-left) */}
    <line 
      x1="50%" 
      y1="50%" 
      x2="18%" 
      y2="78%" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="10"
      className="text-slate-300 dark:text-slate-700 animate-dash"
    />
    
    {/* Line from center to Notification Service (top-left) */}
    <line 
      x1="50%" 
      y1="50%" 
      x2="18%" 
      y2="22%" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="10"
      className="text-slate-300 dark:text-slate-700 animate-dash"
    />
  </svg>

  {/* Central API Gateway */}
  <div className="absolute z-20 ...">
    {/* your existing API Gateway code */}
  </div>
  
  {/* rest of your microservices... */}
</div>
  {/* Central API Gateway */}
  <div className="absolute z-20 bg-gradient-to-br from-primary to-purple-600 rounded-full w-32 h-32 md:w-40 md:h-40 flex flex-col items-center justify-center shadow-2xl border-4 border-white dark:border-slate-900 hover:scale-110 transition-transform duration-300 cursor-pointer">
    <span className="text-4xl mb-2">🌐</span>
    <span className="text-white font-bold text-sm md:text-base text-center px-2">API Gateway</span>
  </div>

  {/* Microservice 1: User Service (Top) */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:scale-105 transition-all duration-300 cursor-pointer group z-10">
    <span className="text-3xl mb-1">👤</span>
    <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-white text-center">User Service</span>
  </div>

  {/* Microservice 2: Product Catalog (Top Right) */}
  <div className="absolute top-[15%] right-[10%] bg-white dark:bg-slate-800 rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:scale-105 transition-all duration-300 cursor-pointer group z-10">
    <span className="text-3xl mb-1">📦</span>
    <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-white text-center">Product Catalog</span>
  </div>

  {/* Microservice 3: Shopping Cart (Bottom Right) */}
  <div className="absolute bottom-[15%] right-[10%] bg-white dark:bg-slate-800 rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:scale-105 transition-all duration-300 cursor-pointer group z-10">
    <span className="text-3xl mb-1">🛒</span>
    <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-white text-center">Shopping Cart</span>
  </div>

  {/* Microservice 4: Order Service (Bottom) */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-pink-500 hover:scale-105 transition-all duration-300 cursor-pointer group z-10">
    <span className="text-3xl mb-1">📋</span>
    <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-white text-center">Order Service</span>
  </div>

  {/* Microservice 5: Payment Service (Bottom Left) */}
  <div className="absolute bottom-[15%] left-[10%] bg-white dark:bg-slate-800 rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 hover:scale-105 transition-all duration-300 cursor-pointer group z-10">
    <span className="text-3xl mb-1">💳</span>
    <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-white text-center">Payment Service</span>
  </div>

  {/* Microservice 6: Notification Service (Top Left) */}
  <div className="absolute top-[15%] left-[10%] bg-white dark:bg-slate-800 rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-lg border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:scale-105 transition-all duration-300 cursor-pointer group z-10">
    <span className="text-3xl mb-1">🔔</span>
    <span className="font-semibold text-xs md:text-sm text-slate-800 dark:text-white text-center">Notification Service</span>
  </div>

</div>
    </div>
  </div>
</section>

{/* Tech Stack Section */}
<section className="py-20 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
    
    {/* Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        Built With Modern Technologies
      </h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        A comprehensive tech stack demonstrating full-stack development expertise
      </p>
    </div>

    {/* Tech Categories */}
    <div className="space-y-8 flex flex-col items-center justify-center">
      
      {/* Frontend Technologies */}
      <div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center md:text-left">
          Frontend
        </h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-blue-200 dark:border-blue-900 font-medium hover:border-blue-500 hover:shadow-md transition-all duration-300">
            ⚛️ React
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-cyan-200 dark:border-cyan-900 font-medium hover:border-cyan-500 hover:shadow-md transition-all duration-300">
            🎨 Tailwind CSS
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-purple-200 dark:border-purple-900 font-medium hover:border-purple-500 hover:shadow-md transition-all duration-300">
            🔀 React Router
          </span>
        </div>
      </div>

      {/* Backend Technologies */}
      <div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center md:text-left">
          Backend
        </h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-green-200 dark:border-green-900 font-medium hover:border-green-500 hover:shadow-md transition-all duration-300">
            🟢 Node.js
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-gray-200 dark:border-gray-700 font-medium hover:border-gray-500 hover:shadow-md transition-all duration-300">
            ⚡ Express.js
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-yellow-200 dark:border-yellow-900 font-medium hover:border-yellow-500 hover:shadow-md transition-all duration-300">
            🔐 JWT Auth
          </span>
        </div>
      </div>

      {/* Database */}
      <div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center md:text-left">
          Database
        </h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-green-200 dark:border-green-900 font-medium hover:border-green-500 hover:shadow-md transition-all duration-300">
            🍃 MongoDB
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-orange-200 dark:border-orange-900 font-medium hover:border-orange-500 hover:shadow-md transition-all duration-300">
            🔗 Mongoose
          </span>
        </div>
      </div>

      {/* DevOps & Tools */}
      <div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center md:text-left">
          DevOps & Architecture
        </h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-blue-200 dark:border-blue-900 font-medium hover:border-blue-500 hover:shadow-md transition-all duration-300">
            🐳 Docker
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-indigo-200 dark:border-indigo-900 font-medium hover:border-indigo-500 hover:shadow-md transition-all duration-300">
            📦 Docker Compose
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-purple-200 dark:border-purple-900 font-medium hover:border-purple-500 hover:shadow-md transition-all duration-300">
            🔄 Microservices
          </span>
          <span className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border-2 border-pink-200 dark:border-pink-900 font-medium hover:border-pink-500 hover:shadow-md transition-all duration-300">
            🌐 REST APIs
          </span>
        </div>
      </div>

    </div>
  </div>
</section>


{/* Team Credits Section */}
<section className="py-20 bg-white dark:bg-slate-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        Built with Love ❤️
      </h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
        A collaborative project showcasing microservices architecture, full-stack development, 
        and modern DevOps practices. Built as a learning initiative and portfolio piece.
      </p>
    </div>

    {/* Team Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      
      {/* Team Member 1 */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 text-center border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-lg transition-all duration-300">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
          T1
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          M KAUSHIK CHANDRA
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
          Full-Stack Developer
        </p>
        <div className="flex justify-center gap-3">
          <a href="https://github.com/kaushik87599" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/kaushik-m-470b46256/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Team Member 2 */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 text-center border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-lg transition-all duration-300">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
          T2
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          VAISHNAV EEGA
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
          Full-Stack Developer
        </p>
        <div className="flex justify-center gap-3">
          <a href="https://github.com/vaishnavv04" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/vaishnav-eega/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>


    </div>

    {/* Optional: Add more team members by duplicating the card structure */}

  </div>
</section>


{/* Footer Section */}
<footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-16 pb-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      
      {/* About Project Column */}
      <div className="lg:col-span-2">
        <h3 className="text-white text-2xl font-bold mb-4">ShopMicro</h3>
        <p className="text-slate-400 mb-4 leading-relaxed">
          A microservices-based e-commerce platform built as an educational project. 
          Demonstrating scalable architecture, containerization with Docker, and modern 
          full-stack development practices.
        </p>
        <div className="flex gap-4">
          {/* GitHub Link */}
          <a 
            href="https://github.com/vaishnavv04/Microservices-E-commerce-platform" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">View Code</span>
          </a>
          
          {/* Documentation Link */}
          <a 
            href="/docs" 
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">Docs</span>
          </a>
        </div>
      </div>

      {/* Quick Links Column */}
      <div>
        <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="hover:text-primary transition-colors duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-primary transition-colors duration-300">
              Products
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-primary transition-colors duration-300">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-primary transition-colors duration-300">
              Register
            </Link>
          </li>
        </ul>
      </div>

      {/* Microservices Column */}
      <div>
        <h4 className="text-white font-semibold text-lg mb-4">Services</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>User Service</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Product Catalog</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Shopping Cart</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Order Service</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Payment Service</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Notification Service</span>
          </li>
        </ul>
      </div>

    </div>

    {/* Divider */}
    <div className="border-t border-slate-800 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Copyright */}
        <p className="text-slate-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} ShopMicro. Built for educational purposes as a student-team project.
        </p>

        {/* Tech Stack Badge */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Powered by</span>
          <span className="text-primary font-semibold">React</span>
          <span>•</span>
          <span className="text-primary font-semibold">Docker</span>
          <span>•</span>
          <span className="text-primary font-semibold">Node.js</span>
        </div>

      </div>
    </div>

  </div>
</footer>
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