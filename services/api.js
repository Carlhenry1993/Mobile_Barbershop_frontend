export const sendBooking = async (data) => {
  try {
    const response = await fetch("https://mobile-barbershop-backend.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    // Assuming the server returns JSON
    return await response.json();
  } catch (error) {
    // Handle network errors or JSON parsing errors
    console.error("Error in sendBooking:", error);
    throw error;
  }
};

export const sendContactMessage = async (data) => {
  try {
    const response = await fetch("https://mobile-barbershop-backend.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    // Assuming the server returns JSON
    return await response.json();
  } catch (error) {
    // Handle network errors or JSON parsing errors
    console.error("Error in sendContactMessage:", error);
    throw error;
  }
};
