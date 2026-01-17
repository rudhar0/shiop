import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, formatDate } from '../utils/helpers';
import Loader from '../components/common/Loader';
import '../styles/myBookings.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Mock bookings data - Replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBookings = [
        {
          id: 'SAM1737133200001',
          orderDate: '2026-01-15',
          items: [
            {
              id: 1,
              name: 'Elegant Pink Kurti',
              category: 'kurti',
              image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400',
              size: 'M',
              quantity: 2,
              price: 1799
            }
          ],
          totalAmount: 3598,
          paidAmount: 900,
          remainingAmount: 2698,
          paymentOption: 'advance',
          status: 'confirmed',
          collectionStatus: 'pending'
        },
        {
          id: 'SAM1737046800002',
          orderDate: '2026-01-14',
          items: [
            {
              id: 8,
              name: 'Royal Blue Lehnga',
              category: 'lehnga',
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
              size: 'L',
              quantity: 1,
              price: 12999
            }
          ],
          totalAmount: 12999,
          paidAmount: 12999,
          remainingAmount: 0,
          paymentOption: 'full',
          status: 'confirmed',
          collectionStatus: 'pending'
        },
        {
          id: 'SAM1736960400003',
          orderDate: '2026-01-13',
          items: [
            {
              id: 14,
              name: 'Traditional Maroon Suite',
              category: 'suite',
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
              size: 'XL',
              quantity: 1,
              price: 4999
            }
          ],
          totalAmount: 4999,
          paidAmount: 1250,
          remainingAmount: 3749,
          paymentOption: 'advance',
          status: 'cancelled',
          collectionStatus: 'cancelled',
          cancelledDate: '2026-01-14'
        }
      ];
      
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  const getCollectionStatusBadgeClass = (status) => {
    switch (status) {
      case 'collected':
        return 'collection-collected';
      case 'pending':
        return 'collection-pending';
      case 'cancelled':
        return 'collection-cancelled';
      default:
        return 'collection-pending';
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    // Simulate API call to cancel booking
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === selectedBooking.id
          ? {
              ...booking,
              status: 'cancelled',
              collectionStatus: 'cancelled',
              cancelledDate: new Date().toISOString().split('T')[0]
            }
          : booking
      )
    );

    setShowCancelModal(false);
    setSelectedBooking(null);
    setCancelReason('');
    alert('Booking cancelled successfully! Refund will be processed within 5-7 business days.');
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <div className="container">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            View and manage your booking history
          </p>
        </div>
      </div>

      <div className="bookings-container container">
        {/* Filter Tabs */}
        <div className="bookings-filters">
          <button
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Active ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📦</div>
            <h2>No Bookings Found</h2>
            <p>You haven't made any bookings yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header-section">
                  <div className="booking-id-section">
                    <span className="booking-label">Booking ID:</span>
                    <span className="booking-id">{booking.id}</span>
                  </div>
                  <div className="booking-date-section">
                    <span className="booking-label">Order Date:</span>
                    <span className="booking-date">{formatDate(booking.orderDate)}</span>
                  </div>
                  <div className="booking-status-badges">
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className={`collection-badge ${getCollectionStatusBadgeClass(booking.collectionStatus)}`}>
                      {booking.collectionStatus === 'pending' ? 'Ready for Collection' : 
                       booking.collectionStatus === 'collected' ? 'Collected' : 'Cancelled'}
                    </span>
                  </div>
                </div>

                <div className="booking-items">
                  {booking.items.map((item, index) => (
                    <div key={index} className="booking-item">
                      <img src={item.image} alt={item.name} className="booking-item-image" />
                      <div className="booking-item-details">
                        <h4>{item.name}</h4>
                        <p className="item-meta">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                        <p className="item-price">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="booking-payment-summary">
                  <div className="payment-row">
                    <span>Total Amount:</span>
                    <strong>{formatPrice(booking.totalAmount)}</strong>
                  </div>
                  <div className="payment-row highlight">
                    <span>Paid:</span>
                    <strong className="paid-amount">{formatPrice(booking.paidAmount)}</strong>
                  </div>
                  {booking.remainingAmount > 0 && (
                    <div className="payment-row highlight">
                      <span>Remaining (Pay at Collection):</span>
                      <strong className="remaining-amount">{formatPrice(booking.remainingAmount)}</strong>
                    </div>
                  )}
                </div>

                {booking.status === 'cancelled' && (
                  <div className="cancelled-info">
                    <p>❌ Cancelled on {formatDate(booking.cancelledDate)}</p>
                    <p>Refund will be processed within 5-7 business days</p>
                  </div>
                )}

                <div className="booking-actions">
                  {booking.status === 'confirmed' && (
                    <>
                      <button className="btn btn-secondary">View Details</button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                  {booking.status === 'cancelled' && (
                    <button className="btn btn-primary" onClick={() => window.location.href = '/products'}>
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCancelModal(false)}>
              ✕
            </button>

            <div className="modal-header">
              <h2>Cancel Booking</h2>
              <p>Booking ID: {selectedBooking?.id}</p>
            </div>

            <div className="modal-body">
              <p className="warning-text">
                ⚠️ Are you sure you want to cancel this booking?
              </p>

              <div className="refund-info">
                <h4>Refund Information:</h4>
                <p>• Paid Amount: {formatPrice(selectedBooking?.paidAmount)}</p>
                <p>• Refund will be processed within 5-7 business days</p>
                <p>• Refund will be credited to your original payment method</p>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Cancellation *</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Please tell us why you're cancelling this booking..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Booking
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={confirmCancelBooking}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
