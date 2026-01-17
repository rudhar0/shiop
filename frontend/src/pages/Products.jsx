import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductFilter from '../components/product/ProductFilter';
import ProductList from '../components/product/ProductList';
import Loader from '../components/common/Loader';
import '../styles/products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { 
    filteredProducts, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    loading 
  } = useProducts();

  // Handle category from URL query params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams, setSelectedCategory]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1 className="page-title">Our Collection</h1>
          <p className="page-subtitle">
            Explore our exquisite range of traditional ladies garments
          </p>
        </div>
      </div>

      <div className="products-container container">
        <aside className="products-sidebar">
          <ProductFilter />
        </aside>

        <main className="products-main">
          {/* Search Bar */}
          <div className="products-search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search for kurtis, lehngas, suites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Results Info */}
          <div className="products-info">
            <p className="products-count">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
              {selectedCategory !== 'all' && (
                <span className="filter-badge">
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  <button 
                    className="clear-filter"
                    onClick={() => setSelectedCategory('all')}
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                </span>
              )}
            </p>
          </div>

          {/* Product List */}
          <ProductList products={filteredProducts} />

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No Products Found</h3>
              <p>Try adjusting your filters or search query</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
