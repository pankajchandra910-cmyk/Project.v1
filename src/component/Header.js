import { Search, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "./button";
import { Input } from "./Input";
import React, { useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import { Link } from "react-router-dom"; // <--- ADD THIS LINE
import LogoSvg from '../assets/buddy-in-hills-logo.svg';

export default function Header({ onSearch, onProfileClick, onLogoClick, onMenuToggle }) {
  const {
    isLoggedIn,
    userName,
    searchQuery,
    setSearchQuery,
    showMobileMenu,
    setShowMobileMenu,
    userType,
    logout1,
  } = useContext(GlobalContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Now using SVG */}
          <div className="flex items-center">
            <Link to="/" onClick={onLogoClick} className="flex items-center">
             <LogoSvg
                className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity
                          text-[#4A6472]"
              />
            </Link>
            <div
              className="text-xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity hidden sm:block"
              onClick={onLogoClick}
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
              onClick={onMenuToggle}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 dark:text-gray-50 dark:hover:bg-gray-700"
                onClick={onProfileClick}
              >
                <User className="w-5 h-5" />
                {isLoggedIn && userName && (
                  <span className="hidden sm:inline">{userName}</span>
                )}
              </Button>

              {/* Logout Button (Desktop View Only) */}
              {isLoggedIn && (userType === 'owner' || userType === 'user') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center space-x-1 dark:text-gray-50 dark:hover:bg-gray-700"
                  onClick={logout1}
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