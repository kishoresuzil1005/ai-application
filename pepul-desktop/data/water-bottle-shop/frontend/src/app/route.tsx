import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './page';
import Products from '../components/Products';
import ProductDetails from '../components/ProductDetails';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}