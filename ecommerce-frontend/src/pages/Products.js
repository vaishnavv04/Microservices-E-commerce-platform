import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategories().catch(() => ({ data: [] })) // Handle if endpoint fails
        ]);
        setProducts(prodRes.data);
        // Extract unique categories if API returns strings, or use directly if objects
        setCategories(['All', ...catRes.data]); 
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading Amazing Products...</p>
    </div>
  );

  return (
    <div className="container">
      <div className="products-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Our Collection</h1>
        
        {/* Search & Filter Controls */}
        <div className="controls" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto' 
        }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', maxWidth: '400px' }}
          />
          
          <div className="category-pills" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.875rem',
                  borderRadius: '2rem', // Pill shape
                  border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                  background: activeCategory === cat ? 'var(--primary-color)' : 'transparent',
                  color: activeCategory === cat ? 'white' : 'var(--text-secondary)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default Products;