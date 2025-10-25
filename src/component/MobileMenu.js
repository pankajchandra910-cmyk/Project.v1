import React, { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "./GlobalContext";

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
  Home as HomeIcon, // Renamed to HomeIcon to avoid conflict with default export
} from "lucide-react";
import { Button } from "./button";

export default function MobileMenu({ onClose, userType, profession }) {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setIsLoggedIn,
    setShowAIChat,
    logout1
  } = useContext(GlobalContext);

  const menuRef = useRef(null);

  useEffect(() => {
    if (menuRef.current) {
      const firstFocusableElement = menuRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleNavigation = (path, action = null) => {
    navigate(path);
    if (action) action();
    onClose();
  };

  const handleLogin = () => {
    handleNavigation("/login");
  };

  const handleExploreMore = (area) => {
    handleNavigation(`/location-details/${area.toLowerCase().replace(/\s/g, '-')}`);
  };

  const handleDashboardNavigation = () => {
    if (userType === "owner") {
      handleNavigation(`/owner-dashboard/${profession}`);
    } else if (userType === "user") {
      handleNavigation("/profile");
    } else {
      handleNavigation("/");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
      onClick={onClose}
    >
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className="fixed right-0 top-4 h-[calc(100vh-2rem)] w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out rounded-lg mr-4 dark:bg-gray-800 dark:text-gray-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 id="mobile-menu-title" className="text-xl font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 dark:text-gray-50 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4 mt-6">
          {/* Home Button - Added here */}
          <Button
            variant="ghost"
            className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation("/")}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Home
          </Button>

          {isLoggedIn && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
                onClick={handleDashboardNavigation}
              >
                {userType === "owner" ? (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Owner Dashboard
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </>
                )}
              </Button>
              {/* Assuming AIChat also has a route, if not, adjust or remove */}
              <Button
                variant="ghost"
                className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleNavigation("/AIChat", () => setShowAIChat(true))}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleExploreMore("Nainital")} // This will navigate to /location-details/nainital
          >
            <Navigation className="w-4 h-4 mr-2" />
            Explore Map
          </Button>

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          {/* Corrected paths for About Us, Contact, Privacy Policy, Terms of Service */}
          <Button
            variant="ghost"
            className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation("/about")}
          >
            <Info className="w-4 h-4 mr-2" />
            About Us
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation("/contact")}
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation("/privacy")} // Corrected path
          >
            <Lock className="w-4 h-4 mr-2" />
            Privacy Policy
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left dark:text-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleNavigation("/terms")} // Corrected path
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Terms of Service
          </Button>

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
              onClick={logout1} // Make sure logout1 correctly sets isLoggedIn to false and handles state
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
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