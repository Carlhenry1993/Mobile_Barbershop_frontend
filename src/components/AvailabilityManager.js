import React, { useState, useEffect } from 'react';
import TimePicker from 'react-time-picker'; // Importing the time picker component
import 'react-time-picker/dist/TimePicker.css'; // Import CSS for the time picker

const AvailabilityManager = () => {
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState('');

  const handleDaySelection = (day) => {
    setSelectedDay(day);
    if (!availability[day]) {
      setAvailability((prev) => ({
        ...prev,
        [day]: [],
      }));
    }
  };

  const handleTimeChange = (day, index, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, idx) => (idx === index ? value : slot)),
    }));
  };

  const addTimeSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), ''],
    }));
  };

  const removeTimeSlot = (day, index) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, idx) => idx !== index),
    }));
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    console.log('Updated availability:', availability);
  }, [availability]);

  return (
    <div className="availability-manager">
      <h2>Manage Your Availability</h2>
      <div className="day-selector">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => handleDaySelection(day)}
            className={day === selectedDay ? 'selected' : ''}
          >
            {day}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="time-slots">
          <h3>{selectedDay} Slots</h3>
          {availability[selectedDay]?.map((slot, index) => (
            <div key={index} className="time-slot">
              <TimePicker
                value={slot}
                onChange={(value) => handleTimeChange(selectedDay, index, value)}
              />
              <button onClick={() => removeTimeSlot(selectedDay, index)}>Remove</button>
            </div>
          ))}
          <button onClick={() => addTimeSlot(selectedDay)}>Add Slot</button>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
