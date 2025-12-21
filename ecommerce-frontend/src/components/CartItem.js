import React from 'react';

const CartItem = ({ item, onRemove }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px' }}>
    <p>{item.product.name} - Quantity: {item.quantity}</p>
    <button onClick={() => onRemove(item.id)}>Remove</button>
  </div>
);

export default CartItem;