import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addItem } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsAdding(true);
    try {
      await addItem({ userId: user.id, productId: id, quantity });
      // Optional: Add a toast notification here
      setTimeout(() => setIsAdding(false), 500); // Fake delay for better UX
    } catch (err) {
      console.error("Add to cart failed", err);
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <div className="spinner"></div>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Products</Link>
    </div>
  );

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        <Link to="/products">Products</Link> / <span>{product.name}</span>
      </div>

      <div className="product-detail animate-fade-in">
        {/* Left Column: Image */}
        <div className="detail-image">
           <img 
            src={product.image_url || 'https://via.placeholder.com/600?text=No+Image'} 
            alt={product.name} 
          />
        </div>

        {/* Right Column: Info */}
        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="sku">SKU: {product.id.substring(0, 8)}</p>
          
          <div className="price-tag">
            ${Number(product.price).toFixed(2)}
          </div>

          <p className="description">{product.description}</p>

          <div className="actions">
            {/* Quantity Selector */}
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart} 
              className="btn btn-primary btn-lg" 
              disabled={isAdding}
              style={{ flex: 1 }}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
          
          <div className="meta">
            <p>Category: <strong>{product.category || 'General'}</strong></p>
            <p>Stock: <span style={{ color: 'green' }}>In Stock</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;