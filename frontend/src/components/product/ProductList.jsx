import ProductCard from './ProductCard';
import '../../styles/productList.css';

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
