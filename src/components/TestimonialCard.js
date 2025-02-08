import React from "react";

const TestimonialCard = ({ quote, author }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-lg text-gray-600 mb-4">{quote}</p>
      <p className="font-semibold text-primary">{author}</p>
    </div>
  );
};

export default TestimonialCard;
