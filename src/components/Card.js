// Card.js
import React from 'react';

const Card = ({ children, className }) => {
  return <div className={`p-4 bg-white shadow-lg rounded-lg ${className}`}>{children}</div>;
};

const CardHeader = ({ children, className }) => {
  return <div className={`font-bold text-lg ${className}`}>{children}</div>;
};

const CardContent = ({ children, className }) => {
  return <div className={`pt-2 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardContent };
