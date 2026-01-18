// frontend/src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import { formatPrice, formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import '../../styles/admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders({ status: filterStatus });
      if (response.status === 'success') {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus, collectionStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, {
        status: newStatus,
        collectionStatus: collectionStatus
      });
      alert('Order status updated successfully!');
      fetchOrders();
    } catch (error) {
      alert('Error updating status: ' + error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <div>
          <h1>Orders Management</h1>
          <p>View and manage customer orders</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All Orders ({orders.length})
        </button>
        <button
          className={`filter-tab ${filterStatus === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('confirmed')}
        >
          Confirmed
        </button>
        <button
          className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </button>
        <button
          className={`filter-tab ${filterStatus === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilterStatus('cancelled')}
        >
          Cancelled
        </button>
      </div>

      <div className="orders-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Collection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td><strong>{order._id.slice(-8)}</strong></td>
                <td>
                  <div>
                    <div><strong>{order.user?.firstName} {order.user?.lastName}</strong></div>
                    <div style={{ fontSize: '0.85rem', color: '#8A8A8A' }}>{order.user?.email}</div>
                  </div>
                </td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{order.items.length} items</td>
                <td>{formatPrice(order.totalAmount)}</td>
                <td><strong style={{ color: '#2E8B57' }}>{formatPrice(order.paidAmount)}</strong></td>
                <td>
                  {order.remainingAmount > 0 ? (
                    <strong style={{ color: '#C9A24D' }}>{formatPrice(order.remainingAmount)}</strong>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={`collection-badge collection-${order.collectionStatus}`}>
                    {order.collectionStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view" onClick={() => viewOrderDetails(order)}>
                      View
                    </button>
                    {order.status === 'confirmed' && (
                      <select
                        onChange={(e) => {
                          if (e.target.value === 'collected') {
                            handleStatusChange(order._id, 'completed', 'collected');
                          }
                        }}
                        defaultValue=""
                        className="status-select"
                      >
                        <option value="" disabled>Update</option>
                        <option value="collected">Mark Collected</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            
            <div className="order-detail-content">
              <div className="detail-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
              </div>

              <div className="detail-section">
                <h3>Order Items</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-detail-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p><strong>{item.name}</strong></p>
                      <p>Size: {item.size} | Qty: {item.quantity}</p>
                      <p>{formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <h3>Payment Details</h3>
                <p><strong>Total Amount:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
                <p style={{ color: '#2E8B57' }}><strong>Amount Paid:</strong> {formatPrice(selectedOrder.paidAmount)}</p>
                <p style={{ color: '#C9A24D' }}><strong>Remaining:</strong> {formatPrice(selectedOrder.remainingAmount)}</p>
                <p><strong>Payment Option:</strong> {selectedOrder.paymentOption === 'advance' ? '25% Advance' : 'Full Payment'}</p>
              </div>

              <div className="detail-section">
                <h3>Status</h3>
                <p><strong>Order Status:</strong> <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                <p><strong>Collection Status:</strong> <span className={`collection-badge collection-${selectedOrder.collectionStatus}`}>{selectedOrder.collectionStatus}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;