import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import '../../styles/navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
           {/*<img src="/logo.png" alt="Samaira Collection" className="logo-image" />*/}
          <span className="logo-text">Samaira Collection</span>
        </Link>
        

        {/* Desktop Navigation */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className={`nav-link ${isActive('/products')}`}>
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className={`nav-link ${isActive('/cart')}`}>
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
              Contact
            </Link>
          </li>
          {user && (
         <li>
            <Link to="/my-bookings" className="nav-link">My Bookings</Link>
          </li>
        )}


          {/* Mobile Only - Auth Links */}
          {user ? (
            <li className="nav-item mobile-only">
              <div className="user-info-mobile">
                <span className="user-name">Hello, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn-mobile">
                  Logout
                </button>
              </div>
            </li>
          ) : (
            <li className="nav-item mobile-only">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Auth Section */}
        <div className="nav-auth desktop-only">
          {user ? (
            <div className="user-info">
              <span className="user-greeting">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
