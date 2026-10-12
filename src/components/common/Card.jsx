import React from 'react';

export default function Card({ children, variant = 'default', className = '' }) {
  const baseClass =
    variant === 'blue'
      ? 'ofic-card-blue'
      : variant === 'tinted'
        ? 'ofic-card-tinted'
        : 'ofic-card';

  return <div className={`${baseClass} p-6 ${className}`}>{children}</div>;
}
