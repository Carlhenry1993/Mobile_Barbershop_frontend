export const sendBooking = async (data) => {
  try {
    const response = await fetch("https://api.mrrenaudinbarbershop.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in sendBooking:", error);
    throw error;
  }
};

export const sendContactMessage = async (data) => {
  try {
    const response = await fetch("https://api.mrrenaudinbarbershop.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in sendContactMessage:", error);
    throw error;
  }
};
