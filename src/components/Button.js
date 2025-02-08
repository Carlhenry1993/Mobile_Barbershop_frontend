// Button.js
import React from 'react';

const Button = ({ children, onClick, className, type, variant }) => {
  const buttonClass = `${className} ${variant === 'link' ? 'text-blue-500' : 'bg-blue-500 text-white'} p-2 rounded`;
  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;
