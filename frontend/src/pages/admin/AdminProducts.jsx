// frontend/src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import { formatPrice } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import '../../styles/admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'kurti',
    price: '',
    description: '',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: '',
    featured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getAdminProducts();
      if (response.status === 'success') {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter(s => s !== size)
      : [...formData.sizes, size];
    setFormData(prev => ({ ...prev, sizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct._id, formData);
        alert('Product updated successfully!');
      } else {
        await adminAPI.createProduct(formData);
        alert('Product created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert('Error saving product: ' + error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image,
      sizes: product.sizes,
      stock: product.stock,
      featured: product.featured
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        alert('Error deleting product: ' + error);
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'kurti',
      price: '',
      description: '',
      image: '',
      sizes: ['S', 'M', 'L', 'XL'],
      stock: '',
      featured: false
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-products">
      <div className="admin-header">
        <div>
          <h1>Products Management</h1>
          <p>Manage your product inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          + Add New Product
        </button>
      </div>

      <div className="products-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sizes</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-thumb" />
                </td>
                <td>{product.name}</td>
                <td><span className="category-badge">{product.category}</span></td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <span className={`stock-badge ${product.stock < 5 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>{product.sizes.join(', ')}</td>
                <td>{product.featured ? '⭐' : '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="kurti">Kurti</option>
                    <option value="lehnga">Lehnga</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sizes *</label>
                <div className="size-checkboxes">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <label key={size} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  Featured Product
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;