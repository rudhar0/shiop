// Format Price in Indian Rupees
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Calculate Booking Amount
export const calculateBookingAmount = (totalPrice, paymentOption) => {
  if (paymentOption === 'full') {
    return totalPrice;
  }
  return (totalPrice * 0.25); // 25% advance
};

// Get Remaining Amount
export const getRemainingAmount = (totalPrice, paymentOption) => {
  if (paymentOption === 'full') {
    return 0;
  }
  return (totalPrice * 0.75); // 75% remaining
};

// Generate Random OTP (for demo purposes)
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Truncate Text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Local Storage helpers
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
