import React from "react";

const Button = ({ text, onClick, className, ariaLabel }) => (
  <button
    onClick={onClick}
    className={`py-2 px-6 rounded-lg font-bold focus:outline-none ${className}`}
    aria-label={ariaLabel}
  >
    {text}
  </button>
);

export default Button;
