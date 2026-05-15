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

function AvailabilityTable({ availability }) {
  return (
    <div className="availability-table">
      {availability.map(({ day, slots }) => (
        <div key={day} className="day-availability">
          <h3>{day}</h3>

          <div className="slots">
            {slots.map((slot, index) => {
              const disabled = !isValidSlot(slot);

              return (
                <button
                  key={index}
                  className={`slot-button ${
                    disabled ? 'disabled-slot' : ''
                  }`}
                  disabled={disabled}
                >
                  {new Date(slot).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AvailabilityTable;