import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, createPaymentIntent, confirmPayment } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const orderRes = await createOrder({ userId: user.id, shippingAddress: address });
      const orderId = orderRes.data.id;
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      await createPaymentIntent({ amount: total, orderId, userId: user.id });
      await confirmPayment({ orderId }); // Assume success
      clearCart(user.id);
      navigate('/orders');
    } catch (err) {
      alert('Checkout failed');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <input type="text" placeholder="Shipping Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};

export default Checkout;