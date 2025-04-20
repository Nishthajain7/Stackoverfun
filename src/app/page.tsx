'use client';

import React from 'react';
import D3ArrayVisualizer from './D3ArrayVisualizer';

const HomePage: React.FC = () => {
  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <D3ArrayVisualizer />
    </main>
  );
};

export default HomePage;