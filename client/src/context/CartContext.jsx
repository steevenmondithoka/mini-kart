// context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const API = `${import.meta.env.VITE_API_BASE_URL}/cart`; // ← fixed

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  // ── Fetch cart from backend whenever user changes ────────────
  const fetchCart = useCallback(async () => {
    if (!user?.token) {
      setCartItems([]); // clear cart when logged out
      return;
    }
    setCartLoading(true);
    try {
      const { data } = await axios.get(API, authHeaders(user.token));
      setCartItems(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ── Add to cart ──────────────────────────────────────────────
  const addToCart = async (product, qty = 1) => {
    if (!user?.token) return;
    try {
      const { data } = await axios.post(
        API,
        {
          productId: product._id,
          name:      product.name,
          image:     product.image,
          price:     product.price,
          qty,
        },
        authHeaders(user.token)
      );
      setCartItems(data);
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  // ── Update quantity ──────────────────────────────────────────
  const updateQty = async (productId, qty) => {
    if (!user?.token) return;
    try {
      const { data } = await axios.put(
        `${API}/${productId}`,
        { qty },
        authHeaders(user.token)
      );
      setCartItems(data);
    } catch (err) {
      console.error('Update qty failed:', err);
    }
  };

  // ── Remove item ──────────────────────────────────────────────
  const removeFromCart = async (productId) => {
    if (!user?.token) return;
    try {
      const { data } = await axios.delete(
        `${API}/${productId}`,
        authHeaders(user.token)
      );
      setCartItems(data);
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
  };

  // ── Clear cart (call this after order is placed) ─────────────
  const clearCart = async () => {
    if (!user?.token) return;
    try {
      await axios.delete(`${API}/clear`, authHeaders(user.token));
      setCartItems([]);
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
  };

  // ── Derived values ───────────────────────────────────────────
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartLoading,
      cartCount,
      cartTotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);