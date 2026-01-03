import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { formatINR } from '../utils/currency';

const Cart = () => {
  const { cart, removeItem, updateItem } = useContext(CartContext);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.08; // Assuming 8% tax (GST)
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-24 text-center animate-fade-in">
        <div className="text-6xl mb-4 inline-block animate-float">🛒</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Your Cart is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link 
          to="/products" 
          className="btn-primary btn-lg inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Shopping Cart ({cart.length} items)
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
        {/* Left Column: Cart Items */}
        <div>
          {/* Cart Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] p-4 px-6 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-500 dark:text-slate-400 rounded-t-xl">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-b-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 border-t-0 md:border-t">
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
        <div className="card shadow-md sticky top-24">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            Order Summary
          </h3>
          
          <div className="flex justify-between mb-3 text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-4 text-slate-500 dark:text-slate-400">
            <span>Tax (GST 8%)</span>
            <span>{formatINR(tax)}</span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
          <div className="flex justify-between text-xl font-bold text-slate-800 dark:text-slate-100">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>

          <Link 
            to="/checkout" 
            className="btn-primary btn-lg btn-block mt-6"
          >
            Proceed to Checkout
          </Link>
          
          <Link 
            to="/products" 
            className="block text-center mt-4 text-sm text-slate-500 dark:text-slate-400 transition-colors hover:text-primary hover:underline"
          >
            or Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;