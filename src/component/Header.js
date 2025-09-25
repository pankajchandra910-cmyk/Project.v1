import { Search, User, Menu } from "lucide-react";
import { Button } from "./button";
import { Input } from "./Input";
import { useState } from "react";


export default function Header({ isLoggedIn, onSearch, userName, onLogoClick, onMenuToggle, showMobileMenu } ) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div 
              className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80  transition-opacity text-[#228B22]"
              onClick={onLogoClick}
            >
              NainiExplore
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
                className="pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-primary"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={onMenuToggle}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={onLogoClick}
              >
                <User className="w-5 h-5" />
                {isLoggedIn && userName && (
                  <span className="hidden sm:inline">{userName}</span>
                )}
              </Button>
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
              className="pr-10"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-primary"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}


