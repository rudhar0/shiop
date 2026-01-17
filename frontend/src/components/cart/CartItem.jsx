import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';
import '../../styles/cartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) {
      alert(`Only ${item.stock} items available in stock`);
      return;
    }
    updateQuantity(item.id, item.selectedSize, newQuantity);
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(item.id, item.selectedSize);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-category">{item.category.toUpperCase()}</p>
        <div className="cart-item-size">
          <span className="size-label">Size:</span>
          <span className="size-value">{item.selectedSize}</span>
        </div>
        <p className="cart-item-price">{formatPrice(item.price)} each</p>
      </div>

      <div className="cart-item-quantity">
        <label className="quantity-label">Quantity</label>
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            className="quantity-input"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            min="1"
            max={item.stock}
          />
          <button
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {item.quantity >= item.stock && (
          <p className="stock-warning">Max stock reached</p>
        )}
      </div>

      <div className="cart-item-total">
        <p className="total-label">Total</p>
        <p className="total-price">{formatPrice(itemTotal)}</p>
      </div>

      <button
        className="cart-item-remove"
        onClick={handleRemove}
        aria-label="Remove item"
      >
        🗑️
      </button>
    </div>
  );
};

export default CartItem;
