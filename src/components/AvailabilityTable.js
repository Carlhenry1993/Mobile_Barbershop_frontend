import React from 'react';

function AvailabilityTable({ availability }) {
  return (
    <div className="availability-table">
      {availability.map(({ day, slots }) => (
        <div key={day} className="day-availability">
          <h3>{day}</h3>
          <div className="slots">
            {slots.map((slot, index) => (
              <button key={index} className="slot-button">
                {slot}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AvailabilityTable;
