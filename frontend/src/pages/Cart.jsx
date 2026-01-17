import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import '../styles/cart.css';

const Cart = () => {
  const { cartItems, clearCart, getCartTotal, getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">
            {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="cart-container container">
        <div className="cart-main">
          {/* Cart Items Header */}
          <div className="cart-items-header">
            <h2>Your Items</h2>
            <button 
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear All
            </button>
          </div>

          {/* Cart Items List */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem 
                key={`${item.id}-${item.selectedSize}`} 
                item={item} 
              />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="continue-shopping">
            <Link to="/products" className="btn btn-secondary">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart Summary Sidebar */}
        <aside className="cart-sidebar">
          <CartSummary 
            total={getCartTotal()}
            itemCount={getCartCount()}
            onProceed={handleProceedToCheckout}
          />
        </aside>
      </div>
    </div>
  );
};

export default Cart;
