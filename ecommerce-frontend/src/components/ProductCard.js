import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
    <img src={product.image_url} alt={product.name} width="100" />
    <h3>{product.name}</h3>
    <p>${product.price}</p>
    <Link to={`/products/${product.id}`}>View Details</Link>
  </div>
);

export default ProductCard;