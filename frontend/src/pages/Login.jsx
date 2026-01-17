import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePhone } from '../utils/validators';
import { generateOTP } from '../utils/helpers';
import OTPModal from '../components/auth/OTPModal';
import '../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

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
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      const isEmail = formData.emailOrPhone.includes('@');
      if (isEmail && !validateEmail(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Invalid email address';
      } else if (!isEmail && !validatePhone(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Invalid phone number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      // For demo: Check if user exists (simple mock)
      const mockUser = {
        email: 'demo@samaira.com',
        phone: '9876543210',
        password: 'demo123'
      };

      const isEmailLogin = formData.emailOrPhone.includes('@');
      const isValidCredentials = (
        (isEmailLogin && formData.emailOrPhone === mockUser.email) ||
        (!isEmailLogin && formData.emailOrPhone === mockUser.phone)
      ) && formData.password === mockUser.password;

      if (isValidCredentials) {
        // Generate OTP
        const otp = generateOTP();
        setGeneratedOTP(otp);
        console.log('Generated OTP:', otp); // In real app, this would be sent via SMS/Email
        setShowOTPModal(true);
        setIsLoading(false);
      } else {
        setErrors({ password: 'Invalid credentials' });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleOTPVerify = (isVerified) => {
    if (isVerified) {
      // Mock user data
      const userData = {
        name: 'Demo User',
        email: 'demo@samaira.com',
        contact: '9876543210',
        city: 'Ludhiana',
        state: 'Punjab'
      };
      const token = 'mock-jwt-token-' + Date.now();
      
      login(userData, token);
      navigate(from, { replace: true });
    }
    setShowOTPModal(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Login to your Samaira Collection account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="emailOrPhone" className="form-label">
                Email or Phone Number
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                className={`form-input ${errors.emailOrPhone ? 'error' : ''}`}
                placeholder="Enter your email or phone number"
                value={formData.emailOrPhone}
                onChange={handleChange}
              />
              {errors.emailOrPhone && (
                <span className="form-error">{errors.emailOrPhone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-redirect">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>

            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <p>Email: demo@samaira.com</p>
              <p>Phone: 9876543210</p>
              <p>Password: demo123</p>
            </div>
          </form>
        </div>

        <div className="auth-image-section">
          <img 
            src="https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=600&auto=format" 
            alt="Samaira Collection"
          />
          <div className="auth-image-overlay">
            <h2>Samaira Collection</h2>
            <p>Your destination for elegant ethnic wear</p>
          </div>
        </div>
      </div>

      {showOTPModal && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerify}
          contactInfo={formData.emailOrPhone}
          generatedOTP={generatedOTP}
        />
      )}
    </div>
  );
};

export default Login;
