import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CallToAction from '../components/CallToAction';

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <CallToAction />
    </div>
  );
}