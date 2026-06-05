import React from 'react';
import { useRouter } from 'next/navigation';

export default function Download() {
  const router = useRouter();

  return (
    <div>
      <h1>Download</h1>
      <p>This is the download page.</p>
      <button onClick={() => router.push('/')}>Go to Home</button>
    </div>
  );
}