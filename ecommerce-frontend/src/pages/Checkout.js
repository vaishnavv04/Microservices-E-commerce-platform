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
    <div className="max-w-6xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
        {/* Left Column: Forms */}
        <div className="animate-slide-in">
          
          <form onSubmit={handleCheckout} id="checkout-form">
            
            {/* Section 1: Shipping */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Shipping Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-semibold text-sm text-slate-500 dark:text-slate-400">Full Address</label>
                  <input 
                    type="text" 
                    placeholder="123 Main St, Apt 4B" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-50 dark:bg-slate-700 transition-all duration-200 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm text-slate-500 dark:text-slate-400">City</label>
                  <input 
                    type="text" 
                    placeholder="New York" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-50 dark:bg-slate-700 transition-all duration-200 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm text-slate-500 dark:text-slate-400">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    placeholder="10001" 
                    value={zip} 
                    onChange={(e) => setZip(e.target.value)} 
                    required 
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-50 dark:bg-slate-700 transition-all duration-200 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment (Visual Only) */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Payment Method</h3>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <p className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300">
                  <span className="text-xl">💳</span> Credit Card
                </p>
                <input 
                  type="text" 
                  placeholder="Card Number (Mock)" 
                  disabled 
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg mb-4 text-base bg-slate-200 dark:bg-slate-600 cursor-not-allowed text-slate-500 dark:text-slate-400"
                />
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    disabled 
                    className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-200 dark:bg-slate-600 cursor-not-allowed text-slate-500 dark:text-slate-400"
                  />
                  <input 
                    type="text" 
                    placeholder="CVC" 
                    disabled 
                    className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-200 dark:bg-slate-600 cursor-not-allowed text-slate-500 dark:text-slate-400"
                  />
                </div>
                <small className="text-slate-500 dark:text-slate-400 mt-4 block">* This is a demo. No real payment will be processed.</small>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full mt-8 px-8 py-4 text-lg rounded-lg font-semibold text-white bg-gradient-to-br from-primary to-purple-500 hover:from-primary-hover hover:to-purple-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Preview */}
        <div>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Order Summary</h3>
            <div className="max-h-72 overflow-y-auto mb-6 pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start mb-4 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.product.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">x {item.quantity}</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
            
            <div className="flex justify-between mb-3 text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-slate-500 dark:text-slate-400">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-800 dark:text-slate-100 mt-4 pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-600">
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