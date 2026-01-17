// Color Palette - Samaira Collection
export const COLORS = {
  primary: '#7B1E3A',        // Royal Maroon
  secondary: '#F6C1CC',      // Soft Blush Pink
  accent: '#C9A24D',         // Antique Gold
  background: '#FFF8F2',     // Ivory White
  textPrimary: '#2B2B2B',    // Charcoal Black
  textSecondary: '#8A8A8A',  // Warm Grey
  success: '#2E8B57',        // Success Green
  error: '#B11226'           // Alert Red
};

// Categories
export const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'kurti', name: 'Kurti' },
  { id: 'lehnga', name: 'Lehnga' },
  { id: 'suite', name: 'Suite' }
];

// Payment Options
export const PAYMENT_OPTIONS = [
  { id: 'full', label: 'Pay Full Amount (100%)', value: 100 },
  { id: 'advance', label: 'Pay 25% Advance (Booking Amount)', value: 25 }
];

// API Base URL (will be replaced with actual backend URL)
export const API_BASE_URL = 'http://localhost:5000/api';

// Shop Information
export const SHOP_INFO = {
  name: 'Samaira Collection',
  address: 'Shop No. 18, Jyoti Chowk, Jalandhar, Punjab - 141001',
  phone: '+91 76986 73832',
  email: 'info@samairacollection.com',
  timing: 'Mon - Sat: 10:00 AM - 8:00 PM | Sunday: 11:00 AM - 6:00 PM'
};
