import { useState, useEffect } from 'react';
import { validateOTP } from '../../utils/validators';
import '../../styles/otpModal.css';

const OTPModal = ({ isOpen, onClose, onVerify, contactInfo, generatedOTP }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

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

  const handleVerify = () => {
    const otpString = otp.join('');

    if (!validateOTP(otpString)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);

    // Simulate verification
    setTimeout(() => {
      if (otpString === generatedOTP) {
        onVerify(true);
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0').focus();
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleResend = () => {
    console.log('Resending OTP to:', contactInfo);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(120);
    setCanResend(false);
    document.getElementById('otp-0').focus();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="otp-modal-overlay" onClick={onClose}>
      <div className="otp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="otp-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="otp-modal-header">
          <div className="otp-icon">📱</div>
          <h2>Verify OTP</h2>
          <p className="otp-description">
            We've sent a 6-digit OTP to
          </p>
          <p className="otp-contact-info">{contactInfo}</p>
        </div>

        <div className="otp-modal-body">
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
              <button className="resend-btn" onClick={handleResend}>
                Resend OTP
              </button>
            ) : (
              <p>Didn't receive OTP? Resend in {formatTime(timer)}</p>
            )}
          </div>

          <div className="otp-demo-note">
            <p className="demo-note-title">📝 Demo OTP:</p>
            <p className="demo-otp-code">{generatedOTP}</p>
            <p className="demo-note-text">Use this OTP for verification</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
