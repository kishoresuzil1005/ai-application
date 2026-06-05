import React from 'react';
import { useRouter } from 'next/navigation';

export default function Features() {
  const router = useRouter();

  return (
    <div>
      <h1>Features</h1>
      <p>This is the features page.</p>
      <button onClick={() => router.push('/')}>Go to Home</button>
    </div>
  );
}