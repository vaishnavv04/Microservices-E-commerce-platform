import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const location = useLocation();

  // Helper to check active route
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="animate-fade-in">
      <div className="logo-container">
        <h1>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            ShopMicro
          </Link>
        </h1>
      </div>

      <nav>
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/products" className={isActive('/products')}>Products</Link>
        
        {user ? (
          <>
            <Link to="/cart" className={`cart-link ${isActive('/cart')}`}>
              Cart 
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>
            <Link to="/orders" className={isActive('/orders')}>Orders</Link>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className={`btn-text ${isActive('/login')}`}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', color: 'white' }}>Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;