import React from "react";
import ReactDOM from "react-dom/client"; // Import React 18's createRoot
import "./index.css"; // Your CSS
import App from "./App"; // Your main App component

// Get the root element from HTML and render the app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App /> {/* No need for <Router> here, it's already in App.js */}
  </React.StrictMode>
);
