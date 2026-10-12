import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  icon = '',
  className = '',
  fullWidth = false
}) {
  const variantClasses = {
    primary: 'ofic-btn-primary',
    outline: 'ofic-btn-outline',
    danger: 'ofic-btn-danger',
    success: 'ofic-btn-success'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ofic-btn ${variantClasses[variant] || 'ofic-btn-primary'} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {icon && <i className={`bi ${icon}`}></i>}
      <span>{children}</span>
    </button>
  );
}
