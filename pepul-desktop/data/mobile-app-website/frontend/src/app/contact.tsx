import React from 'react';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();

  return (
    <div>
      <h1>Contact Us</h1>
      <p>This is the contact page.</p>
      <button onClick={() => router.push('/')}>Go to Home</button>
    </div>
  );
}