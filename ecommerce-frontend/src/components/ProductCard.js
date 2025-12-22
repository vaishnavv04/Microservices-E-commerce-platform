import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card animate-fade-in">
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
        <img 
          src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
          alt={product.name} 
          loading="lazy"
        />
      </div>
      
      <h3>{product.name}</h3>
      
      {/* Truncate description for uniform card height */}
      <p style={{ 
        display: '-webkit-box', 
        WebkitLineClamp: '2', 
        WebkitBoxOrient: 'vertical', 
        overflow: 'hidden',
        minHeight: '3rem'
      }}>
        {product.description}
      </p>
      
      <span className="price">
        ${Number(product.price).toFixed(2)}
      </span>
      
      <Link to={`/products/${product.id}`}>
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;