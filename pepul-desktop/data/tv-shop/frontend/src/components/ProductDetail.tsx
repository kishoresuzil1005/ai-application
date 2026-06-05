import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`https://example.com/api/products/${productId}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [productId]);

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}