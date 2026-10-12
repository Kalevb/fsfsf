import React from 'react';

export default function Badge({ children, tone = 'blue', icon = '' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    dark: 'bg-[#1E3A8A] text-white border-blue-800'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border whitespace-nowrap ${
        tones[tone] || tones.blue
      }`}
    >
      {icon && <i className={`bi ${icon}`}></i>}
      {children}
    </span>
  );
}
