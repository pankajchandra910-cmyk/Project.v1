import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Search, User, Menu, X, LogOut } from "lucide-react";

import { GlobalContext } from "./GlobalContext";
import { analytics } from "../firebase"; // 1. Import analytics
import { logEvent } from "firebase/analytics"; // 2. Import logEvent

// --- Component Imports ---
import { Button } from "./button";
import { Input } from "./Input";
import LogoSvg from '../assets/buddy-in-hills-logo.svg';

export default function Header({ onSearch, onProfileClick, onLogoClick, onMenuToggle }) {
  const {
    isLoggedIn,
    userName,
    searchQuery,
    setSearchQuery,
    showMobileMenu,
    // setShowMobileMenu, // Removed as it's not directly used here, but handled by onMenuToggle prop
    logout1,
  } = useContext(GlobalContext);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchQuery.trim();
    if (term) {
      // 3. Log the search event
      if (analytics) {
        logEvent(analytics, 'search', {
          search_term: term,
          source_page: 'Header' // Add source_page for better context
        });
      }
      onSearch(searchQuery);
    }
  };

  const handleProfileClick = () => {
    if (analytics) {
      logEvent(analytics, 'button_click', {
        button_name: 'Profile',
        user_status: isLoggedIn ? 'logged_in' : 'logged_out'
      });
    }
    onProfileClick();
  };

  const handleLogoClick = () => {
    if (analytics) {
      logEvent(analytics, 'button_click', {
        button_name: 'Logo',
        destination: 'Homepage'
      });
    }
    onLogoClick();
  };

  const handleMenuToggle = () => {
    if (analytics) {
      logEvent(analytics, 'button_click', {
        button_name: 'Mobile Menu Toggle',
        menu_state: showMobileMenu ? 'closing' : 'opening'
      });
    }
    onMenuToggle();
  };

  const handleLogout = () => {
    if (analytics) {
      logEvent(analytics, 'user_logout', {
        user_name: userName // Log the user who logged out
      });
    }
    logout1();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Now using SVG */}
          <div className="flex items-center">
            <Link to="/" onClick={handleLogoClick} className="flex items-center">
             <LogoSvg
                className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity
                          text-[#4A6472]"
              />
            </Link>
            <div
              className="text-xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity hidden sm:block"
              onClick={handleLogoClick}
            >
              Buddy In Hills
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search hotels, treks, cabs in Nainital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-primary dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </form>

          {/* User Section and Logout */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden dark:text-gray-50 dark:hover:bg-gray-700"
              onClick={handleMenuToggle}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 dark:text-gray-50 dark:hover:bg-gray-700"
                onClick={handleProfileClick}
              >
                <User className="w-5 h-5" />
                {isLoggedIn && userName && (
                  <span className="hidden sm:inline">{userName}</span>
                )}
              </Button>

              {/* Logout Button (Desktop View Only) */}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center space-x-1 dark:text-gray-50 dark:hover:bg-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search hotels, treks, cabs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-primary dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}