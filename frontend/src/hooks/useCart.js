import { useContext } from 'react';
import { CartContext } from '../context/CartContext';  // Fixed: CartContext, not AuthContext

export const useCart = () => {
  const context = useContext(CartContext);  // Fixed: CartContext, not AuthContext
  
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  
  return context;
};
