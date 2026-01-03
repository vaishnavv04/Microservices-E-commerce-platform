import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatINR } from '../utils/currency';

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
        setProduct(res.data.product);
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
    <div className="flex justify-center mt-16">
      <div className="w-12 h-12 border-4 border-primary/10 border-l-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Product not found</h2>
      <Link 
        to="/products" 
        className="inline-block mt-4 px-6 py-3 rounded-lg font-semibold bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:border-primary hover:text-primary"
      >
        Back to Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-slate-500 dark:text-slate-400 text-sm">
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700 dark:text-slate-300">{product.name}</span>
      </div>

      <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
        {/* Left Column: Image */}
        <div>
          <img 
            src={product.image_url || 'https://via.placeholder.com/600?text=No+Image'} 
            alt={product.name}
            className="w-full rounded-xl shadow-md border border-slate-200 dark:border-slate-700 bg-white"
          />
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{product.name}</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
            SKU: {String(product.id).substring(0, 8)}
          </p>
          
          <div className="text-3xl font-extrabold text-primary mb-6">
            {formatINR(Number(product.price))}
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex gap-4 mb-8 flex-wrap">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
              <button 
                onClick={() => handleQuantityChange(-1)} 
                disabled={quantity <= 1}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border-none text-xl text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="px-4 py-2 font-semibold min-w-12 text-center border-l border-r border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100">
                {quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border-none text-xl text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-600"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart} 
              className="flex-1 px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-br from-primary to-purple-500 hover:from-primary-hover hover:to-purple-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6 text-sm text-slate-500 dark:text-slate-400 space-y-2 mt-auto">
            <p>Category: <strong className="text-slate-700 dark:text-slate-300">{product.category_name || 'General'}</strong></p>
            <p>Stock: <span className="text-green-500 font-medium">In Stock</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;