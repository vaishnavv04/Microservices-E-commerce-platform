import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onRemove, onUpdate }) => {
  const { product, quantity } = item;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] items-center gap-4 p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 last:border-b-0 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50">
      {/* Product Image & Details Grouped for Grid Alignment */}
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 flex-shrink-0">
          <img 
            src={product.image_url || 'https://via.placeholder.com/150'} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg border border-slate-200 dark:border-slate-600"
          />
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold m-0 text-slate-800 dark:text-slate-100">
            <Link to={`/products/${product.id}`} className="hover:text-primary hover:underline transition-colors">
              {product.name}
            </Link>
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-center gap-2">
        <button 
          onClick={() => onUpdate(item.id, { quantity: quantity - 1 })}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex items-center justify-center p-0 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-300"
        >
          -
        </button>
        <span className="font-semibold min-w-8 text-center text-slate-800 dark:text-slate-100">
          {quantity}
        </span>
        <button 
          onClick={() => onUpdate(item.id, { quantity: quantity + 1 })}
          className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex items-center justify-center p-0 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
        >
          +
        </button>
      </div>

      {/* Subtotal & Actions */}
      <div className="text-right font-bold flex flex-col items-end gap-2 md:flex-col max-md:flex-row max-md:items-center max-md:justify-between max-md:w-full max-md:border-t max-md:border-slate-100 max-md:pt-4">
        <p className="text-lg text-slate-800 dark:text-slate-100 m-0">
          ${(Number(product.price) * quantity).toFixed(2)}
        </p>
        <button 
          className="bg-transparent text-red-500 text-2xl leading-none px-2 border-none cursor-pointer transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" 
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default CartItem;