import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>Welcome to Mobile Shop</h1>
      <button onClick={() => router.push('/products')}>View Products</button>
    </div>
  );
}