// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from '../utils/cookies';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from cookies on mount
  useEffect(() => {
    const token = getCookie('authToken');
    const userDataStr = getCookie('user');
    
    if (token && userDataStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        // Clear invalid cookies
        deleteCookie('authToken');
        deleteCookie('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store in cookies (7 days expiry)
    setCookie('authToken', token, 7);
    setCookie('user', encodeURIComponent(JSON.stringify(userData)), 7);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear cookies
    deleteCookie('authToken');
    deleteCookie('user');
    
    // Clear localStorage as backup
    localStorage.removeItem('cart');
  };

  // Update user profile
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    setCookie('user', encodeURIComponent(JSON.stringify(updatedUser)), 7);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};