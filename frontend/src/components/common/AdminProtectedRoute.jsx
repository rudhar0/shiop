// frontend/src/components/common/AdminProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (!user?.isAdmin && user?.role !== 'admin') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#FFF8F2',
        padding: '2rem'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⛔</div>
          <h1 style={{ color: '#7B1E3A', marginBottom: '1rem' }}>Access Denied</h1>
          <p style={{ color: '#8A8A8A', marginBottom: '2rem' }}>
            You don't have permission to access the admin panel.
          </p>
          <a href="/" style={{ 
            display: 'inline-block',
            padding: '0.8rem 2rem',
            background: '#7B1E3A',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none'
          }}>
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;