import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onRemove, onUpdate }) => {
  const { product, quantity } = item;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-image">
        <img 
          src={product.image_url || 'https://via.placeholder.com/150'} 
          alt={product.name} 
        />
      </div>

      {/* Product Details */}
      <div className="cart-item-details">
        <h4><Link to={`/products/${product.id}`}>{product.name}</Link></h4>
        <p className="unit-price">${Number(product.price).toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-quantity">
        <button 
          onClick={() => onUpdate(item.id, { quantity: quantity - 1 })}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button 
          onClick={() => onUpdate(item.id, { quantity: quantity + 1 })}
        >
          +
        </button>
      </div>

      {/* Subtotal & Actions */}
      <div className="cart-item-total">
        <p>${(Number(product.price) * quantity).toFixed(2)}</p>
        <button 
          className="remove-btn" 
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