import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItemId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart/add', { menuItemId, quantity });
      setCart(data);
      return { success: true };
    } catch (error) {
      if (error.response?.data?.requiresConfirmation) {
         return { success: false, requiresConfirmation: true, message: error.response.data.message };
      }
      return { success: false, message: error.response?.data?.message || 'Error adding item' };
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    try {
      const { data } = await api.put('/cart/update', { menuItemId, quantity });
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (menuItemId) => {
      try {
          const { data } = await api.delete(`/cart/remove/${menuItemId}`);
          setCart(data);
      } catch (error) {
          console.error(error);
      }
  }

  const clearCart = async () => {
    try {
      const { data } = await api.delete('/cart/clear');
      setCart(data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
