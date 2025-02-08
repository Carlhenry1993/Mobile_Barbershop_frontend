import React from "react";
import Header from "./Header"; // Import du Header
import Footer from "./Footer"; // Import du Footer

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Affiche le Header une seule fois */}
      <main className="flex-grow bg-gray-100 pt-16">{children}</main> {/* Contenu principal */}
      <Footer /> {/* Affiche le Footer une seule fois */}
    </div>
  );
};

export default Layout;
