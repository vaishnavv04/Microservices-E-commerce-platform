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
          getCategories().catch(() => ({ data: { categories: [] } })) // Handle if endpoint fails
        ]);
        setProducts(prodRes.data.products || []);
        
        // Extract names from category objects
        const categoryNames = Array.isArray(catRes.data.categories) 
          ? catRes.data.categories.map(c => c.name) 
          : [];
        setCategories(['All', ...categoryNames]); 
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category_name === activeCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="text-center py-16">
      <div className="spinner"></div>
      <p className="mt-4 text-slate-500 dark:text-slate-400">Loading Amazing Products...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Our Collection</h1>
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-6 items-center max-w-xl mx-auto">
          <input 
            type="text" 
            className="search-bar"
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex gap-3 flex-wrap justify-center">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default Products;