import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../utils/constants';
import '../../styles/productFilter.css';

const ProductFilter = () => {
  const { selectedCategory, setSelectedCategory, products } = useProducts();

  // Count products by category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  return (
    <div className="product-filter">
      <h3 className="filter-title">Filter by Category</h3>
      
      <div className="filter-categories">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`filter-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-name">{category.name}</span>
            <span className="category-count-badge">
              {getCategoryCount(category.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Additional Filter Info */}
      <div className="filter-info-section">
        <h4 className="filter-info-title">Booking Information</h4>
        <ul className="filter-info-list">
          <li>✓ Book with 25% advance</li>
          <li>✓ Pay rest on collection</li>
          <li>✓ Pick up from our Ludhiana store</li>
        </ul>
      </div>

      <div className="filter-price-guide">
        <h4 className="filter-info-title">Price Range</h4>
        <ul className="price-list">
          <li>
            <span className="price-category">Kurtis</span>
            <span className="price-range">₹1,299 - ₹2,199</span>
          </li>
          <li>
            <span className="price-category">Suites</span>
            <span className="price-range">₹2,499 - ₹5,999</span>
          </li>
          <li>
            <span className="price-category">Lehngas</span>
            <span className="price-range">₹9,999 - ₹15,999</span>
          </li>
        </ul>
      </div>

      {selectedCategory !== 'all' && (
        <button 
          className="btn btn-secondary btn-block clear-all-btn"
          onClick={() => setSelectedCategory('all')}
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};

export default ProductFilter;
