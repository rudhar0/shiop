import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/helpers';
import '../../styles/productCard.css';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, selectedSize);
    setShowSizeSelector(false);
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout', product } });
      return;
    }
    addToCart(product, selectedSize);
    navigate('/checkout');
  };

  const inCart = isInCart(product.id, selectedSize);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.featured && (
          <span className="product-badge featured">Featured</span>
        )}
        {product.stock < 5 && (
          <span className="product-badge low-stock">Only {product.stock} left</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category.toUpperCase()}</p>
        
        <div className="product-price-section">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-price-note">25% advance to book</span>
        </div>

        {/* Size Selector */}
        <div className="product-sizes">
          <span className="size-label">Size:</span>
          <div className="size-options">
            {product.sizes.map(size => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(size);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="product-actions">
          <button 
            className={`btn-add-cart ${inCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {inCart ? '✓ In Cart' : '+ Add to Cart'}
          </button>
          
          <button 
            className="btn-book-now"
            onClick={handleBookNow}
            disabled={product.stock === 0}
          >
            Book Now
          </button>
        </div>

        {product.stock === 0 && (
          <p className="out-of-stock">Out of Stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
