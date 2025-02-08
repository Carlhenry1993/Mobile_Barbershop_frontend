module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}", // Add path for your JSX files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // Primary color
        background: "#f5f5f5", // Background color
        secondary: "#4B5563", // Secondary color (for testimonials section)
        accent: "#FF6347", // Accent color
      },
      fontFamily: {
        heading: ["'Roboto', sans-serif"], // Example of adding custom font
      },
    },
  },
  plugins: [],
};
