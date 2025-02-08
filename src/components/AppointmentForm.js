import React, { useState } from 'react';

const AppointmentForm = () => {
  const [appointment, setAppointment] = useState({
    userId: '',
    date: '',
    time: '',
    address: '',
    services: [],
    totalCost: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://mobile-barbershop-backend.onrender.com/api/appointments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    });

    const result = await response.json();
    console.log('Appointment created:', result);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userId"
          value={appointment.userId}
          onChange={handleChange}
          placeholder="User ID"
          className="block w-full p-2 mb-4 border rounded"
        />
        <input
          type="datetime-local"
          name="date"
          value={appointment.date}
          onChange={handleChange}
          className="block w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="address"
          value={appointment.address}
          onChange={handleChange}
          placeholder="Address"
          className="block w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="services"
          value={appointment.services}
          onChange={handleChange}
          placeholder="Services (comma separated)"
          className="block w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          name="totalCost"
          value={appointment.totalCost}
          onChange={handleChange}
          placeholder="Total Cost"
          className="block w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
