import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl font-bold">Welcome to Dress Shop Website</h1>
      <p className="text-lg">Browse our collection of dresses</p>
      <Link href="/dresses">
        <a className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">Browse Dresses</a>
      </Link>
    </div>
  );
}