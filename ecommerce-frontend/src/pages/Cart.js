import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, removeItem, updateItem } = useContext(CartContext);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.08; // Assuming 8% tax
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart ({cart.length} items)</h1>
      
      <div className="cart-layout">
        {/* Left Column: Cart Items */}
        <div className="cart-items-container">
          <div className="cart-header">
            <span>Product</span>
            <span style={{ textAlign: 'center' }}>Quantity</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </div>
          
          <div className="cart-list">
            {cart.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={removeItem}
                onUpdate={updateItem}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-block" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center' }}>
            Proceed to Checkout
          </Link>
          
          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            or Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;