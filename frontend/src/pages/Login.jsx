// frontend/src/pages/Login.jsx - Updated with Cookies
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/auth.api';
import { validateEmail } from '../utils/validators';
import '../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
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

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.status === 'success') {
        // Login user (stores in cookies)
        login(response.user, response.token);
        
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        password: typeof error === 'string' ? error : 'Invalid email or password' 
      });
    } finally {
      setIsLoading(false);
    }
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
              <label htmlFor="email" className="form-label">
                Email Address
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

            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <Link to="/forgot-password" className="auth-link" style={{ fontSize: '0.9rem' }}>
                Forgot Password?
              </Link>
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
    </div>
  );
};

export default Login;