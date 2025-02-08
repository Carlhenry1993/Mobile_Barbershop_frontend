import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Define menu items outside the component to avoid re-creation on every render.
const MENU_ITEMS = [
  { name: 'Accueil', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Réservation', path: '/booking' },
  { name: 'À propos', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Annonces', path: '/annonces' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Toggle the mobile menu
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close the mobile menu when a menu item is clicked
  const handleMenuItemClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-heading font-bold">
          Mr. Renaudin Barbershop
        </Link>

        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="lg:hidden block focus:outline-none text-white"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Menu Items */}
        <ul
          id="mobile-menu"
          className={`lg:flex items-center transition-transform duration-300 ease-in-out ${
            isOpen ? 'block' : 'hidden'
          } lg:block`}
        >
          {MENU_ITEMS.map((item) => (
            <li
              key={item.name}
              className={`lg:mx-4 my-2 lg:my-0 ${
                pathname === item.path ? 'border-b-2 border-accent' : ''
              }`}
            >
              <Link
                to={item.path}
                className="font-body hover:text-accent transition duration-200"
                onClick={handleMenuItemClick}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
