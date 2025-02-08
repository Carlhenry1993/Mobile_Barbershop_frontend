import React from 'react';

function AvailabilitySelector({ availability, onSlotSelect }) {
  return (
    <div className="mt-4">
      {availability.map((slot, index) => (
        <button
          key={index}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none"
          onClick={() => onSlotSelect(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}

export default AvailabilitySelector;
