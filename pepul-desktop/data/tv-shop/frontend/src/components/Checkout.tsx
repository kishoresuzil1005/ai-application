import React, { useState } from 'react';

export default function Checkout() {
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleShippingAddressChange = (event) => {
    setShippingAddress({ ...shippingAddress, [event.target.name]: event.target.value });
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit order
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <label>Shipping Address:</label>
        <input type="text" name="address" value={shippingAddress.address} onChange={handleShippingAddressChange} />
        <label>Payment Method:</label>
        <select value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}