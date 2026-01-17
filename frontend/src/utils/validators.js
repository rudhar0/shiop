// Email Validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Phone Validation (Indian format)
export const validatePhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

// Name Validation
export const validateName = (name) => {
  return name.trim().length >= 2;
};

// OTP Validation
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

// Form Validation
export const validateRegistrationForm = (formData) => {
  const errors = {};

  if (!validateName(formData.name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (!validatePhone(formData.contact)) {
    errors.contact = 'Invalid phone number (10 digits)';
  }

  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = 'City is required';
  }

  if (!formData.state || formData.state.trim().length < 2) {
    errors.state = 'State is required';
  }

  return errors;
};
