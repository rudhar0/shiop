// frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import { formatPrice } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.status === 'success') {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your store</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#7B1E3A' }}>📦</div>
          <div className="stat-info">
            <h3>{stats?.totalProducts || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#C9A24D' }}>🛍️</div>
          <div className="stat-info">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#2E8B57' }}>👥</div>
          <div className="stat-info">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FF6B6B' }}>💰</div>
          <div className="stat-info">
            <h3>{formatPrice(stats?.totalRevenue || 0)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Order Statistics</h2>
          <div className="order-stats">
            <div className="order-stat-item">
              <span className="stat-label">Confirmed</span>
              <span className="stat-value confirmed">{stats?.confirmedOrders || 0}</span>
            </div>
            <div className="order-stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value completed">{stats?.completedOrders || 0}</span>
            </div>
            <div className="order-stat-item">
              <span className="stat-label">Cancelled</span>
              <span className="stat-value cancelled">{stats?.cancelledOrders || 0}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Revenue Overview</h2>
          <div className="revenue-stats">
            <div className="revenue-item">
              <span className="revenue-label">Total Collected</span>
              <span className="revenue-value">{formatPrice(stats?.totalRevenue || 0)}</span>
            </div>
            <div className="revenue-item">
              <span className="revenue-label">Pending Collection</span>
              <span className="revenue-value pending">{formatPrice(stats?.pendingRevenue || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;