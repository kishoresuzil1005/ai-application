import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between bg-gray-800 text-white p-4">
      <Link href="/">
        <a>Dress Shop Website</a>
      </Link>
      <ul>
        <li>
          <Link href="/dresses">
            <a>Dresses</a>
          </Link>
        </li>
        <li>
          <Link href="/cart">
            <a>Cart</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}