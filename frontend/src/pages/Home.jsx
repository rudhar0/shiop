import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import '../styles/home.css';

const Home = () => {
  const { getFeaturedProducts, loading } = useProducts();
  const featuredProducts = getFeaturedProducts();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand-name">Samaira Collection</span>
          </h1>
          <p className="hero-subtitle">
            Discover Elegance in Every Thread
          </p>
          <p className="hero-description">
            Exquisite collection of traditional Kurtis, Royal Lehngas & Designer Suites
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-hero">
              Shop Now
            </Link>
            <Link to="/products?category=lehnga" className="btn btn-secondary btn-hero">
              View Lehngas
            </Link>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">✓</span>
              <span>Book with 25% Advance</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">✓</span>
              <span>Premium Quality Fabrics</span>
            </div>
            <div className="hero-feature">
              <span className="feature-icon">✓</span>
              <span>Collect from Shop</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="/download.jpeg" 
            alt="Samaira Collection"
            className="hero-img"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products?category=kurti" className="category-card">
              <div className="category-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format" 
                  alt="Kurtis"
                  className="category-image"
                />
                <div className="category-overlay">
                  <h3 className="category-name">Kurtis</h3>
                  <p className="category-count">Elegant & Comfortable</p>
                  <span className="category-link-text">Shop Now →</span>
                </div>
              </div>
            </Link>

            <Link to="/products?category=lehnga" className="category-card">
              <div className="category-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&auto=format" 
                  alt="Lehngas"
                  className="category-image"
                />
                <div className="category-overlay">
                  <h3 className="category-name">Lehngas</h3>
                  <p className="category-count">Royal & Majestic</p>
                  <span className="category-link-text">Shop Now →</span>
                </div>
              </div>
            </Link>

            <Link to="/products?category=suite" className="category-card">
              <div className="category-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1617530982502-de7a6c1dd72e?w=500&auto=format" 
                  alt="Suites"
                  className="category-image"
                />
                <div className="category-overlay">
                  <h3 className="category-name">Suites</h3>
                  <p className="category-count">Traditional & Stylish</p>
                  <span className="category-link-text">Shop Now →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section section">
        <div className="container">
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-subtitle">
            Handpicked pieces from our premium collection
          </p>
          
          <div className="products-grid">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="view-all-container">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section section">
        <div className="container">
          <h2 className="section-title">Why Choose Samaira Collection?</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <span className="feature-emoji">🎨</span>
              </div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">
                Finest fabrics and materials sourced for lasting elegance and comfort
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <span className="feature-emoji">💰</span>
              </div>
              <h3 className="feature-title">Flexible Booking</h3>
              <p className="feature-description">
                Book with just 25% advance payment and pay the rest on collection
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <span className="feature-emoji">🏪</span>
              </div>
              <h3 className="feature-title">Shop Collection</h3>
              <p className="feature-description">
                Visit our Ludhiana store to collect your order and see our full range
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <span className="feature-emoji">✨</span>
              </div>
              <h3 className="feature-title">Latest Designs</h3>
              <p className="feature-description">
                Stay trendy with our regularly updated collection of ethnic wear
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Book Your Perfect Outfit?</h2>
          <p className="cta-description">
            Browse our collection and reserve your favorites today!
          </p>
          <Link to="/products" className="btn btn-accent btn-large">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
