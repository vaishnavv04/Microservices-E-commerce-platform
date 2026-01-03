import React from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/currency';

/**
 * ProductCard Component - Displays a single product in the grid
 * 
 * TODO: Enhance this component with:
 * - Product badges (New, Sale, Out of Stock)
 * - Wishlist/favorite button
 * - Quick add-to-cart button
 * - Rating stars display
 * - Compare checkbox
 */
const ProductCard = ({ product }) => {
  return (
    <div className="card animate-fade-in group">
      {/* =================================================================
          TODO: Add product badges here
          Example:
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.discount > 0 && <span className="badge badge-sale">-{product.discount}%</span>}
          {product.stock === 0 && <span className="badge badge-out">Out of Stock</span>}
          ================================================================= */}
      
      <div className="relative overflow-hidden rounded-lg">
        {/* 
          TODO: Add wishlist button overlay
          <button className="wishlist-btn" onClick={() => toggleWishlist(product.id)}>
            ❤️
          </button>
        */}
        <img 
          src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
          alt={product.name} 
          loading="lazy"
          className="w-full aspect-square object-cover rounded-lg mb-5 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* TODO: Add product rating display here
          <div className="product-rating">
            {[1,2,3,4,5].map(star => (
              <span key={star} className={star <= product.rating ? 'star-filled' : 'star-empty'}>★</span>
            ))}
            <span className="rating-count">({product.reviewCount})</span>
          </div>
      */}
      
      <h3 className="text-xl font-semibold mb-2">
        {product.name}
      </h3>
      
      {/* Truncate description for uniform card height */}
      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 min-h-12">
        {product.description}
      </p>
      
      {/* TODO: Show original price if discounted
          {product.originalPrice && (
            <span className="original-price">{formatINR(product.originalPrice)}</span>
          )}
      */}
      <span className="text-2xl font-extrabold my-4">
        {formatINR(Number(product.price))}
      </span>
      
      {/* =================================================================
          TODO: Add quick action buttons
          <div className="card-actions">
            <button className="btn-quick-add" onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
            <Link to={`/products/${product.id}`} className="btn-view">
              View
            </Link>
          </div>
          ================================================================= */}
      
      <Link 
        to={`/products/${product.id}`}
        className="mt-auto btn-outline btn-block text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;