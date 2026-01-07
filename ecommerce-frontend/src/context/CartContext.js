import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';
import { AuthContext } from './AuthContext';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi
} from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchCart = useCallback(async () => {
    if (!user) return;

    try {
      const res = await getCart(user.id);
      setCart(res.data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }, [user]);

  const addItem = async (item) => {
    await addToCart(item);
    fetchCart();
  };

  const updateItem = async (itemId, data) => {
    await updateCartItem(itemId, data);
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await removeCartItem(itemId);
    fetchCart();
  };

  const clearCart = async (userId) => {
    try {
      await clearCartApi(userId);
    } catch (err) {
      // Cart may not exist or already be empty - that's okay
      console.log('Cart clear response:', err.message);
    }
    setCart([]);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateItem, removeItem, fetchCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
