import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios.get('https://example.com/api/cart')
      .then(response => {
        setCartItems(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="cart">
      <h1>Cart</h1>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>{item.name} x {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
}