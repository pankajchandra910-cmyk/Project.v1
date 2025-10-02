// src/component/MobileMenu.jsx
import React, { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./GlobalContext"; // Adjust path as needed

import {
  X,
  User,
  MessageCircle,
  Navigation,
  Info,
  Phone,
  Lock,
  BookOpen,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "./button"; // Adjust path as needed

export default function MobileMenu({ onClose }) {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setIsLoggedIn,
    setShowAIChat,
    // setShowMobileMenu is now managed via onClose prop, which updates global context
  } = useContext(GlobalContext);

  const menuRef = useRef(null); // Ref to the menu container for focus management

  // Effect to manage focus when the menu opens
  useEffect(() => {
    if (menuRef.current) {
      // Find the first focusable element inside the menu, e.g., the close button
      const firstFocusableElement = menuRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }

    // Add event listener for keyboard navigation (e.g., Escape key to close)
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      // Add more sophisticated focus trapping if needed, for now escape is enough
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);


  const handleNavigation = (path, action = null) => {
    navigate(path);
    if (action) action();
    onClose(); // Close the menu after navigation
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleNavigation("/login");
  };

  const handleLogin = () => {
    handleNavigation("/login");
  };

  const handleExploreMore = (area) => {
    handleNavigation(`/location-details/${area.toLowerCase().replace(/\s/g, '-')}`);
  };

  return (
    // The overlay container. Added 'backdrop-blur-sm' for blurring.
    // Increased z-index to ensure it's on top
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" // Using bg-black/50 (tailwind for bg-opacity-50)
      onClick={onClose} // Close menu if clicking outside the inner menu panel
    >
      <div
        ref={menuRef} // Attach ref here
        role="dialog" // ARIA role for accessibility
        aria-modal="true" // Indicates it's a modal dialog
        aria-labelledby="mobile-menu-title" // Link to the menu title for screen readers
        className="fixed right-0 top-4 h-[calc(100vh-2rem)] w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out rounded-lg mr-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside menu from closing it
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 id="mobile-menu-title" className="text-xl font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4 mt-6">
          {isLoggedIn && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleNavigation("/profile")}
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleNavigation("/AIChat", () => setShowAIChat(true))}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleExploreMore("Nainital")}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Explore Map
          </Button>

          <hr className="my-4 border-gray-200" />

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleNavigation("/about")}
          >
            <Info className="w-4 h-4 mr-2" />
            About Us
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleNavigation("/contact")}
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleNavigation("/privacy-policy")}
          >
            <Lock className="w-4 h-4 mr-2" />
            Privacy Policy
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => handleNavigation("/terms-of-service")}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Terms of Service
          </Button>

          <hr className="my-4 border-gray-200" />

          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-green-600 hover:bg-green-50"
              onClick={handleLogin}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}