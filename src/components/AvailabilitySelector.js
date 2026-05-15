import React from 'react';

const SHOP_HOURS = {
  0: { start: 11, end: 17 },
  1: { start: 11, end: 19 },
  2: { start: 11, end: 19 },
  3: { start: 11, end: 19 },
  4: { start: 11, end: 19 },
  5: { start: 11, end: 19 },
  6: { start: 12, end: 19 },
};

function isValidSlot(slot) {
  const d = new Date(slot);
  const day = d.getDay();
  const hour = d.getHours() + d.getMinutes() / 60;

  const hours = SHOP_HOURS[day];
  if (!hours) return false;

  return hour >= hours.start && hour < hours.end;
}

function AvailabilitySelector({ availability, onSlotSelect }) {
  return (
    <div className="mt-4">
      {availability.map((slot, index) => {
        const disabled = !isValidSlot(slot);

        return (
          <button
            key={index}
            disabled={disabled}
            className={`px-4 py-2 rounded-md transition ${
              disabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
            onClick={() => {
              if (!disabled) onSlotSelect(slot);
            }}
          >
            {new Date(slot).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </button>
        );
      })}
    </div>
  );
}

export default AvailabilitySelector;