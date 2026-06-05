import React from 'react';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const products = [
    { id: 1, name: 'Product 1', price: 19.99 },
    { id: 2, name: 'Product 2', price: 9.99 },
    { id: 3, name: 'Product 3', price: 29.99 }
  ];

  return (
    <section>
      <h2>Featured Products</h2>
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}