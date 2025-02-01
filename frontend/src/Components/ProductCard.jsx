import React from 'react';
import { useCart } from '../Context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image"
      />
      <h3 className="product-name">{product.name}</h3>
      <ul className="specifications-list">
        {product.specifications.map((spec, index) => (
          <li key={index} className="specification-item">{spec}</li>
        ))}
      </ul>
      <p className="product-price">Rs {product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="add-to-cart-button"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;