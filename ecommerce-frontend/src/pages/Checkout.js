import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, createPaymentOrder, verifyPayment } from '../services/api';
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

  // Format currency in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleRazorpayPayment = async (orderId, razorpayOrderId, razorpayKeyId) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: razorpayKeyId,
        amount: Math.round(total * 100), // in paise
        currency: 'INR',
        name: 'E-Commerce Platform',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: function (response) {
          resolve({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#6366f1', // primary color
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      // Check if Razorpay is loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          reject(new Error(response.error.description || 'Payment failed'));
        });
        rzp.open();
      } else {
        // Mock mode - simulate successful payment
        console.warn('⚠️ Razorpay not loaded - using mock payment');
        setTimeout(() => {
          resolve({
            orderId: razorpayOrderId,
            paymentId: 'pay_mock_' + Date.now(),
            signature: 'mock_signature_' + Date.now(),
          });
        }, 1000);
      }
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const fullAddress = `${address}, ${city}, ${zip}`;

    try {
      // 1. Create Order in our system
      const orderRes = await createOrder({ 
        userId: user.id, 
        shippingAddress: fullAddress 
      });
      const orderId = orderRes.data.id;

      // 2. Create Razorpay Payment Order
      const paymentRes = await createPaymentOrder({ 
        amount: total, 
        currency: 'INR',
        orderId, 
        userId: user.id 
      });

      const { orderId: razorpayOrderId, keyId: razorpayKeyId, mock } = paymentRes.data;

      // 3. Handle payment based on mode
      let paymentData;
      
      if (mock) {
        // Mock mode - simulate payment immediately
        console.log('🔧 Running in mock mode - simulating payment');
        paymentData = {
          orderId: razorpayOrderId,
          paymentId: 'pay_mock_' + Date.now(),
          signature: 'mock_signature',
        };
      } else {
        // Real mode - open Razorpay checkout
        paymentData = await handleRazorpayPayment(orderId, razorpayOrderId, razorpayKeyId);
      }

      // 4. Verify Payment
      await verifyPayment(paymentData);

      // 5. Show success confirmation
      alert('🎉 Payment Successful!\n\nYour order has been placed successfully.\nYou will be redirected to your orders page.');

      // 6. Cleanup
      await clearCart(user.id);
      
      // 7. Redirect to orders
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment failed. Please try again.');
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
                    placeholder="Mumbai" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-50 dark:bg-slate-700 transition-all duration-200 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm text-slate-500 dark:text-slate-400">PIN Code</label>
                  <input 
                    type="text" 
                    placeholder="400001" 
                    value={zip} 
                    onChange={(e) => setZip(e.target.value)} 
                    required 
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-base bg-slate-50 dark:bg-slate-700 transition-all duration-200 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Payment Method</h3>
              </div>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-lg border border-indigo-100 dark:border-slate-500">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://razorpay.com/favicon.png" 
                    alt="Razorpay" 
                    className="w-6 h-6"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Razorpay Secure Checkout</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Pay securely using UPI, Credit/Debit Cards, Net Banking, or Wallets.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white dark:bg-slate-500 rounded-full text-xs font-medium text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-400">💳 Cards</span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-500 rounded-full text-xs font-medium text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-400">📱 UPI</span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-500 rounded-full text-xs font-medium text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-400">🏦 Net Banking</span>
                  <span className="px-3 py-1 bg-white dark:bg-slate-500 rounded-full text-xs font-medium text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-400">👛 Wallets</span>
                </div>
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
              {isProcessing ? 'Processing...' : `Pay ${formatINR(total)}`}
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
                  <span className="text-slate-700 dark:text-slate-300">{formatINR(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
            
            <div className="flex justify-between mb-3 text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-3 text-slate-500 dark:text-slate-400">
              <span>Tax (GST 8%)</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-800 dark:text-slate-100 mt-4 pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-600">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;