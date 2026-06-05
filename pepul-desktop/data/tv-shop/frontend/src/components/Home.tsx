import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero">
      <h1>Welcome to TV Shop</h1>
      <p>Shop the latest TVs and electronics</p>
      <Link to="/products" className="btn">Explore Products</Link>
    </div>
  );
}