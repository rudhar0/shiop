import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, calculateBookingAmount, getRemainingAmount } from '../utils/helpers';
import { PAYMENT_OPTIONS, SHOP_INFO } from '../utils/constants';
import '../styles/checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const totalAmount = getCartTotal();

  const handlePaymentOptionChange = (optionId) => {
    setSelectedPaymentOption(optionId);
  };

  const handleConfirmBooking = async () => {
    if (!selectedPaymentOption) {
      alert('Please select a payment option');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const generatedBookingId = `SAM${Date.now()}`;
      setBookingId(generatedBookingId);
      setBookingConfirmed(true);
      setIsProcessing(false);
      
      // Clear cart after successful booking
      setTimeout(() => {
        clearCart();
      }, 3000);
    }, 2000);
  };

  // Booking Confirmation Screen
  if (bookingConfirmed) {
    const amountPaid = selectedPaymentOption === 'full' 
      ? totalAmount 
      : calculateBookingAmount(totalAmount, selectedPaymentOption);
    
    const remainingAmount = getRemainingAmount(totalAmount, selectedPaymentOption);

    return (
      <div className="checkout-page">
        <div className="container">
          <div className="booking-confirmation">
            <div className="confirmation-icon">✓</div>
            <h1 className="confirmation-title">Booking Confirmed!</h1>
            <p className="confirmation-message">
              Thank you for your booking. Your order has been confirmed.
            </p>

            <div className="booking-details-card">
              <h3>Booking Details</h3>
              <div className="detail-row">
                <span>Booking ID:</span>
                <strong>{bookingId}</strong>
              </div>
              <div className="detail-row">
                <span>Customer Name:</span>
                <strong>{user.name}</strong>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <strong>{user.email}</strong>
              </div>
              <div className="detail-row">
                <span>Contact:</span>
                <strong>{user.contact}</strong>
              </div>
              <div className="detail-divider"></div>
              <div className="detail-row">
                <span>Total Amount:</span>
                <strong>{formatPrice(totalAmount)}</strong>
              </div>
              <div className="detail-row highlight">
                <span>Amount Paid:</span>
                <strong className="paid-amount">{formatPrice(amountPaid)}</strong>
              </div>
              {remainingAmount > 0 && (
                <div className="detail-row highlight">
                  <span>Remaining Amount:</span>
                  <strong className="remaining-amount">{formatPrice(remainingAmount)}</strong>
                </div>
              )}
            </div>

            <div className="collection-instructions">
              <h3>📍 Collection Instructions</h3>
              <p><strong>Visit our shop to collect your order:</strong></p>
              <p className="shop-address">{SHOP_INFO.address}</p>
              <p className="shop-timing">
                <strong>Timings:</strong> {SHOP_INFO.timing}
              </p>
              <p className="shop-contact">
                <strong>Contact:</strong> {SHOP_INFO.phone}
              </p>
              {remainingAmount > 0 && (
                <div className="payment-reminder">
                  <p>💰 <strong>Please bring {formatPrice(remainingAmount)}</strong> to pay the remaining amount when collecting your order.</p>
                </div>
              )}
            </div>

            <div className="confirmation-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Checkout Screen
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <div className="container">
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Complete your booking</p>
        </div>
      </div>

      <div className="checkout-container container">
        {/* Customer Information */}
        <div className="checkout-section">
          <h2 className="section-heading">Customer Information</h2>
          <div className="customer-info-card">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Contact:</span>
                <span className="info-value">{user.contact}</span>
              </div>
              <div className="info-item">
                <span className="info-label">City:</span>
                <span className="info-value">{user.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">State:</span>
                <span className="info-value">{user.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-section">
          <h2 className="section-heading">Order Summary</h2>
          <div className="order-summary-card">
            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.selectedSize} | Qty: {item.quantity}</p>
                    <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total Amount:</span>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="checkout-section">
          <h2 className="section-heading">Select Payment Option</h2>
          <p className="section-description">
            Choose how you want to pay for your booking
          </p>

          <div className="payment-options">
            {PAYMENT_OPTIONS.map((option) => {
              const bookingAmount = calculateBookingAmount(totalAmount, option.id);
              const remaining = getRemainingAmount(totalAmount, option.id);

              return (
                <div
                  key={option.id}
                  className={`payment-option ${selectedPaymentOption === option.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentOptionChange(option.id)}
                >
                  <div className="payment-option-header">
                    <div className="radio-button">
                      <div className={`radio-dot ${selectedPaymentOption === option.id ? 'active' : ''}`}></div>
                    </div>
                    <div className="payment-option-info">
                      <h3>{option.label}</h3>
                      {option.id === 'advance' && (
                        <span className="recommended-badge">Recommended</span>
                      )}
                    </div>
                  </div>

                  <div className="payment-breakdown">
                    <div className="breakdown-row">
                      <span>Pay Now:</span>
                      <strong className="pay-now-amount">{formatPrice(bookingAmount)}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>Pay on Collection:</span>
                      <strong className={remaining > 0 ? 'remaining-amount' : 'zero-amount'}>
                        {formatPrice(remaining)}
                      </strong>
                    </div>
                  </div>

                  {option.id === 'advance' && (
                    <p className="option-note">
                      ✓ Reserve your items with just 25% advance payment
                    </p>
                  )}
                  {option.id === 'full' && (
                    <p className="option-note">
                      ✓ Complete payment now, no need to carry cash to shop
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Collection Information */}
        <div className="checkout-section">
          <div className="collection-info-card">
            <h3>🏪 Collection from Shop</h3>
            <p className="collection-note-text">
              All orders must be collected from our Ludhiana store. We do not provide delivery services.
            </p>
            <div className="shop-details">
              <p><strong>Address:</strong> {SHOP_INFO.address}</p>
              <p><strong>Timing:</strong> {SHOP_INFO.timing}</p>
              <p><strong>Contact:</strong> {SHOP_INFO.phone}</p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="checkout-actions">
          <button
            className="btn btn-primary btn-large btn-block"
            onClick={handleConfirmBooking}
            disabled={!selectedPaymentOption || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm Booking & Pay'}
          </button>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate('/cart')}
            disabled={isProcessing}
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
