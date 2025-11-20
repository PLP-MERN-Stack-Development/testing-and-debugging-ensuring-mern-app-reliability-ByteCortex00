import React from 'react';
import './Button.css'; // Assume basic CSS

const Button = ({ variant = 'primary', size = 'md', disabled, onClick, children }) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;