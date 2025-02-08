export const sendBooking = async (data) => {
    return await fetch("https://mobile-barbershop-backend.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };
  
  export const sendContactMessage = async (data) => {
    return await fetch("https://mobile-barbershop-backend.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };
  
  