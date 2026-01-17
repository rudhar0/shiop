import { formatPrice } from '../../utils/helpers';
import '../../styles/cartSummary.css';

const CartSummary = ({ total, itemCount, onProceed }) => {
  const advanceAmount = total * 0.25; // 25% advance
  const remainingAmount = total * 0.75; // 75% remaining

  return (
    <div className="cart-summary">
      <h2 className="summary-title">Order Summary</h2>

      <div className="summary-details">
        <div className="summary-row">
          <span className="summary-label">Items ({itemCount})</span>
          <span className="summary-value">{formatPrice(total)}</span>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-row total-row">
          <span className="summary-label">Total Amount</span>
          <span className="summary-value total-value">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Booking Information */}
      <div className="booking-info">
        <h3 className="booking-title">Booking Options</h3>
        
        <div className="booking-option">
          <div className="option-header">
            <span className="option-icon">💰</span>
            <span className="option-name">25% Advance Payment</span>
          </div>
          <div className="option-details">
            <div className="option-row">
              <span>Pay Now:</span>
              <strong>{formatPrice(advanceAmount)}</strong>
            </div>
            <div className="option-row">
              <span>Pay on Collection:</span>
              <strong>{formatPrice(remainingAmount)}</strong>
            </div>
          </div>
        </div>

        <div className="booking-option highlighted">
          <div className="option-header">
            <span className="option-icon">✓</span>
            <span className="option-name">Full Payment</span>
          </div>
          <div className="option-details">
            <div className="option-row">
              <span>Pay Now:</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="option-row">
              <span>Pay on Collection:</span>
              <strong>{formatPrice(0)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Note */}
      <div className="collection-note">
        <p className="note-icon">🏪</p>
        <p className="note-text">
          <strong>Collection from Shop:</strong><br />
          Visit our Ludhiana store to collect your order
        </p>
      </div>

      {/* Proceed Button */}
      <button 
        className="btn btn-primary btn-block proceed-btn"
        onClick={onProceed}
      >
        Proceed to Checkout
      </button>

      {/* Security Note */}
      <div className="security-note">
        <span className="security-icon">🔒</span>
        <span>Secure Checkout</span>
      </div>
    </div>
  );
};

export default CartSummary;
