import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component - Main navigation bar
 * 
 * TODO: Customize this component:
 * - Replace "ShopMicro" text with your brand logo/image
 * - Add dropdown menus for categories
 * - Add search bar in header
 * - Add user profile dropdown when logged in
 */
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const location = useLocation();

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <header className="animate-fade-in bg-white/80 dark:bg-slate-800/85 backdrop-blur-xl px-[5%] py-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/30 dark:border-slate-700/50 shadow-sm transition-colors duration-300">
      <div className="logo-container">
        {/* 
          TODO: Replace this with your brand logo
          Example: <img src="/logo.png" alt="Your Store Name" height="40" />
        */}
        <h1 className="text-2xl font-extrabold gradient-text">
          <Link to="/" className=" no-underline gradient-text">
            ShopMicro
          </Link>
        </h1>
      </div>

      <nav className="flex gap-8 items-center">
        <Link 
          to="/" 
          className={`font-medium relative transition-colors duration-200 hover:text-primary ${isActive('/') ? 'text-primary font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          Home
        </Link>
        <Link 
          to="/products" 
          className={`font-medium relative transition-colors duration-200 hover:text-primary ${isActive('/products') ? 'text-primary font-bold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          Products
        </Link>
        
        {/* TODO: Add more navigation links here, e.g., Categories, Deals, About */}
        
        {user ? (
          <>
            <Link 
              to="/cart" 
              className={`flex items-center gap-2 font-medium transition-colors duration-200 hover:text-primary ${isActive('/cart') ? 'text-primary font-bold' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Cart 
              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link 
              to="/orders" 
              className={`font-medium transition-colors duration-200 hover:text-primary ${isActive('/orders') ? 'text-primary font-bold' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Orders
            </Link>
            {/* TODO: Add user profile dropdown here */}
            <button 
              onClick={logout} 
              className="bg-transparent border border-slate-300 dark:border-slate-600 px-5 py-2 rounded-lg text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-red-100 hover:text-red-500 hover:border-red-500 dark:hover:text-red-500 dark:hover:bg-red-100"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-4 items-center">
            <Link 
              to="/login" 
              className={`font-medium transition-colors duration-200 hover:text-primary ${isActive('/login') ? 'text-primary font-bold' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn-primary btn-sm"
            >
              Register
            </Link>
          </div>
        )}
        
        {/* Theme Toggle */}
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;