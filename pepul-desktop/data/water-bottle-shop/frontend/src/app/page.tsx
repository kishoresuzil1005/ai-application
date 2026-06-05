import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
    </>
  );
}