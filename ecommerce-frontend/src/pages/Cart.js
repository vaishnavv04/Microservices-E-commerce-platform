import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, removeItem } = useContext(CartContext);

  return (
    <div>
      <h1>Cart</h1>
      {cart.map((item) => (
        <CartItem key={item.id} item={item} onRemove={removeItem} />
      ))}
      <Link to="/checkout">Checkout</Link>
    </div>
  );
};

export default Cart;