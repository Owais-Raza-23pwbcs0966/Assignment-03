import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product) => {
    try {
      // Backend API call to add item
      await axios.post('https://assignment-03-backend.vercel.app/api/cart', {
        userId: "user123", // You'll need to implement actual user authentication
        productId: product._id,
        quantity: 1
      });

      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Backend API call to remove item
      await axios.delete(`https://assignment-03-backend.vercel.app/api/cart/${productId}`, {
        data: { userId: "user123" } // Pass userId in the request body
      });
  
      setCartItems(cartItems.filter(item => item._id !== productId));
      toast.success('Product removed from cart!');
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      // Backend API call to update item
      await axios.put(`https://assignment-03-backend.vercel.app/api/cart/${productId}`, { 
        userId: "user123", // Pass userId in the request body
        quantity 
      });
  
      setCartItems(cartItems.map(item => 
        item._id === productId ? { ...item, quantity } : item
      ));
      toast.success('Changes saved successfully!');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);