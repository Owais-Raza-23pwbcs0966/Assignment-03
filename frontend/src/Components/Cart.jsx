import React from 'react';
import { useCart } from '../Context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-details">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="item-image"
                  />
                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">Rs {item.price}</p>
                  </div>
                </div>
                <div className="item-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartItem(item._id, parseInt(e.target.value))}
                    className="quantity-input"
                  />
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <p className="total-text">
              Total: Rs {calculateTotal().toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;