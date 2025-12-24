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
    <div className="text-center py-16">
      <div className="w-12 h-12 border-4 border-primary/10 border-l-primary rounded-full animate-spin mx-auto"></div>
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
            className="w-full max-w-md px-6 py-4 rounded-full border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 shadow-sm transition-all duration-300 text-base focus:outline-none focus:scale-[1.02] focus:shadow-glow focus:border-primary"
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex gap-3 flex-wrap justify-center">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`px-5 py-2.5 text-sm rounded-full transition-all duration-200 cursor-pointer font-medium ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white border-transparent shadow-lg' 
                    : 'bg-transparent border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5'
                }`}
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