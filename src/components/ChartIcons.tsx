// src/components/ChartIcons.tsx
import React from 'react';

export const BarChartIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 10h3v8H2v-8zm4-4h3v12H6V6zm4-4h3v16h-3V2zm4 6h3v10h-3V8z"/>
  </svg>
);

export const PieChartIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2v8l6 6-6-6V2z"/>
    <path d="M10 2a8 8 0 108 8l-8-8z"/>
  </svg>
);

export const LineChartIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 14l3-3 3 3 6-6 4 4v6H2v-4z"/>
  </svg>
);
