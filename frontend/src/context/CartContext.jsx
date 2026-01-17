import { createContext, useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/helpers';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = getLocalStorage('cart');
    if (storedCart && Array.isArray(storedCart)) {
      setCartItems(storedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    setLocalStorage('cart', cartItems);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, selectedSize = 'M') => {
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItemIndex !== -1) {
      // Item exists, increase quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // New item, add to cart
      const newItem = {
        ...product,
        selectedSize,
        quantity: 1,
        addedAt: new Date().toISOString()
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId, selectedSize) => {
    const updatedCart = cartItems.filter(
      item => !(item.id === productId && item.selectedSize === selectedSize)
    );
    setCartItems(updatedCart);
  };

  // Update item quantity
  const updateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    const updatedCart = cartItems.map(item => {
      if (item.id === productId && item.selectedSize === selectedSize) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId, selectedSize) => {
    return cartItems.some(item => item.id === productId && item.selectedSize === selectedSize);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
