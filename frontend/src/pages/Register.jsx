// frontend/src/pages/Register.jsx - Updated with Cookies & Proper OTP Flow
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

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

    try {
      // Register user - backend will automatically send OTP
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 'success') {
        // Navigate to OTP verification page
        navigate('/verify-otp', {
          state: {
            email: formData.email,
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email
            }
          }
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        email: typeof error === 'string' ? error : 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
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
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <span className="form-error">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <span className="form-error">{errors.lastName}</span>
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
              <p>OTP will be sent to your email for verification</p>
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
    </div>
  );
};

export default Register;