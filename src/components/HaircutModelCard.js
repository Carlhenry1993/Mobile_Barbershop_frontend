import React from "react";

const HaircutModelCard = ({ imageSrc, altText, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-primary mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HaircutModelCard;
