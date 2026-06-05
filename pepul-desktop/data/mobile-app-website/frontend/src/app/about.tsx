import React from 'react';
import { useRouter } from 'next/navigation';

export default function About() {
  const router = useRouter();

  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page.</p>
      <button onClick={() => router.push('/')}>Go to Home</button>
    </div>
  );
}