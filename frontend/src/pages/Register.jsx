import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateRegistrationForm } from '../utils/validators';
import { generateOTP } from '../utils/helpers';
import OTPModal from '../components/auth/OTPModal';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = validateRegistrationForm(formData);

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Generate OTP
      const otp = generateOTP();
      setGeneratedOTP(otp);
      console.log('Generated OTP:', otp); // In real app, this would be sent via SMS/Email
      console.log('OTP sent to Email:', formData.email);
      console.log('OTP sent to Phone:', formData.contact);
      
      setShowOTPModal(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleOTPVerify = (isVerified) => {
    if (isVerified) {
      // Remove password fields before storing
      const { password, confirmPassword, ...userData } = formData;
      const token = 'mock-jwt-token-' + Date.now();
      
      login(userData, token);
      navigate('/', { replace: true });
    }
    setShowOTPModal(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join Samaira Collection today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="form-error">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contact" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  className={`form-input ${errors.contact ? 'error' : ''}`}
                  placeholder="10-digit phone number"
                  value={formData.contact}
                  onChange={handleChange}
                  maxLength="10"
                />
                {errors.contact && (
                  <span className="form-error">{errors.contact}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <span className="form-error">{errors.city}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className={`form-input ${errors.state ? 'error' : ''}`}
                  placeholder="Your state"
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && (
                  <span className="form-error">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <span className="form-error">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="otp-info-box">
              <span className="info-icon">ℹ️</span>
              <p>OTP will be sent to both your email and phone number for verification</p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-redirect">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </form>
        </div>

        <div className="auth-image-section">
          <img 
            src="https://images.unsplash.com/photo-1617530982502-de7a6c1dd72e?w=600&auto=format" 
            alt="Samaira Collection"
          />
          <div className="auth-image-overlay">
            <h2>Samaira Collection</h2>
            <p>Premium ethnic wear for every occasion</p>
          </div>
        </div>
      </div>

      {showOTPModal && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerify}
          contactInfo={`${formData.email} & ${formData.contact}`}
          generatedOTP={generatedOTP}
        />
      )}
    </div>
  );
};

export default Register;
