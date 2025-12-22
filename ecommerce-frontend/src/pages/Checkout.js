import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, createPaymentIntent, confirmPayment } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const fullAddress = `${address}, ${city}, ${zip}`;

    try {
      // 1. Create Order
      const orderRes = await createOrder({ 
        userId: user.id, 
        shippingAddress: fullAddress 
      });
      const orderId = orderRes.data.id;

      // 2. Create Payment Intent
      await createPaymentIntent({ 
        amount: total, 
        orderId, 
        userId: user.id 
      });

      // 3. Confirm Payment (Mocked for now)
      await confirmPayment({ orderId }); 

      // 4. Cleanup
      await clearCart(user.id);
      
      // 5. Redirect
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Secure Checkout</h1>

      <div className="checkout-layout">
        {/* Left Column: Forms */}
        <div className="checkout-forms animate-slide-in">
          
          <form onSubmit={handleCheckout} id="checkout-form" style={{ maxWidth: '100%', margin: 0, padding: 0, boxShadow: 'none', border: 'none', background: 'transparent' }}>
            
            {/* Section 1: Shipping */}
            <div className="form-section">
              <div className="section-header">
                <span className="step-number">1</span>
                <h3>Shipping Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Address</label>
                  <input 
                    type="text" 
                    placeholder="123 Main St, Apt 4B" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    placeholder="New York" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    placeholder="10001" 
                    value={zip} 
                    onChange={(e) => setZip(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment (Visual Only) */}
            <div className="form-section">
              <div className="section-header">
                <span className="step-number">2</span>
                <h3>Payment Method</h3>
              </div>
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>💳</span> Credit Card
                </p>
                <input type="text" placeholder="Card Number (Mock)" disabled style={{ background: '#e2e8f0', cursor: 'not-allowed' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="MM/YY" disabled style={{ background: '#e2e8f0', cursor: 'not-allowed' }} />
                  <input type="text" placeholder="CVC" disabled style={{ background: '#e2e8f0', cursor: 'not-allowed' }} />
                </div>
                <small style={{ color: 'var(--text-secondary)' }}>* This is a demo. No real payment will be processed.</small>
              </div>
            </div>

            {error && <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: '2rem' }}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Preview */}
        <div className="order-preview-container">
          <div className="order-preview-card">
            <h3>Order Summary</h3>
            <div className="preview-items">
              {cart.map(item => (
                <div key={item.id} className="preview-item">
                  <div className="preview-info">
                    <span className="preview-name">{item.product.name}</span>
                    <span className="preview-qty">x {item.quantity}</span>
                  </div>
                  <span className="preview-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--border-color)' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;