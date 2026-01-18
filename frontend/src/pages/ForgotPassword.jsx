// frontend/src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import { validateEmail } from '../utils/validators';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.status === 'success') {
        setEmailSent(true);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(typeof err === 'string' ? err : 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="auth-header">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✉️</div>
              <h1>Check Your Email</h1>
              <p>Password reset link has been sent</p>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ fontSize: '1.1rem', color: '#2B2B2B', marginBottom: '2rem' }}>
                We've sent a password reset link to:
              </p>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: '700', 
                color: '#7B1E3A',
                marginBottom: '2rem',
                wordBreak: 'break-word'
              }}>
                {email}
              </p>
              <p style={{ fontSize: '0.95rem', color: '#8A8A8A', marginBottom: '2rem' }}>
                Please check your inbox and click on the link to reset your password.
                The link will expire in 10 minutes.
              </p>

              <div style={{ 
                backgroundColor: '#FFF8F2', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#2B2B2B', margin: 0 }}>
                  <strong>Didn't receive the email?</strong><br />
                  Check your spam folder or try again in a few minutes.
                </p>
              </div>

              <Link to="/login" className="btn btn-primary btn-block">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="auth-header">
            <h1>Forgot Password?</h1>
            <p>Enter your email to reset your password</p>
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
                className={`form-input ${error ? 'error' : ''}`}
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                autoFocus
              />
              {error && <span className="form-error">{error}</span>}
            </div>

            <div style={{ 
              backgroundColor: '#FFF8F2', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              color: '#2B2B2B'
            }}>
              ℹ️ We'll send you a link to reset your password to this email address.
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-redirect">
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;