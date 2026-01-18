// frontend/src/pages/VerifyOTP.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import { useAuth } from '../hooks/useAuth';
import { validateOTP } from '../utils/validators';
import '../styles/auth.css';
import '../styles/otpModal.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or redirect
  const email = location.state?.email;
  const userData = location.state?.userData;

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    
    setOtp(newOtp);
    document.getElementById('otp-5').focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (!validateOTP(otpString)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP(email, otpString);

      if (response.status === 'success') {
        // Login user with token
        const user = userData || {
          id: response.user_id,
          email: email
        };

        login(user, response.token);
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(typeof err === 'string' ? err : 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0').focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      // If we have userId, use it, otherwise send OTP by email
      const response = await authAPI.sendOTP({ email });

      if (response.status === 'success') {
        setOtp(['', '', '', '', '', '']);
        setTimer(120);
        setCanResend(false);
        document.getElementById('otp-0').focus();
        alert('OTP has been resent to your email');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(typeof err === 'string' ? err : 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="auth-card">
          <div className="auth-header" style={{ background: 'linear-gradient(135deg, #FFF8F2, #F6C1CC)', padding: '2rem', borderRadius: '12px 12px 0 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📱</div>
            <h1>Verify OTP</h1>
            <p style={{ color: '#2B2B2B', marginTop: '1rem' }}>
              We've sent a 6-digit OTP to
            </p>
            <p style={{ color: '#7B1E3A', fontWeight: '700', fontSize: '1.1rem' }}>
              {email}
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className={`otp-input ${error ? 'error' : ''}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <p className="otp-error">{error}</p>
            )}

            <div className="otp-timer">
              {timer > 0 ? (
                <p>Code expires in <strong>{formatTime(timer)}</strong></p>
              ) : (
                <p className="timer-expired">OTP expired</p>
              )}
            </div>

            <button
              className="btn btn-primary btn-block otp-verify-btn"
              onClick={handleVerify}
              disabled={otp.join('').length !== 6 || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="otp-resend">
              {canResend ? (
                <button 
                  className="resend-btn" 
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? 'Resending...' : 'Resend OTP'}
                </button>
              ) : (
                <p>Didn't receive OTP? Resend in {formatTime(timer)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;