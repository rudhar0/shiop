// frontend/src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import '../styles/auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    // Get token from URL
    const token = searchParams.get('token');
    if (!token) {
      navigate('/forgot-password');
    } else {
      setResetToken(token);
    }
  }, [searchParams, navigate]);

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
      const response = await authAPI.resetPassword(resetToken, formData.password);
      
      if (response.status === 'success') {
        // Show success message
        alert('Password reset successful! Please login with your new password.');
        
        // Redirect to login
        navigate('/login');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setErrors({ 
        password: typeof err === 'string' ? err : 'Failed to reset password. Link may be expired.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                New Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                autoFocus
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            <div style={{ 
              backgroundColor: '#FFF8F2', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#2B2B2B', margin: 0 }}>
                <strong>Password Requirements:</strong>
              </p>
              <ul style={{ 
                fontSize: '0.85rem', 
                color: '#8A8A8A', 
                marginTop: '0.5rem',
                paddingLeft: '1.5rem'
              }}>
                <li>At least 6 characters long</li>
                <li>Both passwords must match</li>
              </ul>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;