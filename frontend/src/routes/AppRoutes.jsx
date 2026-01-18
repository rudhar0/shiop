// frontend/src/routes/AppRoutes.jsx - Final Version with Admin
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyOTP from '../pages/VerifyOTP';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Contact from '../pages/Contact';
import MyBookings from '../pages/MyBookings';

// Admin Pages
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';

import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminProtectedRoute from '../components/common/AdminProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;