// frontend/src/components/admin/AdminLayout.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/adminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Samaira Admin</h2>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-link ${isActive('/admin')}`}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className={`admin-nav-link ${isActive('/admin/products')}`}>
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </Link>
          <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
            <span className="nav-icon">🛍️</span>
            <span>Orders</span>
          </Link>
          <Link to="/admin/users" className={`admin-nav-link ${isActive('/admin/users')}`}>
            <span className="nav-icon">👥</span>
            <span>Users</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="back-to-site">
            ← Back to Site
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h3>Admin Panel</h3>
          </div>
          <div className="topbar-right">
            <span className="admin-user">👤 {user?.firstName} {user?.lastName}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;