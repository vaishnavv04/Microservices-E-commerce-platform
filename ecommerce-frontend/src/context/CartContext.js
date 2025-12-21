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
  removeCartItem
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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateItem, removeItem, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
