import React, { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './Context/CartContext';
import ProductCard from "./Components/ProductCard";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import Cart from "./Components/Cart";
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://assignment-03-backend.vercel.app/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <CartProvider>
      <ToastContainer position="bottom-right" />
      <Header />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="products-grid">
                {products.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            }
          />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </CartProvider>
  );
};

export default App;